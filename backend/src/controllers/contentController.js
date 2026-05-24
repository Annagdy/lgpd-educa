const pool = require('../config/database');

exports.listModules = async (_req, res) => {
  try {
    const result = await pool.query(
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
    const moduleResult = await pool.query(
      'SELECT id, title, description FROM modules WHERE id = $1',
      [moduleId]
    );

    if (moduleResult.rows.length === 0) {
      return res.status(404).json({ message: 'Módulo não encontrado.' });
    }

    const sectionsResult = await pool.query(
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
    const result = await pool.query(
      'SELECT id, term, definition FROM glossary_terms ORDER BY term'
    );
    return res.json(result.rows);
  } catch (err) {
    console.error('Erro ao listar glossário:', err);
    return res.status(500).json({ message: 'Erro interno do servidor.' });
  }
};
