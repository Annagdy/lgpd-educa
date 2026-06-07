CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE NOT NULL,

    token_confirmation VARCHAR(255) UNIQUE,
    token_reset_password VARCHAR(255) UNIQUE,
    token_expiration TIMESTAMP WITH TIME ZONE,

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users (email);

ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_email_verified BOOLEAN DEFAULT FALSE NOT NULL;
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_confirmation VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_reset_password VARCHAR(255) UNIQUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS token_expiration TIMESTAMP WITH TIME ZONE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

CREATE TABLE IF NOT EXISTS progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL UNIQUE REFERENCES users (id) ON DELETE CASCADE,
    modules_completed SMALLINT DEFAULT 0 NOT NULL,
    best_quiz_percentage NUMERIC(5, 2) DEFAULT 0 NOT NULL,
    quiz_attempts_count INTEGER DEFAULT 0 NOT NULL,
    general_points NUMERIC(10, 2) DEFAULT 0 NOT NULL,
    update_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
);

ALTER TABLE progress ADD COLUMN IF NOT EXISTS best_quiz_percentage NUMERIC(5, 2) DEFAULT 0 NOT NULL;
ALTER TABLE progress ADD COLUMN IF NOT EXISTS quiz_attempts_count INTEGER DEFAULT 0 NOT NULL;

CREATE OR REPLACE FUNCTION update_progress_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.update_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_progress_timestamp_trigger ON progress;

CREATE TRIGGER update_progress_timestamp_trigger
    BEFORE UPDATE ON progress
    FOR EACH ROW
    EXECUTE FUNCTION update_progress_timestamp();

