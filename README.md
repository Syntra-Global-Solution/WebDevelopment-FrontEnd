# Syntra - Mobilidade Urbana Inteligente

**Global Solution 2026.2 | CitizenTech | FIAP**

Projeto desenvolvido para as disciplinas de **Front-end Design** e **Web Development** do curso de Engenharia de Software da FIAP.

O Syntra é uma aplicação web voltada à mobilidade urbana, que integra planejamento de trajetos, informações sobre transporte público e relatos colaborativos em um único ambiente digital.

## Ficha da CitizenTech

| Campo | Descrição |
|---|---|
| **Nome** | Syntra |
| **Cidade e território** | São Paulo - SP, com foco na mobilidade urbana |
| **Cidadãos beneficiados** | Usuários de transporte público, pedestres, estudantes, trabalhadores, idosos, pessoas com deficiência e pessoas com mobilidade reduzida |
| **Problema** | A fragmentação das informações de mobilidade dificulta o planejamento de deslocamentos seguros, acessíveis e eficientes |
| **Solução** | Plataforma que reúne planejamento de rotas, consulta de linhas, relatos urbanos e visualização geográfica de ocorrências |
| **Como funciona** | O usuário informa seu destino, consulta alternativas de deslocamento, define preferências de mobilidade e acompanha informações relevantes sobre a cidade |
| **Parte de Front-end** | Interface responsiva, componentes React, navegação, formulários e visualização de dados |
| **Parte de Web Development** | Lógica de aplicação, gerenciamento de estados, consumo de APIs e operações CRUD |
| **Repositório** | https://github.com/Syntra-Global-Solution/WebDevelopment-FrontEnd |
| **Indicadores de impacto propostos** | Quantidade de relatos registrados, utilização dos filtros de acessibilidade e número de consultas de trajetos |
| **ODS relacionados** | ODS 9, ODS 10 e ODS 11 |

---

## 1. Sobre o projeto

A mobilidade urbana influencia diretamente a qualidade de vida da população. Em grandes cidades como São Paulo, deslocamentos cotidianos podem envolver longos períodos de espera, dificuldades de acessibilidade, alterações no funcionamento do transporte público e falta de informações sobre as condições dos trajetos.

Embora existam ferramentas para consultar rotas e transportes, essas informações frequentemente estão distribuídas entre diferentes plataformas.

O Syntra foi concebido para centralizar informações relevantes sobre a mobilidade urbana e permitir que os próprios cidadãos contribuam com relatos sobre o ambiente em que circulam.

A proposta é oferecer uma experiência simples, intuitiva e acessível, auxiliando na tomada de decisões durante os deslocamentos.

## 2. Problema identificado

O principal problema abordado pelo projeto é a dificuldade de acessar, interpretar e relacionar informações necessárias para planejar deslocamentos urbanos.

Entre os desafios considerados estão:

- Fragmentação de informações sobre rotas e transporte público.
- Dificuldade de identificar trajetos compatíveis com necessidades individuais de acessibilidade.
- Falta de visibilidade sobre ocorrências que interferem na circulação.
- Necessidade de consultar diferentes plataformas para compreender as condições de um deslocamento.
- Participação limitada dos cidadãos na comunicação de problemas urbanos.

Essas dificuldades podem afetar especialmente pessoas que dependem diariamente do transporte coletivo ou precisam de condições específicas de mobilidade.

## 3. Solução proposta

O Syntra reúne quatro funcionalidades principais em uma aplicação web integrada.

### 3.1. Trajetos

A página de Trajetos permite planejar deslocamentos a partir de uma origem e um destino.

Entre seus recursos estão:

- Definição de origem e destino.
- Utilização de geolocalização, mediante permissão do usuário.
- Configuração de preferências individuais de mobilidade.
- Consulta e comparação de alternativas de trajeto.
- Visualização geográfica das rotas.
- Acompanhamento do trajeto selecionado.

O objetivo é permitir que o planejamento considere não apenas o deslocamento, mas também as necessidades do usuário.

### 3.2. Linhas

A página de Linhas concentra informações sobre o transporte público.

Seus recursos incluem:

- Consulta de linhas de transporte.
- Seleção e filtragem de informações.
- Visualização de dados operacionais.
- Apresentação de informações relevantes para o planejamento de viagens.

Essa funcionalidade busca simplificar o acesso a informações relacionadas ao transporte coletivo.

### 3.3. Relatos

A página de Relatos permite registrar e consultar ocorrências urbanas que podem interferir na mobilidade.

A funcionalidade utiliza operações CRUD:

| Operação | Descrição |
|---|---|
| **Create** | Cadastrar uma nova ocorrência |
| **Read** | Consultar e visualizar ocorrências existentes |
| **Update** | Editar informações de uma ocorrência |
| **Delete** | Excluir uma ocorrência |

O módulo também utiliza formulários, validações, filtros e gerenciamento de estados.

A proposta é transformar observações dos cidadãos em informações úteis para outras pessoas.

### 3.4. Mapa

A página de Mapa apresenta uma visualização geográfica das ocorrências urbanas.

Entre seus recursos estão:

