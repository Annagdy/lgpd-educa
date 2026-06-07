const db = require('../config/db');

const MODULE_POINTS = 100;
const QUIZ_PERCENTAGE_MULTIPLIER = 2;

async function syncUserProgress(userId) {
  const [modulesResult, quizResult] = await Promise.all([
    db.query(
      'SELECT COUNT(*)::int AS total FROM module_progress WHERE user_id = $1',
      [userId]
    ),
    db.query(
      `SELECT
        COALESCE(MAX(percentage), 0)::numeric(5, 2) AS best_quiz_percentage,
        COUNT(*)::int AS quiz_attempts_count
       FROM quiz_attempts
       WHERE user_id = $1`,
      [userId]
    ),
  ]);

  const modulesCompleted = Number(modulesResult.rows[0]?.total || 0);
  const bestQuizPercentage = Number(quizResult.rows[0]?.best_quiz_percentage || 0);
  const quizAttemptsCount = Number(quizResult.rows[0]?.quiz_attempts_count || 0);
  const generalPoints = Number((modulesCompleted * MODULE_POINTS + bestQuizPercentage * QUIZ_PERCENTAGE_MULTIPLIER).toFixed(2));

  const progressResult = await db.query(
    `INSERT INTO progress (user_id, modules_completed, best_quiz_percentage, quiz_attempts_count, general_points)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (user_id) DO UPDATE SET
       modules_completed = EXCLUDED.modules_completed,
       best_quiz_percentage = EXCLUDED.best_quiz_percentage,
       quiz_attempts_count = EXCLUDED.quiz_attempts_count,
       general_points = EXCLUDED.general_points
     RETURNING user_id, modules_completed, best_quiz_percentage, quiz_attempts_count, general_points, update_at`,
    [userId, modulesCompleted, bestQuizPercentage, quizAttemptsCount, generalPoints]
  );

  return progressResult.rows[0];
}

async function getRankForUser(userId) {
  const rankingResult = await db.query(
    `WITH ranked AS (
       SELECT
         user_id,
         RANK() OVER (
           ORDER BY general_points DESC, modules_completed DESC, best_quiz_percentage DESC, update_at ASC
         ) AS rank_position
       FROM progress
     )
     SELECT rank_position FROM ranked WHERE user_id = $1`,
    [userId]
  );

  return Number(rankingResult.rows[0]?.rank_position || 0);
}

