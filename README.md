## 📑 Visão Geral do Projeto
O LGPD-Educa é um projeto focado na conformidade e educação sobre a Lei Geral de Proteção de Dados (LGPD). Este repositório contém a documentação técnica seguindo os padrões de modelagem UML e especificações de software, além da produção dos mesmos, conforme planejado as entregas.

---

### 📌 1. Visão Geral (Especificação)
A especificação inicial define os alicerces do projeto, focando no problema e na solução proposta.

* **Contexto e Problema:** Muitas pessoas não sabem seus direitos nos meios da _web_, além das empresas, que correm, também, o risco de serem processados devido a tal lei. O conhecimento e entendimento da LGPD é essencial, devido a isso, a LGPD-Educa busca auxiliar e ensinar a variados tipos de usuários a respeito de seus direitos.

* **Público-alvo:** Alunos (Pesquisadores, Empresas, Alunos, Professores, Programadores).

* **Escopo e MVP:** Definição das funcionalidades priorizadas no backlog e o que está fora de escopo nesta versão, incluindo os critérios de aceite para o Produto Mínimo Viável (MVP).

* **Metodologia:** Utilização de métodos ágeis (Kanban) para organização de papéis e responsabilidades.

* **Tecnologias:** As ferramentas selecionadas para o projeto são:
  * **Front-end:** React.js + TypeScript
  * **Back-end:** Node.js com Express (API REST)
  * **Banco de dados:** PostgreSQL
  * **Hospedagem:** Heroku
  * **Ferramentas de prototipação:** Figma (design colaborativo e testes de usabilidade)
  * **Controle de versão:** Git + GitHub (com fluxo de revisão de código)

---

### 🎭 2. Modelagem de Casos de Uso (UML)
Nesta seção, detalhamos como os usuários interagem com o sistema para entender o comportamento funcional.

**Atores Identificados**
Os principais atores que interagem com o sistema LGPD-Educa incluem:

* **Usuário:** Pessoa que busca aprender ou aplicar conceitos de LGPD.
* **Sistemas Externos:** Sistema de email.

<img width="1642" height="1204" alt="Atores" src="https://github.com/user-attachments/assets/5f377404-63a4-45cb-83ae-07ffb6b77405" />

<img width="3113" height="2561" alt="Casos" src="https://github.com/user-attachments/assets/21c41192-6b5f-4ea8-845f-bc1a65235f78" />

---

### 🏗️ 3. Modelagem de Classes
O diagrama de classes define a estrutura interna, atributos e comportamentos do sistema.

* **Estrutura:** As classes possuem nome, atributos (visibilidade: + público, - privado), métodos e suas respectivas multiplicidades.
* **Relacionamentos:** Identificação de associações, heranças e composições entre as entidades.

<img width="1156" height="620" alt="Classe" src="https://github.com/user-attachments/assets/e4f2d35f-6be6-4ec7-a6be-2457e89bcd13" />

---

### 🗓️ Cronograma de Entregas (Milestones)
Esta seção detalha a organização do desenvolvimento do LGPD-Educa, dividida por módulos funcionais, responsabilidades e rastreabilidade com os Casos de Uso (UC) e Diagramas de Classe.

#### 1. Infraestrutura e Design Base
Foco na configuração do ambiente, identidade visual e modelagem inicial de dados.

* **Configuração de Banco de Dados:** Configuração do ambiente e instanciamento do BD (Responsável: Anna).

* **Style Guide:** Definição da paleta de cores, tipografia e diretrizes de UI/UX para garantir consistência visual. (Responsável: Marina)

* **Prototipagem:** Criação de protótipos de alta fidelidade para as telas de login e cadastro (Responsável: Patrick).

* **Modelagem de Dados:** Estruturação das tabelas `Usuario` e `Progresso` no banco de dados, definindo atributos e tipos (Responsável: Anna).

#### 2. Autenticação e Segurança (UC01 a UC04)
Implementação do fluxo de acesso seguro ao sistema.

* **Backend de Acesso:** Implementação das lógicas de `cadastrar()` e `login()` no servidor (Responsável: Marina).

* **Interface de Autenticação:** Desenvolvimento do _front-end_ para as telas de login, cadastro e recuperação de senha (Responsável: Patrick).

* **Comunicação Segura:** Integração de serviço de e-mail para fluxos de confirmação de conta e recuperação de senha (Responsável: Anna).

#### 3. Conteúdo e Interatividade (UC05, UC06 e UC09)
Núcleo educacional da aplicação, focando na entrega do conteúdo de LGPD.

* **Motor de Quiz:** Implementação do método ´realizarQuiz()´, incluindo a lógica de persistência de notas no banco de dados (Responsável: Anna).

* **Interface Educacional:** Desenvolvimento da UI para navegação entre módulos de aprendizado, realização de quizzes e consulta ao glossário. (Responsável: Marina)

* **Curadoria de Conteúdo:** Alimentação do banco de dados com os textos pedagógicos dos módulos e termos técnicos para o glossário (Responsável: Patrick).

#### 4. Perfil e Gamificação (UC07 e UC08)
Engajamento do usuário através de métricas de progresso e _ranking_.

* **Lógica de Gamificação:** Implementação do cálculo de _ranking_, pontuação e atualização automática de progresso (Responsável: Patrick).

* **Painel de Controle (_Dashboard_):** Desenvolvimento da interface de perfil do usuário com visualização gráfica do progresso (Responsável: Anna).

* **Garantia de Qualidade (_QA_):** Realização de testes de usabilidade e verificação da integridade dos dados de progresso após a conclusão das atividades. (Responsável: Marina)