- Mapa interativo.
- Marcadores associados às ocorrências.
- Filtros para selecionar informações relevantes.
- Visualização dos detalhes das ocorrências.
- Integração com os dados apresentados no módulo de Relatos.

A visualização espacial facilita a compreensão das condições urbanas e permite identificar situações que podem afetar os deslocamentos.

## 4. Público-alvo

O Syntra foi pensado para pessoas que precisam se deslocar pela cidade, especialmente:

- Usuários frequentes de ônibus, metrô e trem.
- Estudantes e trabalhadores.
- Pessoas com deficiência ou mobilidade reduzida.
- Idosos.
- Pessoas acompanhadas de crianças ou carrinhos de bebê.
- Pedestres que desejam planejar trajetos de acordo com suas preferências.

A proposta prioriza a autonomia do cidadão e o acesso simplificado às informações.

## 5. Tecnologias utilizadas

| Tecnologia | Aplicação |
|---|---|
| React | Desenvolvimento da interface e dos componentes |
| JavaScript | Lógica de programação e interatividade |
| Vite | Ambiente de desenvolvimento e build |
| Tailwind CSS | Estilização e responsividade |
| React Router | Navegação entre páginas |
| React Hooks | Gerenciamento de estados e efeitos |
| Custom Hooks | Reutilização da lógica de negócio |
| Context API | Compartilhamento de estados |
| Leaflet | Visualização de mapas interativos |
| Lucide React | Ícones da interface |
| Supabase | Integração com serviços de dados e persistência |
| Git e GitHub | Versionamento e gerenciamento do repositório |

## 6. Arquitetura e organização

O projeto utiliza uma arquitetura baseada em componentes reutilizáveis, com separação entre apresentação, lógica de negócio e acesso aos dados.

Estrutura principal:

```text
Syntra/
├── public/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   ├── layout/
│   │   ├── map/
│   │   ├── occurrences/
│   │   ├── routes/
│   │   ├── transport/
│   │   └── ui/
│   ├── contexts/
│   ├── data/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   ├── services/
│   ├── styles/
│   ├── utils/
│   ├── App.jsx
│   └── main.jsx
├── supabase/
│   └── schema.sql
├── AI.md
├── README.md
├── package.json
└── vite.config.js
```

### Responsabilidades das pastas

| Pasta | Responsabilidade |
|---|---|
| `components` | Componentes reutilizáveis da interface |
| `contexts` | Estados compartilhados entre componentes |
| `data` | Dados e configurações utilizados pela aplicação |
| `hooks` | Hooks personalizados para gerenciamento de lógica e estados |
| `lib` | Configuração de bibliotecas e clientes externos |
| `pages` | Páginas principais da aplicação |
| `services` | Comunicação com APIs e processamento de dados |
| `styles` | Estilos globais e definições visuais |
| `utils` | Funções auxiliares, validações e formatação |
| `supabase` | Arquivos relacionados à estrutura do banco de dados |

Essa organização facilita a manutenção, reutilização e evolução da aplicação.

## 7. React Hooks e componentização

O projeto utiliza componentes funcionais React e mecanismos de gerenciamento de estado.

### Hooks nativos

- `useState`: gerenciamento de estados locais.
- `useEffect`: execução de efeitos e sincronização com recursos externos.
- `useMemo`: memorização de valores derivados.
- `useContext`: acesso a estados compartilhados, por meio dos hooks de contexto.

### Custom Hooks

Entre os hooks personalizados do projeto estão:

- `useAuth`
- `useGeolocation`
- `useJourney`
- `useOccurrenceContext`
- `useOccurrences`
- `useRoutes`
- `useTransportData`

Os Custom Hooks permitem manter a lógica de negócio separada da apresentação visual.

## 8. Integração com APIs e CRUD

O Syntra foi estruturado para consumir serviços externos relacionados à mobilidade urbana, à localização e ao gerenciamento de ocorrências.

A comunicação com esses serviços é organizada em módulos específicos na pasta `services`.

### Persistência de ocorrências

A integração com Supabase é utilizada para o gerenciamento dos registros de ocorrências.

O módulo de Relatos contempla as quatro operações fundamentais de um CRUD: criação, leitura, atualização e exclusão.

A arquitetura também contempla autenticação, validação de dados e tratamento de erros.

### Serviços de mobilidade

A aplicação possui serviços responsáveis por funcionalidades como:

- Geocodificação e interpretação de localidades.
- Consulta e processamento de rotas.
- Informações de transporte.
- Gerenciamento de ocorrências.

A disponibilidade de informações depende das configurações dos serviços externos utilizados. Dados demonstrativos não devem ser interpretados como informações operacionais em tempo real.

## 9. Pré-requisitos

Para executar o projeto localmente, são necessários:

- Node.js em versão compatível com o Vite instalado.
- npm.
- Git.
- Navegador atualizado.
- Acesso à internet para os serviços externos.

Para utilizar as funcionalidades de persistência, também é necessário configurar um projeto Supabase.

## 10. Instalação e execução

### 10.1. Clonar o repositório

```bash
git clone https://github.com/Syntra-Global-Solution/WebDevelopment-FrontEnd.git
```

