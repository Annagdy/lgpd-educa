-- Script de criação do banco de dados LGPD Educa
-- Execute no pgAdmin ou psql conectado ao banco "lgpd-educa"

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
  id                  SERIAL PRIMARY KEY,
  username            VARCHAR(100) NOT NULL,
  email               VARCHAR(100) UNIQUE NOT NULL,
  password            VARCHAR(255) NOT NULL,
  is_verified         BOOLEAN DEFAULT FALSE,
  confirm_token       VARCHAR(255),
  reset_token         VARCHAR(255),
  reset_token_expires TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Tabela de módulos
CREATE TABLE IF NOT EXISTS modules (
  id          SERIAL PRIMARY KEY,
  title       VARCHAR(255) NOT NULL,
  description TEXT NOT NULL
);

-- Tabela de seções dos módulos
CREATE TABLE IF NOT EXISTS module_sections (
  id         SERIAL PRIMARY KEY,
  module_id  INTEGER NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
  title      VARCHAR(255) NOT NULL,
  content    TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_module_sections_module_id
  ON module_sections(module_id, sort_order);

-- Tabela de termos do glossário
CREATE TABLE IF NOT EXISTS glossary_terms (
  id         SERIAL PRIMARY KEY,
  term       VARCHAR(255) NOT NULL UNIQUE,
  definition TEXT NOT NULL
);

-- Seed dos módulos
INSERT INTO modules (id, title, description) VALUES
  (1, 'Introdução à LGPD', 'Conceitos fundamentais da Lei Geral de Proteção de Dados: origem, objetivos e estrutura da lei.'),
  (2, 'Segurança da Informação', 'Boas práticas de proteção de dados, criptografia, controle de acesso e incidentes de segurança.'),
  (3, 'Direitos do Titular', 'Conheça os direitos garantidos pela LGPD aos cidadãos e como exercê-los junto às organizações.'),
  (4, 'Bases Legais do Tratamento', 'Entenda as 10 hipóteses que legitimam o tratamento de dados pessoais segundo a LGPD.'),
  (5, 'Governança e Compliance', 'Como implementar um programa de governança de dados, DPO e boas práticas de conformidade.'),
  (6, 'Sanções e ANPD', 'Penalidades previstas na LGPD, papel da Autoridade Nacional de Proteção de Dados e fiscalização.')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description;

-- Limpa seeds antigas para manter a ordem e evitar duplicatas
DELETE FROM module_sections;

INSERT INTO module_sections (module_id, title, content, sort_order) VALUES
  (1, 'O que é a LGPD?', 'A Lei Geral de Proteção de Dados Pessoais (LGPD), Lei nº 13.709/2018, é a legislação brasileira que regula as atividades de tratamento de dados pessoais e que também altera os artigos 7º e 16 do Marco Civil da Internet.', 1),
  (1, 'Por que ela foi criada?', 'Com o avanço tecnológico e a crescente coleta e processamento de dados pessoais por empresas e governos, tornou-se necessário criar uma estrutura legal que garantisse a privacidade e a proteção dos dados dos cidadãos brasileiros.', 2),
  (1, 'Quando entrou em vigor?', 'A LGPD foi sancionada em agosto de 2018, mas passou por adiamentos. As sanções administrativas entraram em vigor em agosto de 2021. Desde então, a ANPD (Autoridade Nacional de Proteção de Dados) é responsável por fiscalizar o cumprimento da lei.', 3),
  (2, 'Princípios de Segurança', 'A LGPD exige que as organizações adotem medidas técnicas e administrativas para proteger os dados pessoais de acessos não autorizados, situações acidentais ou ilícitas de destruição, perda, alteração, comunicação ou difusão.', 1),
  (2, 'Boas Práticas', 'Entre as boas práticas destacam-se: criptografia de dados sensíveis, controle de acesso baseado em funções (RBAC), monitoramento contínuo de sistemas, realização de backups regulares e treinamento de colaboradores sobre segurança da informação.', 2),
  (3, 'Quem são os titulares?', 'O titular é a pessoa natural a quem se referem os dados pessoais que são objeto de tratamento. A LGPD confere aos titulares uma série de direitos sobre seus próprios dados.', 1),
  (3, 'Direitos garantidos', 'Os titulares têm direito a: confirmação da existência de tratamento; acesso aos dados; correção de dados incompletos; anonimização ou eliminação; portabilidade; informação sobre compartilhamento; revogação do consentimento; e revisão de decisões automatizadas.', 2),
  (4, 'Quais são as bases legais?', 'A LGPD prevê hipóteses que autorizam o tratamento de dados pessoais sem depender exclusivamente do consentimento. Entre elas estão o cumprimento de obrigação legal, a execução de contratos, o exercício regular de direitos, a proteção da vida, a tutela da saúde e o legítimo interesse.', 1),
  (4, 'Consentimento é a única base?', 'Não. Embora seja uma base importante, o consentimento é apenas uma das hipóteses legais. Cada operação de tratamento deve ser analisada para identificar a base legal mais adequada, respeitando finalidade, necessidade e transparência.', 2),
  (5, 'O que é governança em privacidade?', 'Governança em privacidade reúne políticas, processos, papéis e controles para assegurar que a organização trate dados pessoais de forma responsável e em conformidade com a LGPD.', 1),
  (5, 'Boas práticas de compliance', 'Mapeamento de dados, registro das operações de tratamento, treinamentos periódicos, plano de resposta a incidentes e atuação do encarregado são exemplos de medidas que fortalecem a conformidade.', 2),
  (6, 'Qual é o papel da ANPD?', 'A Autoridade Nacional de Proteção de Dados orienta, regulamenta e fiscaliza o cumprimento da LGPD, podendo instaurar processos administrativos e aplicar sanções.', 1),
  (6, 'Quais sanções podem ser aplicadas?', 'As sanções incluem advertência, publicização da infração, bloqueio ou eliminação de dados pessoais relacionados à irregularidade e multa, observados os critérios e limites definidos em lei.', 2);

INSERT INTO glossary_terms (term, definition) VALUES
  ('LGPD', 'Lei Geral de Proteção de Dados (Lei nº 13.709/2018). Regula o tratamento de dados pessoais no Brasil.'),
  ('Dado Pessoal', 'Informação relacionada a pessoa natural identificada ou identificável, como nome, CPF, e-mail, endereço, IP etc.'),
  ('Dado Sensível', 'Dado pessoal sobre origem racial ou étnica, convicção religiosa, opinião política, filiação sindical, saúde, vida sexual, dado genético ou biométrico.'),
  ('Titular dos Dados', 'Pessoa natural a quem se referem os dados pessoais que são objeto de tratamento.'),
  ('Controlador', 'Pessoa natural ou jurídica que toma as decisões referentes ao tratamento de dados pessoais.'),
  ('Operador', 'Pessoa natural ou jurídica que realiza o tratamento de dados pessoais em nome do controlador.'),
  ('ANPD', 'Autoridade Nacional de Proteção de Dados. Órgão federal responsável por zelar pela proteção de dados pessoais e fiscalizar o cumprimento da LGPD.'),
  ('Consentimento', 'Manifestação livre, informada e inequívoca pela qual o titular concorda com o tratamento de seus dados pessoais para uma finalidade determinada.'),
  ('Tratamento de Dados', 'Toda operação realizada com dados pessoais: coleta, produção, recepção, classificação, utilização, acesso, reprodução, transmissão, distribuição, processamento, arquivamento, armazenamento, eliminação, avaliação, controle, modificação, comunicação, transferência, difusão ou extração.'),
  ('Anonimização', 'Utilização de meios técnicos razoáveis e disponíveis no momento do tratamento, por meio dos quais um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo.'),
  ('DPO (Encarregado)', 'Data Protection Officer. Pessoa indicada pelo controlador para atuar como canal de comunicação entre o controlador, os titulares dos dados e a ANPD.'),
  ('Pseudonimização', 'Tratamento por meio do qual um dado perde a possibilidade de associação, direta ou indireta, a um indivíduo, senão pelo uso de informação adicional mantida separadamente.'),
  ('RIPD', 'Relatório de Impacto à Proteção de Dados Pessoais. Documento que descreve os processos de tratamento que podem gerar riscos às liberdades civis e aos direitos fundamentais.'),
  ('Bases Legais', 'Hipóteses previstas na LGPD que autorizam o tratamento de dados pessoais, como consentimento, obrigação legal, execução de contrato, interesse legítimo, entre outras.'),
  ('Portabilidade', 'Direito do titular de solicitar a transferência de seus dados pessoais a outro fornecedor de serviço ou produto, mediante requisição expressa.')
ON CONFLICT (term) DO UPDATE SET
  definition = EXCLUDED.definition;

-- Exemplo de usuário admin já verificado (para testes)
-- Senha: admin123 (hash bcrypt)
-- INSERT INTO users (username, email, password, is_verified)
-- VALUES ('Admin', 'admin@lgpd.com', '$2a$10$...', true);
