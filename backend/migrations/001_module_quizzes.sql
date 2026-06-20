-- Migration 001: Quizzes por módulo
-- Execute no psql: psql $DATABASE_URL -f migrations/001_module_quizzes.sql

ALTER TABLE quiz_questions
  ADD COLUMN IF NOT EXISTS module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE;

CREATE INDEX IF NOT EXISTS idx_quiz_questions_module_id ON quiz_questions(module_id);

-- Idempotente: remove quizzes de módulo antes de reinserir
DELETE FROM quiz_questions WHERE module_id IS NOT NULL;

-- ===================== MÓDULO 1 — Introdução à LGPD =====================
WITH q1 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('O que é a LGPD?', 1, 1) RETURNING id
),
q2 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Quando as sanções administrativas da LGPD entraram em vigor?', 1, 2) RETURNING id
),
q3 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Qual órgão é responsável por fiscalizar o cumprimento da LGPD?', 1, 3) RETURNING id
)
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order)
SELECT id,'Uma lei que regula o uso de internet no Brasil',false,1 FROM q1 UNION ALL
SELECT id,'A Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018)',true,2 FROM q1 UNION ALL
SELECT id,'Uma lei de segurança cibernética para empresas de tecnologia',false,3 FROM q1 UNION ALL
SELECT id,'Uma norma técnica da Anatel',false,4 FROM q1 UNION ALL
SELECT id,'Em agosto de 2018, quando foi sancionada',false,1 FROM q2 UNION ALL
SELECT id,'Em janeiro de 2020',false,2 FROM q2 UNION ALL
SELECT id,'Em agosto de 2021',true,3 FROM q2 UNION ALL
SELECT id,'Em dezembro de 2022',false,4 FROM q2 UNION ALL
SELECT id,'Anatel',false,1 FROM q3 UNION ALL
SELECT id,'Procon',false,2 FROM q3 UNION ALL
SELECT id,'ANPD — Autoridade Nacional de Proteção de Dados',true,3 FROM q3 UNION ALL
SELECT id,'Tribunal de Contas da União (TCU)',false,4 FROM q3;

-- ===================== MÓDULO 2 — Segurança da Informação =====================
WITH q1 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('O que a LGPD exige das organizações para proteger dados pessoais?', 2, 1) RETURNING id
),
q2 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('O que significa RBAC no contexto de segurança da informação?', 2, 2) RETURNING id
),
q3 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Qual prática NÃO é recomendada pela LGPD para proteção de dados?', 2, 3) RETURNING id
)
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order)
SELECT id,'Apenas adotar senhas fortes',false,1 FROM q1 UNION ALL
SELECT id,'Somente realizar backups diários',false,2 FROM q1 UNION ALL
SELECT id,'Adotar medidas técnicas e administrativas para proteger dados de acessos não autorizados',true,3 FROM q1 UNION ALL
SELECT id,'Contratar exclusivamente auditores externos',false,4 FROM q1 UNION ALL
SELECT id,'Registro Brasileiro de Acesso e Controle',false,1 FROM q2 UNION ALL
SELECT id,'Role-Based Access Control — Controle de acesso baseado em funções',true,2 FROM q2 UNION ALL
SELECT id,'Rede Brasileira de Auditoria e Conformidade',false,3 FROM q2 UNION ALL
SELECT id,'Regulação Brasileira de Autenticação e Criptografia',false,4 FROM q2 UNION ALL
SELECT id,'Criptografar dados sensíveis',false,1 FROM q3 UNION ALL
SELECT id,'Monitorar continuamente os sistemas',false,2 FROM q3 UNION ALL
SELECT id,'Compartilhar senhas entre colaboradores para facilitar o trabalho',true,3 FROM q3 UNION ALL
SELECT id,'Treinar colaboradores sobre segurança da informação',false,4 FROM q3;

-- ===================== MÓDULO 3 — Direitos do Titular =====================
WITH q1 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Quem é o "titular" segundo a LGPD?', 3, 1) RETURNING id
),
q2 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Qual destes NÃO é um direito garantido pela LGPD ao titular?', 3, 2) RETURNING id
),
q3 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('O que é a portabilidade de dados?', 3, 3) RETURNING id
)
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order)
SELECT id,'O dono da empresa que coleta os dados',false,1 FROM q1 UNION ALL
SELECT id,'O sistema de armazenamento de dados',false,2 FROM q1 UNION ALL
SELECT id,'A pessoa natural a quem se referem os dados pessoais',true,3 FROM q1 UNION ALL
SELECT id,'O encarregado de proteção de dados da empresa',false,4 FROM q1 UNION ALL
SELECT id,'Acesso aos seus dados pessoais',false,1 FROM q2 UNION ALL
SELECT id,'Portabilidade de seus dados',false,2 FROM q2 UNION ALL
SELECT id,'Receber pagamento pelo uso de seus dados pelas empresas',true,3 FROM q2 UNION ALL
SELECT id,'Revogar o consentimento dado anteriormente',false,4 FROM q2 UNION ALL
SELECT id,'Direito de eliminar todos os dados do sistema imediatamente',false,1 FROM q3 UNION ALL
SELECT id,'Direito de transferir seus dados a outro fornecedor de serviço',true,2 FROM q3 UNION ALL
SELECT id,'Direito de corrigir dados incorretos',false,3 FROM q3 UNION ALL
SELECT id,'Direito de bloquear o tratamento de dados por prazo indeterminado',false,4 FROM q3;

