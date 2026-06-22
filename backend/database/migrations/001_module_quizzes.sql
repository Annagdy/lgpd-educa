-- Adicionar coluna module_id a quiz_questions
ALTER TABLE quiz_questions 
ADD COLUMN IF NOT EXISTS module_id INTEGER REFERENCES modules(id) ON DELETE CASCADE;

-- Criar índice para melhor performance
CREATE INDEX IF NOT EXISTS idx_quiz_questions_module_id 
ON quiz_questions(module_id, sort_order);

-- MÓDULO 1: Introdução à LGPD
INSERT INTO quiz_questions (module_id, question, sort_order) VALUES
(1, 'Qual é o nome completo da lei que regula proteção de dados no Brasil?', 1),
(1, 'Em que ano a LGPD foi sancionada?', 2),
(1, 'Quando as sanções administrativas da LGPD entraram em vigor?', 3)
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Lei Geral de Proteção de Dados Pessoais', true, 0
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Lei de Dados da Internet', false, 1
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Lei de Proteção de Privacidade do Brasil', false, 2
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Lei de Segurança Digital Brasileira', false, 3
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

-- Opções para pergunta 2
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, '2018', true, 0
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, '2016', false, 1
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, '2020', false, 2
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, '2019', false, 3
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

-- Opções para pergunta 3
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Agosto de 2021', true, 0
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Janeiro de 2020', false, 1
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Junho de 2022', false, 2
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Março de 2021', false, 3
FROM quiz_questions q WHERE q.module_id = 1 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

-- MÓDULO 2: Segurança da Informação
INSERT INTO quiz_questions (module_id, question, sort_order) VALUES
(2, 'Qual é a medida técnica mais eficaz para proteger dados contra acesso não autorizado?', 1),
(2, 'O que é um backup e por que é importante?', 2),
(2, 'Qual desses é um exemplo de boas práticas de segurança?', 3)
ON CONFLICT DO NOTHING;

-- Opções para pergunta 1 do módulo 2
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Criptografia', true, 0
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Senhas simples', false, 1
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Bloqueio físico de servidores', false, 2
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas monitoramento', false, 3
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

-- Opções para pergunta 2 do módulo 2
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Cópia de dados para recuperação em caso de perda ou falha', true, 0
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Uma forma de armazenar dados de forma insegura', false, 1
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Um tipo de malware', false, 2
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Um certificado de segurança', false, 3
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

-- Opções para pergunta 3 do módulo 2
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Treinamento regular das equipes em segurança', true, 0
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Compartilhar senhas entre colaboradores', false, 1
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Não fazer backups regulares', false, 2
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Usar o mesmo computador para todos os dados', false, 3
FROM quiz_questions q WHERE q.module_id = 2 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

-- MÓDULO 3: Direitos do Titular
INSERT INTO quiz_questions (module_id, question, sort_order) VALUES
(3, 'Qual é a definição de "titular dos dados" segundo a LGPD?', 1),
(3, 'Quantos direitos principais o titular de dados tem segundo a LGPD?', 2),
(3, 'O titular pode solicitar eliminação de seus dados em qualquer situação?', 3)
ON CONFLICT DO NOTHING;

-- Opções para pergunta 1 do módulo 3
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Pessoa natural a quem se referem os dados pessoais tratados', true, 0
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Empresa que coleta dados', false, 1
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Órgão governamental responsável pelos dados', false, 2
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Pessoa jurídica que guarda dados', false, 3
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

-- Opções para pergunta 2 do módulo 3
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Confirmação, acesso, correção, eliminação, portabilidade e informação', true, 0
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas 2 direitos principais', false, 1
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas direito de acesso', false, 2
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas direito de eliminação', false, 3
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

-- Opções para pergunta 3 do módulo 3
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Não, existem exceções legais e contratuais', true, 0
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Sim, sempre pode solicitar eliminação', false, 1
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Nunca pode solicitar eliminação', false, 2
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas se pagar uma taxa', false, 3
FROM quiz_questions q WHERE q.module_id = 3 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