exports.listModules = async (_req, res) => {
  try {
    const result = await db.query(
      'SELECT id, title, description FROM modules ORDER BY id'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar módulos:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

exports.getModuleById = async (req, res) => {
  const moduleId = Number(req.params.id);

  if (!Number.isInteger(moduleId) || moduleId <= 0) {
    return res.status(400).json({ message: 'ID de módulo inválido.' });
  }

  try {
    const moduleResult = await db.query(
      'SELECT id, title, description FROM modules WHERE id = $1',
      [moduleId]
    );

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Módulo não encontrado.' });
    }

    const sectionsResult = await db.query(
      `SELECT id, title, content, sort_order
       FROM module_sections
       WHERE module_id = $1
       ORDER BY sort_order, id`,
      [moduleId]
    );

    return res.json({
      ...moduleResult.rows[0],
      sections: sectionsResult.rows.map(({ id, title, content, sort_order }) => ({
        id,
        title,
        content,
        sortOrder: sort_order,
      })),
    });
  } catch (err) {
    console.error('Erro ao buscar módulo:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

exports.listGlossaryTerms = async (_req, res) => {
  try {
    const result = await db.query(
      'SELECT id, term, definition FROM glossary_terms ORDER BY term'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar glossário:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

exports.getQuiz = async (_req, res) => {
  try {
    const result = await db.query(
      `SELECT
        q.id AS question_id,
        q.question,
        o.id AS option_id,
        o.option_text
       FROM quiz_questions q
       JOIN quiz_options o ON o.question_id = q.id
       ORDER BY q.sort_order, q.id, o.sort_order, o.id`
    );

    const questions = result.rows.reduce((acc, row) => {
      let question = acc.find((item) => item.id === row.question_id);

      if (!question) {
        question = {
          id: row.question_id,
          question: row.question,
          options: [],
        };
        acc.push(question);
      }

      question.options.push({
        id: row.option_id,
        text: row.option_text,
      });

      return acc;
    }, []);

    return res.json(questions);
  } catch (err) {
    console.error('Erro ao carregar quiz:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

exports.realizarQuiz = async (req, res) => {
  const { answers } = req.body;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ message: 'Envie as respostas do quiz.' });
  }

  const normalizedAnswers = answers
    .map((answer) => ({
      questionId: Number(answer.questionId),
      optionId: Number(answer.optionId),
    }))
    .filter((answer) => Number.isInteger(answer.questionId) && Number.isInteger(answer.optionId));

  if (normalizedAnswers.length !== answers.length) {
    return res.status(400).json({ message: 'Formato de respostas inválido.' });
  }

  try {
    const questionIds = normalizedAnswers.map((answer) => answer.questionId);
    const result = await db.query(
      `SELECT question_id, id AS option_id
       FROM quiz_options
       WHERE question_id = ANY($1::int[]) AND is_correct = true`,
      [questionIds]
    );

    const correctByQuestion = new Map(
      result.rows.map((row) => [row.question_id, row.option_id])
    );

    const checkedAnswers = normalizedAnswers.map((answer) => ({
      ...answer,
      correctOptionId: correctByQuestion.get(answer.questionId),
      isCorrect: correctByQuestion.get(answer.questionId) === answer.optionId,
    }));

    const score = checkedAnswers.filter((answer) => answer.isCorrect).length;
    const totalQuestions = checkedAnswers.length;
    const percentage = Number(((score / totalQuestions) * 100).toFixed(2));

    const attemptResult = await db.query(
      `INSERT INTO quiz_attempts (user_id, score, total_questions, percentage, answers)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, user_id, score, total_questions, percentage, created_at`,
      [req.user.id, score, totalQuestions, percentage, JSON.stringify(checkedAnswers)]
    );
    const progress = await syncUserProgress(req.user.id);
    const rankPosition = await getRankForUser(req.user.id);

    return res.status(201).json({
      ...attemptResult.rows[0],
      progress,
      rankPosition,
      answers: checkedAnswers,
    });
  } catch (err) {
    console.error('Erro ao realizar quiz:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

exports.completeModule = async (req, res) => {
  const moduleId = Number(req.params.id);

  if (!Number.isInteger(moduleId) || moduleId <= 0) {
    return res.status(400).json({ message: 'ID de modulo invalido.' });
  }

  try {
    const moduleResult = await db.query('SELECT id FROM modules WHERE id = $1', [moduleId]);

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Modulo nao encontrado.' });
    }

    await db.query(
      `INSERT INTO module_progress (user_id, module_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, module_id) DO NOTHING`,
      [req.user.id, moduleId]
    );

    const progress = await syncUserProgress(req.user.id);
    const rankPosition = await getRankForUser(req.user.id);

    return res.json({
      message: 'Modulo marcado como concluido.',
      progress,
      rankPosition,
    });
  } catch (err) {
    console.error('Erro ao concluir modulo:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const progress = await syncUserProgress(req.user.id);
    const rankPosition = await getRankForUser(req.user.id);

    const [completedResult, modulesResult, lastQuizResult] = await Promise.all([
      db.query(
        'SELECT module_id FROM module_progress WHERE user_id = $1 ORDER BY module_id',
        [req.user.id]
      ),
      db.query('SELECT COUNT(*)::int AS total FROM modules'),
      db.query(
        `SELECT id, score, total_questions, percentage, created_at
         FROM quiz_attempts
         WHERE user_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [req.user.id]
      ),
    ]);

    const totalModules = Number(modulesResult.rows[0]?.total || 0);
    const modulesCompleted = Number(progress.modules_completed || 0);
    const moduleCompletionPercentage = totalModules > 0
      ? Math.round((modulesCompleted / totalModules) * 100)
      : 0;

    return res.json({
      user: {
        id: req.user.id,
        email: req.user.email,
      },
      progress: {
        ...progress,
        rankPosition,
        totalModules,
        moduleCompletionPercentage,
        completedModuleIds: completedResult.rows.map((row) => row.module_id),
        calculation: {
          modulePoints: MODULE_POINTS,
          quizPercentageMultiplier: QUIZ_PERCENTAGE_MULTIPLIER,
          formula: 'general_points = modules_completed * 100 + best_quiz_percentage * 2',
        },
      },
      lastQuizAttempt: lastQuizResult.rows[0] || null,
    });
  } catch (err) {
    console.error('Erro ao carregar perfil:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};

exports.getRanking = async (_req, res) => {
  try {
    const rankingResult = await db.query(
      `SELECT
        RANK() OVER (
          ORDER BY p.general_points DESC, p.modules_completed DESC, p.best_quiz_percentage DESC, p.update_at ASC
        ) AS rank_position,
        u.id AS user_id,
        u.username,
        u.email,
        p.modules_completed,
        p.best_quiz_percentage,
        p.quiz_attempts_count,
        p.general_points,
        p.update_at
       FROM progress p
       JOIN users u ON u.id = p.user_id
       ORDER BY rank_position, u.username NULLS LAST, u.email
       LIMIT 20`
    );

    return res.json(rankingResult.rows);
  } catch (err) {
    console.error('Erro ao carregar ranking:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