-- ===================== MÓDULO 4 — Bases Legais do Tratamento =====================
WITH q1 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Quantas hipóteses de bases legais a LGPD prevê para o tratamento de dados?', 4, 1) RETURNING id
),
q2 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('O consentimento é a única base legal para tratar dados pessoais?', 4, 2) RETURNING id
),
q3 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Qual das seguintes é uma base legal válida para tratamento de dados?', 4, 3) RETURNING id
)
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order)
SELECT id,'3',false,1 FROM q1 UNION ALL
SELECT id,'5',false,2 FROM q1 UNION ALL
SELECT id,'8',false,3 FROM q1 UNION ALL
SELECT id,'10',true,4 FROM q1 UNION ALL
SELECT id,'Sim, o consentimento é sempre obrigatório',false,1 FROM q2 UNION ALL
SELECT id,'Não, existem outras hipóteses como obrigação legal e legítimo interesse',true,2 FROM q2 UNION ALL
SELECT id,'Sim, exceto para dados de acesso público',false,3 FROM q2 UNION ALL
SELECT id,'Não, mas é obrigatório para qualquer dado sensível sem exceção',false,4 FROM q2 UNION ALL
SELECT id,'Interesse comercial da empresa controladora',false,1 FROM q3 UNION ALL
SELECT id,'Conveniência operacional interna',false,2 FROM q3 UNION ALL
SELECT id,'Execução de contrato com o próprio titular dos dados',true,3 FROM q3 UNION ALL
SELECT id,'Pressão competitiva de mercado',false,4 FROM q3;

-- ===================== MÓDULO 5 — Governança e Compliance =====================
WITH q1 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('O que é DPO?', 5, 1) RETURNING id
),
q2 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('O que é um RIPD?', 5, 2) RETURNING id
),
q3 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Qual é o papel do encarregado (DPO) na organização?', 5, 3) RETURNING id
)
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order)
SELECT id,'Departamento de Proteção Operacional',false,1 FROM q1 UNION ALL
SELECT id,'Data Protection Officer — Encarregado de Proteção de Dados',true,2 FROM q1 UNION ALL
SELECT id,'Diretor de Políticas Organizacionais',false,3 FROM q1 UNION ALL
SELECT id,'Documento de Procedimento Oficial',false,4 FROM q1 UNION ALL
SELECT id,'Registro de Informações Pessoais de Dados',false,1 FROM q2 UNION ALL
SELECT id,'Relatório de Impacto à Proteção de Dados Pessoais',true,2 FROM q2 UNION ALL
SELECT id,'Rede Integrada de Proteção de Dados',false,3 FROM q2 UNION ALL
SELECT id,'Regulamento Interno de Proteção de Dados',false,4 FROM q2 UNION ALL
SELECT id,'Vender os dados pessoais de forma regulamentada',false,1 FROM q3 UNION ALL
SELECT id,'Atuar como canal de comunicação entre controlador, titulares e ANPD',true,2 FROM q3 UNION ALL
SELECT id,'Apenas criar senhas seguras para os sistemas internos',false,3 FROM q3 UNION ALL
SELECT id,'Contratar funcionários para o setor de TI',false,4 FROM q3;

-- ===================== MÓDULO 6 — Sanções e ANPD =====================
WITH q1 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Qual é o papel da ANPD?', 6, 1) RETURNING id
),
q2 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Qual sanção NÃO está prevista na LGPD?', 6, 2) RETURNING id
),
q3 AS (
  INSERT INTO quiz_questions (question, module_id, sort_order)
  VALUES ('Em qual situação a ANPD pode aplicar sanções?', 6, 3) RETURNING id
)
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order)
SELECT id,'Criar novas leis sobre proteção de dados',false,1 FROM q1 UNION ALL
SELECT id,'Orientar, regulamentar e fiscalizar o cumprimento da LGPD',true,2 FROM q1 UNION ALL
SELECT id,'Processar criminalmente empresas que violam dados',false,3 FROM q1 UNION ALL
SELECT id,'Desenvolver sistemas de segurança para empresas privadas',false,4 FROM q1 UNION ALL
SELECT id,'Multa',false,1 FROM q2 UNION ALL
SELECT id,'Bloqueio de dados pessoais relacionados à irregularidade',false,2 FROM q2 UNION ALL
SELECT id,'Prisão do responsável pela empresa',true,3 FROM q2 UNION ALL
SELECT id,'Publicização da infração',false,4 FROM q2 UNION ALL
SELECT id,'Apenas quando há reclamação formal do titular',false,1 FROM q3 UNION ALL
SELECT id,'Somente em casos de vazamento massivo de dados',false,2 FROM q3 UNION ALL
SELECT id,'Quando identificado descumprimento das normas da LGPD',true,3 FROM q3 UNION ALL
SELECT id,'Apenas após decisão judicial transitada em julgado',false,4 FROM q3;