CREATE TABLE IF NOT EXISTS modules (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS module_sections (
    id SERIAL PRIMARY KEY,
    module_id INTEGER NOT NULL REFERENCES modules (id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_module_sections_module_id
    ON module_sections (module_id, sort_order);

CREATE TABLE IF NOT EXISTS module_progress (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    module_id INTEGER NOT NULL REFERENCES modules (id) ON DELETE CASCADE,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, module_id)
);

CREATE INDEX IF NOT EXISTS idx_module_progress_user_id
    ON module_progress (user_id, module_id);

CREATE TABLE IF NOT EXISTS glossary_terms (
    id SERIAL PRIMARY KEY,
    term VARCHAR(255) NOT NULL UNIQUE,
    definition TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz_options (
    id SERIAL PRIMARY KEY,
    question_id INTEGER NOT NULL REFERENCES quiz_questions (id) ON DELETE CASCADE,
    option_text TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT FALSE NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    score INTEGER NOT NULL,
    total_questions INTEGER NOT NULL,
    percentage NUMERIC(5, 2) NOT NULL,
    answers JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO modules (id, title, description) VALUES
    (1, 'Introdução à LGPD', 'Conceitos fundamentais da Lei Geral de Proteção de Dados: origem, objetivos e estrutura da lei.'),
    (2, 'Segurança da Informação', 'Boas práticas de proteção de dados, criptografia, controle de acesso e incidentes de segurança.'),
    (3, 'Direitos do Titular', 'Conheça os direitos garantidos pela LGPD aos cidadãos e como exercê-los junto às organizações.'),
    (4, 'Bases Legais do Tratamento', 'Entenda as hipóteses que legitimam o tratamento de dados pessoais segundo a LGPD.'),
    (5, 'Governança e Compliance', 'Como implementar um programa de governança de dados, encarregado e boas práticas de conformidade.'),
    (6, 'Sanções e ANPD', 'Penalidades previstas na LGPD, papel da Autoridade Nacional de Proteção de Dados e fiscalização.')
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description;

DELETE FROM module_sections;
INSERT INTO module_sections (module_id, title, content, sort_order) VALUES
    (1, 'O que é a LGPD?', 'A Lei Geral de Proteção de Dados Pessoais, Lei nº 13.709/2018, regula as atividades de tratamento de dados pessoais no Brasil.', 1),
    (1, 'Por que ela foi criada?', 'Com a coleta crescente de dados por empresas e governos, a lei criou regras para privacidade, transparência e proteção dos cidadãos.', 2),
    (1, 'Quando entrou em vigor?', 'A LGPD foi sancionada em 2018. As sanções administrativas passaram a valer em agosto de 2021, com fiscalização da ANPD.', 3),
    (2, 'Princípios de segurança', 'A LGPD exige medidas técnicas e administrativas para proteger dados contra acesso não autorizado, perda, alteração, comunicação ou difusão indevida.', 1),
    (2, 'Boas práticas', 'Criptografia, controle de acesso, backups, monitoramento e treinamento das equipes reduzem riscos e fortalecem a proteção de dados.', 2),
    (3, 'Quem são os titulares?', 'Titular é a pessoa natural a quem se referem os dados pessoais tratados por uma organização.', 1),
    (3, 'Direitos garantidos', 'O titular pode pedir confirmação de tratamento, acesso, correção, anonimização, eliminação, portabilidade e informação sobre compartilhamento.', 2),
    (4, 'Quais são as bases legais?', 'A lei prevê hipóteses como consentimento, obrigação legal, execução de contrato, tutela da saúde, proteção da vida e legítimo interesse.', 1),
    (4, 'Consentimento é a única base?', 'Não. Cada tratamento deve identificar a base legal adequada, respeitando finalidade, necessidade e transparência.', 2),
    (5, 'Governança em privacidade', 'Governança reúne políticas, processos, papéis e controles para tratar dados de forma responsável e em conformidade.', 1),
    (5, 'Boas práticas de compliance', 'Mapeamento de dados, registro de operações, treinamentos, plano de resposta a incidentes e atuação do encarregado fortalecem a conformidade.', 2),
    (6, 'Papel da ANPD', 'A Autoridade Nacional de Proteção de Dados orienta, regulamenta, fiscaliza e pode instaurar processos administrativos.', 1),
    (6, 'Sanções possíveis', 'As sanções incluem advertência, publicização da infração, bloqueio ou eliminação de dados e multa conforme critérios legais.', 2);

INSERT INTO glossary_terms (term, definition) VALUES
    ('LGPD', 'Lei Geral de Proteção de Dados, Lei nº 13.709/2018, que regula o tratamento de dados pessoais no Brasil.'),
    ('Dado Pessoal', 'Informação relacionada a pessoa natural identificada ou identificável, como nome, CPF, e-mail, endereço ou IP.'),
    ('Dado Sensível', 'Dado sobre origem racial ou étnica, religião, opinião política, saúde, vida sexual, genética ou biometria.'),
    ('Titular dos Dados', 'Pessoa natural a quem se referem os dados pessoais tratados.'),
    ('Controlador', 'Pessoa natural ou jurídica que toma decisões sobre o tratamento de dados pessoais.'),
    ('Operador', 'Pessoa natural ou jurídica que trata dados pessoais em nome do controlador.'),
    ('ANPD', 'Autoridade Nacional de Proteção de Dados, órgão responsável por zelar pela proteção de dados e fiscalizar a LGPD.'),
    ('Consentimento', 'Manifestação livre, informada e inequívoca pela qual o titular concorda com tratamento para finalidade determinada.'),
    ('Tratamento de Dados', 'Toda operação com dados pessoais, como coleta, acesso, armazenamento, modificação, compartilhamento ou eliminação.'),
    ('Anonimização', 'Processo que retira a possibilidade de associação direta ou indireta de um dado a uma pessoa.'),
    ('DPO (Encarregado)', 'Pessoa indicada para atuar como canal entre controlador, titulares dos dados e ANPD.'),
    ('Bases Legais', 'Hipóteses previstas na LGPD que autorizam o tratamento de dados pessoais.')
ON CONFLICT (term) DO UPDATE SET definition = EXCLUDED.definition;

DELETE FROM quiz_options;
DELETE FROM quiz_questions;
INSERT INTO quiz_questions (id, question, sort_order) VALUES
    (1, 'O que significa a sigla LGPD?', 1),
    (2, 'Qual órgão fiscaliza o cumprimento da LGPD no Brasil?', 2),
    (3, 'O que são dados pessoais sensíveis segundo a LGPD?', 3),
    (4, 'Qual é uma base legal para tratamento de dados pessoais?', 4),
    (5, 'Qual direito o titular dos dados possui?', 5)
ON CONFLICT (id) DO UPDATE SET question = EXCLUDED.question, sort_order = EXCLUDED.sort_order;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) VALUES
    (1, 'Lei Geral de Proteção de Dados', true, 1),
    (1, 'Lei Global de Processamento Digital', false, 2),
    (1, 'Legislação Geral de Privacidade Digital', false, 3),
    (1, 'Lei Geral de Política de Dados', false, 4),
    (2, 'Ministério da Justiça', false, 1),
    (2, 'ANPD - Autoridade Nacional de Proteção de Dados', true, 2),
    (2, 'IBGE', false, 3),
    (2, 'Banco Central', false, 4),
    (3, 'Dados financeiros sigilosos de empresas', false, 1),
    (3, 'Dados sobre origem racial, saúde, biometria, entre outros', true, 2),
    (3, 'Informações de contato como e-mail e telefone', false, 3),
    (3, 'Qualquer dado armazenado em nuvem', false, 4),
    (4, 'Interesse comercial da empresa', false, 1),
    (4, 'Consentimento do titular', true, 2),
    (4, 'Autorização de qualquer servidor público', false, 3),
    (4, 'Publicação nas redes sociais', false, 4),
    (5, 'Exigir que seus dados nunca sejam usados por ninguém', false, 1),
    (5, 'Revogar o consentimento a qualquer momento', true, 2),
    (5, 'Processar criminalmente qualquer empresa que colete dados', false, 3),
    (5, 'Solicitar a exclusão de dados de domínio público', false, 4);