### 10.2. Acessar a pasta

```bash
cd WebDevelopment-FrontEnd
```

### 10.3. Instalar as dependências

```bash
npm install
```

### 10.4. Configurar as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto e configure as variáveis utilizadas pelo cliente Supabase:

```env
VITE_SUPABASE_URL=URL_DO_PROJETO
VITE_SUPABASE_ANON_KEY=CHAVE_PUBLICA_DO_PROJETO
```

Utilize somente a chave pública apropriada para aplicações cliente. Nunca exponha chaves administrativas ou segredos privados.

Quando necessário, configure a estrutura do banco de dados utilizando o arquivo `supabase/schema.sql` e as políticas de acesso correspondentes.

### 10.5. Iniciar o servidor

```bash
npm run dev
```

Acesse o endereço local exibido pelo Vite no terminal, normalmente:

```text
http://localhost:5173
```

### 10.6. Gerar a versão de produção

```bash
npm run build
```

Para visualizar localmente a versão gerada:

```bash
npm run preview
```

## 11. Navegação

A aplicação possui quatro rotas principais:

| Rota | Página |
|---|---|
| `/trajetos` | Planejamento e comparação de trajetos |
| `/linhas` | Consulta de informações de transporte |
| `/relatos` | Gerenciamento de ocorrências |
| `/mapa` | Visualização geográfica das ocorrências |

A navegação foi organizada para facilitar o uso em dispositivos móveis, com interface apresentada em formato de aplicativo.

## 12. Interface e experiência do usuário

A identidade visual do Syntra utiliza uma paleta composta por tons de azul-marinho, verde-sálvia, bege, creme e cores complementares.

O projeto prioriza:

- Navegação intuitiva.
- Hierarquia visual clara.
- Componentes reutilizáveis.
- Legibilidade.
- Organização das informações.
- Adaptação a diferentes tamanhos de tela.
- Formulários com validação e mensagens de retorno.
- Estados de carregamento, erro e ausência de dados.

A proposta é reduzir a complexidade da interação e facilitar a compreensão das informações urbanas.

## 13. Objetivos de Desenvolvimento Sustentável

O Syntra está alinhado aos seguintes ODS da Agenda 2030 da ONU:

### ODS 9 - Indústria, Inovação e Infraestrutura

O projeto propõe o uso de tecnologias digitais para melhorar o acesso a informações relacionadas à infraestrutura de mobilidade urbana.

### ODS 10 - Redução das Desigualdades

A consideração de diferentes necessidades de mobilidade busca ampliar a inclusão de pessoas que enfrentam barreiras de acessibilidade.

### ODS 11 - Cidades e Comunidades Sustentáveis

O Syntra contribui para esse objetivo ao propor uma mobilidade mais informada, participativa, inclusiva e acessível.

## 14. Impacto esperado

O impacto esperado do Syntra está relacionado à melhoria do acesso às informações e à autonomia no planejamento dos deslocamentos.

Como indicadores para futuras avaliações, podem ser utilizados:

- Quantidade de relatos cadastrados.
- Número de consultas de trajetos.
- Utilização dos filtros de acessibilidade.
- Participação dos usuários na identificação de problemas urbanos.
- Percepção dos usuários sobre a facilidade de planejamento de deslocamentos.

Esses indicadores representam possibilidades de avaliação e não resultados já comprovados.

## 15. Limitações e possibilidades de evolução

Por se tratar de um protótipo acadêmico, o Syntra pode depender de dados demonstrativos, configurações externas e serviços com cobertura limitada.

Entre as possibilidades de evolução estão:

- Ampliação das fontes de dados de transporte público.
- Integração com informações operacionais em tempo real.
- Validação e moderação colaborativa de ocorrências.
- Expansão dos critérios de acessibilidade.
- Melhorias na precisão das recomendações de rotas.
- Integração futura com sensores e dispositivos urbanos.
- Avaliação da experiência com usuários reais.

## 16. Versionamento

O projeto utiliza Git para controle de versões e GitHub para armazenamento do código-fonte.

O desenvolvimento é organizado em commits que representam a evolução da estrutura, dos componentes, das páginas e das integrações.

Repositório:

https://github.com/Syntra-Global-Solution/WebDevelopment-FrontEnd

## 17. Deploy

**Link da aplicação:** https://webdevelopment-frontend-five.vercel.app

O deploy deverá disponibilizar a aplicação para acesso e avaliação pelo navegador.

## 18. Inteligência Artificial

A documentação referente ao uso de ferramentas de inteligência artificial durante o desenvolvimento está disponível no arquivo [`AI.md`](./AI.md).

## 19. Equipe

**Instituição:** FIAP - Faculdade de Informática e Administração Paulista  
**Curso:** Engenharia de Software  
**Turma:** 1ESPH  
**Semestre:** 2º semestre de 2026  
**Projeto:** Global Solution - CitizenTech

**Integrantes:**

- Beatriz Soares Salve - RM568791
- Estela Mariano da Silva - RM 569513
- Gabriela Pinon Labrada - RM569849

---

**Syntra - Tecnologia para uma mobilidade mais conectada, acessível e colaborativa.**