-- MÓDULO 4: Bases Legais do Tratamento
INSERT INTO quiz_questions (module_id, question, sort_order) VALUES
(4, 'Qual é o conceito de "base legal" na LGPD?', 1),
(4, 'O consentimento é a única base legal para tratamento de dados?', 2),
(4, 'Qual base legal pode ser usada para executar um contrato?', 3)
ON CONFLICT DO NOTHING;

-- Opções para pergunta 1 do módulo 4
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Hipótese legal que autoriza o tratamento de dados para uma finalidade específica', true, 0
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Uma taxa paga para usar dados', false, 1
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Um contrato assinado com o titular', false, 2
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Uma permissão do governo', false, 3
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

-- Opções para pergunta 2 do módulo 4
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Não, existem várias bases como obrigação legal, execução de contrato e legítimo interesse', true, 0
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Sim, consentimento é a única', false, 1
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Não existe base legal na LGPD', false, 2
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas consentimento e contrato', false, 3
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

-- Opções para pergunta 3 do módulo 4
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Execução de contrato é uma base legal válida', true, 0
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas consentimento pode ser usado', false, 1
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Nenhuma base legal permite isso', false, 2
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas a ANPD pode autorizar', false, 3
FROM quiz_questions q WHERE q.module_id = 4 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

-- MÓDULO 5: Governança e Compliance
INSERT INTO quiz_questions (module_id, question, sort_order) VALUES
(5, 'O que é governança em privacidade?', 1),
(5, 'Qual é o papel do encarregado (DPO) na organização?', 2),
(5, 'Qual é uma boa prática de compliance em privacidade?', 3)
ON CONFLICT DO NOTHING;

-- Opções para pergunta 1 do módulo 5
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Conjunto de políticas, processos e controles para tratar dados de forma responsável', true, 0
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Um documento que proíbe coleta de dados', false, 1
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Um departamento que vende dados', false, 2
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Uma taxa do governo', false, 3
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

-- Opções para pergunta 2 do módulo 5
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Orientar, supervisionar e coordenar conformidade com a LGPD', true, 0
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas coletar dados da organização', false, 1
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Vender dados para terceiros', false, 2
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Autorizar qualquer tratamento de dados', false, 3
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

-- Opções para pergunta 3 do módulo 5
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Mapeamento de dados e registro de operações de tratamento', true, 0
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Não manter registros de operações', false, 1
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Compartilhar dados sem consentimento', false, 2
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Nunca fazer auditorias', false, 3
FROM quiz_questions q WHERE q.module_id = 5 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

-- MÓDULO 6: Sanções e ANPD
INSERT INTO quiz_questions (module_id, question, sort_order) VALUES
(6, 'Qual é o papel principal da ANPD?', 1),
(6, 'Qual é uma das possíveis sanções por violação da LGPD?', 2),
(6, 'A ANPD pode impor multas às organizações?', 3)
ON CONFLICT DO NOTHING;

-- Opções para pergunta 1 do módulo 6
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Orientar, regulamentar, fiscalizar e instaurar processos administrativos', true, 0
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas arrecadar impostos', false, 1
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Vender dados do governo', false, 2
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas contratar empresas de tecnologia', false, 3
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 1
ON CONFLICT DO NOTHING;

-- Opções para pergunta 2 do módulo 6
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Advertência, publicização de infração, bloqueio ou eliminação de dados', true, 0
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas multa', false, 1
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Prisão do gestor', false, 2
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Dissolução da empresa', false, 3
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 2
ON CONFLICT DO NOTHING;

-- Opções para pergunta 3 do módulo 6
INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Sim, conforme critérios legais de infração', true, 0
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Não, a ANPD não tem autoridade para multas', false, 1
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas em casos de crimes', false, 2
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 3
ON CONFLICT DO NOTHING;

INSERT INTO quiz_options (question_id, option_text, is_correct, sort_order) 
SELECT q.id, 'Apenas para empresas públicas', false, 3
FROM quiz_questions q WHERE q.module_id = 6 AND q.sort_order = 3
ON CONFLICT DO NOTHING;
