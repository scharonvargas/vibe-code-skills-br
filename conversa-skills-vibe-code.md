# Registro da conversa — Skills para programação com IA

**Gerado em:** 2026-05-26  
**Tema:** criação de uma skill para Claude Code, Codex e Antigravity IDE; estruturação de repositório aberto para iniciantes em programação com IA/vibe coding; explicação, divulgação e instalação.

---

## 1. Pedido inicial

O usuário enviou imagens com prompts/checklists técnicos e pediu para transformar aquilo em uma skill para usar em:

- Claude Code
- Codex
- Antigravity IDE

A resposta estruturou uma skill chamada:

```txt
audit-hardening-refactor
```

A proposta da skill é orientar agentes de IA a trabalharem como revisores técnicos mais cuidadosos, cobrindo segurança, observabilidade, frontend, TypeScript, performance, código morto, segredos e refatoração segura.

---

## 2. Estrutura recomendada da skill

Estrutura sugerida:

```txt
audit-hardening-refactor/
  SKILL.md
  checklist.md
  output-template.md
```

Para Claude Code:

```txt
.claude/skills/audit-hardening-refactor/SKILL.md
```

Para Codex:

```txt
AGENTS.md
```

ou:

```txt
.codex/skills/audit-hardening-refactor/SKILL.md
```

Para Antigravity IDE:

```txt
Global Rule
Workspace Rule
Skill/Workflow, se disponível
```

---

## 3. Papel da skill

A skill foi definida para agir como:

```md
Você é um engenheiro de software sênior, arquiteto de soluções e especialista em segurança de aplicações.

Sua missão é revisar o projeto com rigor técnico, identificar vulnerabilidades, falhas arquiteturais, baixa observabilidade, problemas de autenticação/autorização, vazamento de segredos, falhas em uploads, estado frontend mal gerenciado, código morto e oportunidades de refatoração segura.
```

---

## 4. Regras obrigatórias da skill

Foram definidas estas regras:

1. Nunca alterar comportamento de negócio sem explicar o impacto.
2. Antes de editar arquivos, criar um plano objetivo.
3. Antes de refatorar, identificar riscos, dependências e testes necessários.
4. Nunca expor segredos, tokens, senhas, chaves de API ou dados pessoais.
5. Nunca remover código sem justificar.
6. Toda sugestão deve virar tarefa e subtarefa executável.
7. Priorizar segurança, rastreabilidade, testabilidade e manutenção.
8. Quando houver dúvida, marcar como “Necessita validação manual”.
9. Evitar mudanças massivas. Preferir mudanças pequenas e auditáveis.
10. Entregar relatório com severidade, arquivos afetados, evidências, plano de correção e testes.

---

## 5. Escopo inicial da auditoria

A skill analisa:

- observabilidade e logs;
- blocos `try/catch`;
- falhas silenciosas;
- contexto dos logs;
- data masking;
- uploads e arquivos;
- autenticação;
- autorização;
- senhas;
- endpoints expostos no frontend;
- chaves e tokens no frontend;
- gerenciamento de estado frontend;
- SQL Injection;
- XSS;
- CSRF;
- headers de segurança;
- código morto;
- imports não usados;
- funções nunca chamadas;
- componentes nunca renderizados;
- variáveis de estado inúteis;
- comentários sem explicação;
- segredos hardcoded;
- `.gitignore`;
- variáveis de ambiente;
- refatoração segura.

---

## 6. Observabilidade e logs

A skill verifica:

- falta de logs estruturados;
- ausência de logs em `try/catch`;
- falhas silenciosas;
- logs sem `userId`, `requestId`, `action`, `route`, `method`, `statusCode`, `durationMs`;
- `console.log` solto em produção;
- logs que podem expor senha, token, cookie, authorization header, CPF, e-mail, telefone ou API key.

Campos recomendados para log estruturado:

```json
{
  "level": "error",
  "timestamp": "ISO_DATE",
  "requestId": "uuid",
  "userId": "masked-or-id",
  "action": "create_resource",
  "route": "/api/resource",
  "method": "POST",
  "statusCode": 500,
  "durationMs": 123,
  "errorCode": "RESOURCE_CREATE_FAILED",
  "message": "Safe error message"
}
```

Máscaras obrigatórias:

```txt
password -> [REDACTED]
token -> [REDACTED]
authorization -> [REDACTED]
cookie -> [REDACTED]
cpf -> parcial ou [MASKED]
email -> mascarado
phone -> mascarado
apiKey -> [REDACTED]
secret -> [REDACTED]
```

---

## 7. Uploads e arquivos

A skill verifica:

- MIME type;
- extensão;
- conteúdo real do arquivo;
- limite de tamanho;
- sanitização do nome;
- proteção contra path traversal;
- armazenamento fora de pasta pública;
- bloqueio de arquivos executáveis;
- bloqueio de HTML, SVG ativo, JS, PHP, EXE, SH, BAT, CMD, MSI, JAR, DLL;
- nome interno seguro com UUID/hash;
- permissão para download;
- antivírus/scanner quando aplicável;
- proteção contra zip bomb;
- política de retenção e exclusão.

Regra importante:

> Nunca servir diretamente `/uploads` público se o conteúdo for sensível.

---

## 8. Autenticação e senhas

A skill audita:

- senha em texto plano;
- hash obsoleto;
- falta de salt;
- JWT mal usado;
- token sem expiração;
- refresh token inseguro;
- logout que não invalida sessão;
- ausência de rate limit;
- recuperação de senha insegura;
- mensagens que revelam se e-mail existe.

Recomendações:

- Argon2id preferencialmente;
- bcrypt como alternativa;
- password reset com token único, expirável e de uso único;
- cookies sensíveis com `HttpOnly`, `Secure`, `SameSite`.

---

## 9. Autorização

A skill verifica:

- rotas sensíveis com autenticação;
- token válido;
- roles corretas;
- ownership do recurso;
- endpoints administrativos protegidos;
- autorização real no backend;
- ausência de confiança em `userId` enviado pelo cliente;
- riscos de IDOR;
- regras multi-tenant quando houver organização/empresa/fazenda.

Princípio central:

> Backend é a fonte da verdade. Frontend apenas esconde UI, não protege dados.

---

## 10. Frontend, endpoints e tokens

A skill procura:

- URLs internas expostas sem necessidade;
- chaves de API no cliente;
- tokens hardcoded;
- segredos em `.env` público;
- chamadas diretas do frontend para APIs sensíveis;
- lógica de autorização apenas no frontend;
- endpoints admin expostos;
- uso inseguro de localStorage/sessionStorage;
- dados sensíveis no console.

---

## 11. Estado frontend

A skill analisa:

- prop drilling excessivo;
- estado no nível errado;
- estado duplicado;
- Context API usada sem necessidade;
- Context API causando renderizações globais;
- estado derivado salvo desnecessariamente;
- estado de servidor tratado como estado local;
- falta de cache;
- hooks customizados confusos.

Sugestões:

- composição de componentes;
- custom hooks;
- Context API apenas para estado global real;
- Zustand, Redux Toolkit, Jotai ou TanStack Query quando adequado;
- separar estado de UI, formulário, sessão e servidor.

---

## 12. Vulnerabilidades comuns

A skill cobre:

### SQL Injection

- queries concatenadas;
- raw SQL inseguro;
- filtros, busca, ordenação e paginação usando input direto.

Correções:

- queries parametrizadas;
- allowlist para filtros e ordenação.

### XSS

- HTML vindo do usuário;
- `dangerouslySetInnerHTML`;
- markdown sem sanitização;
- conteúdo salvo exibido sem tratamento.

Correções:

- escape por padrão;
- sanitização robusta;
- CSP.

### CSRF

- rotas mutáveis usando cookies;
- ausência de CSRF token;
- cookies sem SameSite.

### Headers de segurança

- Content-Security-Policy;
- X-Frame-Options ou frame-ancestors;
- X-Content-Type-Options;
- Referrer-Policy;
- Permissions-Policy;
- Strict-Transport-Security;
- CORS restritivo.

---

## 13. Código morto

A skill procura:

- componentes nunca renderizados;
- funções nunca chamadas;
- imports não usados;
- variáveis não utilizadas;
- estados nunca lidos ou nunca modificados;
- código comentado sem explicação;
- arquivos órfãos;
- rotas não acessadas;
- hooks não usados;
- tipos/interfaces não usados;
- dependências instaladas e não usadas;
- scripts obsoletos;
- assets não referenciados.

Regra:

> Nunca remover código apenas porque parece não usado.

Classificação:

- remoção segura;
- remoção provável com validação manual;
- manter, mas documentar;
- refatorar em vez de remover.

---

## 14. Segredos, `.gitignore` e variáveis de ambiente

A skill verifica:

- existência de `.gitignore`;
- se `.env`, `.env.local`, `.env.production`, `.env.*` estão ignorados;
- se arquivos de credenciais estão ignorados;
- segredos hardcoded;
- segredos no frontend;
- segredos em commits, logs ou exemplos;
- ausência de `.env.example`.

Sugestão de `.gitignore`:

```gitignore
.env
.env.*
!.env.example
node_modules
dist
build
coverage
.DS_Store
*.log
logs
uploads
tmp
.cache
```

Se encontrar segredo real:

- não repetir o segredo;
- indicar apenas o tipo;
- recomendar rotação imediata;
- mover para variável de ambiente;
- limpar histórico Git se necessário.

---

## 15. Segunda rodada: novos blocos adicionados

O usuário enviou novas imagens e pediu para adicionar à estrutura.

Foram adicionadas as categorias:

- TypeScript e tipos;
- componentização React;
- separação entre lógica e apresentação;
- performance frontend;
- React.memo, useMemo e useCallback;
- virtualização de listas;
- otimização de imagens;
- duplicação de código;
- reutilização com hooks, utils e componentes;
- princípio DRY.

---

## 16. TypeScript e qualidade de tipos

A skill passou a verificar:

- uso excessivo de `any`;
- `unknown` sem narrowing;
- props sem tipos;
- inconsistência entre `interface` e `type`;
- tipos duplicados;
- tipos de API não centralizados;
- estados React sem tipagem clara;
- eventos DOM como `any`;
- respostas de API sem contrato;
- uso perigoso de `as`;
- uso perigoso de `!`;
- falta de tipos para erros, permissões, roles, status e enums.

Recomendações:

- substituir `any`;
- usar `unknown` com validação;
- centralizar DTOs;
- usar Zod/Valibot quando houver entrada externa;
- preferir union types;
- evitar casting desnecessário.

---

## 17. Componentização React

A skill passou a analisar:

- componentes grandes demais;
- UI com regra de negócio;
- chamada de API em componente de apresentação;
- componente misturando layout, fetch, validação e estado;
- props excessivas;
- hooks com responsabilidade excessiva;
- lógica duplicada.

Estrutura sugerida:

```txt
src/
  components/
    ui/
    layout/
  features/
    auth/
    users/
    uploads/
  hooks/
  services/
  utils/
  types/
  schemas/
```

---

## 18. Performance frontend

A skill passou a verificar:

- renderizações desnecessárias;
- funções recriadas;
- cálculos pesados em todo render;
- listas grandes sem virtualização;
- imagens não otimizadas;
- Context API causando renderizações globais;
- fetch repetido sem cache;
- falta de lazy loading;
- bundle grande;
- falta de debounce/throttle;
- formulários grandes renderizando tudo a cada digitação.

Regra:

> Não recomendar `React.memo`, `useMemo` ou `useCallback` automaticamente. Só recomendar quando houver motivo real.

---

## 19. DRY e duplicação

A skill passou a procurar:

- funções iguais;
- componentes quase idênticos;
- JSX repetido;
- validações repetidas;
- chamadas de API duplicadas;
- formatações repetidas;
- regras de negócio copiadas;
- hooks parecidos;
- strings mágicas;
- constantes duplicadas;
- tratamento de erro repetido.

Regra:

> Não aplicar DRY de forma cega. Duplicação pequena pode ser aceitável. Duplicação de regra de negócio, segurança, validação e API deve ser corrigida com prioridade.

---

## 20. Melhorias sugeridas para a skill

Quando o usuário perguntou “O que poderia melhorar?”, foram sugeridos 8 pontos:

1. Separar auditoria de execução.
2. Adicionar escopo permitido e proibido.
3. Criar matriz de prioridade.
4. Exigir evidência obrigatória.
5. Criar modo de diff mínimo.
6. Adicionar testes de regressão por categoria.
7. Adicionar proteção de regra de negócio.
8. Dividir a skill em subskills.

---

## 21. Modos de operação

Foram definidos:

```md
### Audit Only
Apenas analise. Não altere arquivos.

### Plan Only
Transforme os achados em plano técnico, tarefas e subtarefas.

### Implement Scoped
Implemente apenas itens explicitamente autorizados pelo usuário.
```

Regra forte:

```md
Nunca implemente mudanças durante a primeira auditoria.
A primeira resposta deve ser sempre relatório + plano.
```

---

## 22. Escopo permitido e proibido

Pode analisar:

```txt
src/
app/
pages/
components/
features/
routes/
api/
server/
backend/
db/
prisma/
drizzle/
migrations/
package.json
tsconfig.json
vite.config.ts
next.config.js
docker-compose.yml
.env.example
.gitignore
```

Não alterar sem autorização:

```txt
migrations antigas já aplicadas
arquivos de build/dist
lockfiles, exceto se dependência for adicionada/removida
configurações de produção sem explicar impacto
schemas de banco sem plano de migração
contratos públicos de API sem plano de compatibilidade
arquivos .env reais
secrets reais
```

---

## 23. Matriz de prioridade

Cada achado deve ter:

- severidade;
- urgência;
- esforço;
- confiança;
- risco de regressão.

Prioridade final:

```txt
P0 — corrigir imediatamente
P1 — corrigir antes do próximo deploy
P2 — corrigir na próxima sprint
P3 — melhoria futura
```

---

## 24. Evidência obrigatória

Todo achado precisa conter:

- arquivo;
- função/componente/rota;
- trecho ou padrão encontrado;
- motivo técnico;
- risco real ou potencial.

Se não houver evidência:

```txt
Necessita validação manual
```

---

## 25. Política de diff mínimo

Ao implementar:

1. corrigir uma categoria por vez;
2. alterar poucos arquivos;
3. não misturar formatação com lógica;
4. não renomear arquivos sem necessidade;
5. não reorganizar pastas durante correção crítica;
6. não adicionar biblioteca se solução nativa for suficiente;
7. explicar cada arquivo alterado;
8. rodar validações disponíveis.

---

## 26. Proteção de regra de negócio

Antes de alterar regra:

- identificar regra atual;
- identificar quem depende dela;
- explicar impacto;
- preservar compatibilidade;
- criar teste de regressão.

Nunca alterar sem autorização:

- cálculo financeiro;
- score de risco;
- permissão;
- regra de cobrança;
- regra de status;
- regra de workflow;
- integração externa;
- regra multi-tenant;
- lógica de autorização.

---

## 27. Testes mínimos por categoria

### Auth/autorização

- usuário não autenticado não acessa rota privada;
- usuário comum não acessa rota admin;
- usuário não acessa recurso de outro usuário;
- token expirado é rejeitado.

### Upload

- arquivo acima do limite é rejeitado;
- extensão proibida é rejeitada;
- MIME falso é rejeitado;
- nome com `../` é sanitizado;
- download exige permissão.

### Logs

- erro crítico gera log estruturado;
- senha/token não aparece no log;
- requestId é propagado.

### Frontend

- componente continua renderizando;
- fluxo principal não quebra;
- estado global não gera renderização desnecessária.

### TypeScript

- projeto passa no typecheck;
- não foram adicionados novos `any` sem justificativa.

---

## 28. Subskills sugeridas

Estrutura futura:

```txt
skills/
  audit-hardening-refactor/
    SKILL.md
    observability.md
    security.md
    uploads.md
    authz.md
    frontend-quality.md
    typescript.md
    performance.md
    dead-code.md
    secrets.md
    output-template.md
```

---

## 29. ZIP gerado

O usuário pediu:

> Agora zip todos esses arquivos e junto um md de como usar

Foi gerado o pacote:

```txt
audit-hardening-refactor-skill.zip
```

Conteúdo:

```txt
audit-hardening-refactor/
  SKILL.md
  AGENTS.md
  README.md
  prompts/
    01-audit-completa.txt
    02-frontend-typescript.txt
    03-implementar-critical-high.txt
    04-codigo-morto-dry-performance.txt
    05-segredos-gitignore-env.txt
  install-examples/
    antigravity-rule-name.txt
    claude-code-path.txt
    codex-path.txt
```

---

## 30. Repositório aberto para iniciantes

O usuário pediu ajuda para explicar o projeto.

Sugestões de nome:

```txt
ai-coding-skills-br
vibe-code-skills-br
agent-dev-skills-br
skills-para-programar-com-ia
ia-code-hardening-skills
```

Nome preferido:

```txt
vibe-code-skills-br
```

Descrição curta:

```md
Skills, prompts e regras para ajudar iniciantes a programar com IA usando Claude Code, Codex, Antigravity IDE e outras ferramentas de vibe coding com mais segurança, organização e controle técnico.
```

---

## 31. Explicação: o que são skills?

Texto sugerido:

```md
Skills são instruções reutilizáveis que ensinam uma IA de programação a trabalhar de um jeito mais organizado.

Em vez de pedir apenas:

"Revise meu código"

Você entrega uma skill que diz para a IA:

- o que analisar;
- o que não pode alterar;
- como classificar problemas;
- como proteger segredos;
- como evitar quebrar regras de negócio;
- como criar tarefas e subtarefas;
- quando apenas auditar;
- quando planejar;
- quando implementar;
- como validar o que foi alterado.

Na prática, uma skill funciona como um "manual de trabalho" para agentes de IA.
```

---

## 32. Por que é útil para iniciantes?

Foram apontados três problemas comuns:

1. A IA mexe em arquivos demais.
2. A IA corrige uma coisa e quebra outra.
3. A IA cria código sem explicar direito o risco.

Fluxo proposto:

```txt
entender projeto -> auditar -> planejar -> implementar autorizado -> testar
```

---

## 33. Conceito principal do repositório

A regra principal:

```md
Este repositório não foi criado para fazer a IA sair corrigindo tudo sozinha.

A proposta é:

1. Auditar primeiro.
2. Planejar depois.
3. Implementar somente o que foi autorizado.
4. Validar no final.
```

Frase de posicionamento:

```txt
Skills para transformar vibe coding em engenharia assistida por IA.
```

---

## 34. Texto para WhatsApp

O usuário pediu um texto para grupos de comunidades de devs IA.

Versão direta criada:

```txt
Pessoal, estou montando um repositório aberto para quem está começando a programar com IA usando Claude Code, Codex, Antigravity, Cursor, Replit Agent e ferramentas de vibe coding.

A ideia não é só compartilhar “prompts mágicos”, mas criar skills e regras práticas para ajudar a IA a trabalhar com mais método, segurança e organização.

O primeiro pacote é uma skill chamada audit-hardening-refactor, que orienta o agente de IA a revisar projetos procurando:

✅ falhas de segurança
✅ problemas de autenticação/autorização
✅ uploads inseguros
✅ vazamento de tokens, senhas e chaves de API
✅ logs mal estruturados
✅ código morto
✅ duplicação de código
✅ problemas em React/TypeScript
✅ gargalos de performance
✅ refatorações perigosas
✅ arquivos .env e .gitignore mal configurados

O foco é ajudar iniciantes a sair do “a IA gerou código e eu não sei o que aconteceu” para um fluxo mais profissional:

1. auditar primeiro;
2. planejar depois;
3. implementar só o que foi autorizado;
4. validar com testes/build/lint;
5. evitar quebrar regra de negócio.

A proposta é transformar vibe coding em engenharia assistida por IA.

Estou abrindo para quem quiser contribuir com novas skills, prompts, melhorias, exemplos reais e adaptações para outras IDEs/agentes.

Repo: [COLOCAR LINK AQUI]

Quem tiver interesse em contribuir ou testar, será muito bem-vindo.
```

Versão curta:

```txt
Pessoal, estou montando um repositório aberto com skills e prompts para programação com IA, focado em Claude Code, Codex, Antigravity, Cursor e vibe coding.

A ideia é ajudar iniciantes a usar IA para programar com mais segurança e método, evitando aquele problema clássico: a IA mexe em tudo, quebra o projeto e ninguém sabe o que aconteceu.

A primeira skill faz auditoria de:

✅ segurança
✅ logs
✅ autenticação/autorização
✅ uploads
✅ segredos/API keys
✅ React/TypeScript
✅ código morto
✅ duplicação
✅ performance
✅ refatoração segura

O objetivo é simples: auditar primeiro, planejar depois e só então implementar com controle.

Repo: [COLOCAR LINK AQUI]

Quem quiser testar, sugerir melhorias ou contribuir, fica o convite.
```

---

## 35. Instalação via npm/npx

O usuário perguntou como as pessoas poderiam instalar as skills via npm ou se existiria maneira melhor.

Recomendação:

> Criar um CLI com `npx`, não depender de `npm install` puro.

Comando ideal:

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool claude --scope project
```

Ou:

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool all
```

---

## 36. Por que usar npx?

Porque:

- `npm install` normalmente só baixa o pacote para `node_modules`;
- não é bom usar `postinstall` para sair copiando arquivos automaticamente;
- `npx` deixa claro que o usuário pediu uma ação de instalação;
- dá para ter `--dry-run`;
- dá para mostrar os arquivos antes de copiar.

---

## 37. Formas de instalação recomendadas

1. Manual pelo GitHub.
2. Via `npx`.
3. Via ZIP/release.

---

## 38. Instalação para cada ferramenta

### Claude Code

Copiar:

```txt
skills/audit-hardening-refactor/SKILL.md
```

para:

```txt
.claude/skills/audit-hardening-refactor/SKILL.md
```

Comando sugerido:

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool claude
```

### Codex

Copiar:

```txt
skills/audit-hardening-refactor/AGENTS.md
```

para:

```txt
AGENTS.md
```

Comando sugerido:

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool codex
```

### Antigravity

Sugestão:

```txt
.antigravity/rules/audit-hardening-refactor.md
```

Ou usar:

```txt
AGENTS.md
```

---

## 39. Estrutura ideal do repositório npm

```txt
vibe-code-skills-br/
  README.md
  package.json
  bin/
    cli.js
  skills/
    audit-hardening-refactor/
      SKILL.md
      AGENTS.md
      README.md
      prompts/
        01-audit-completa.txt
        02-frontend-typescript.txt
        03-implementar-critical-high.txt
```

---

## 40. Comandos do CLI

Instalar em projeto atual:

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool all
```

Instalar só Claude:

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool claude
```

Instalar só Codex:

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool codex
```

Listar skills:

```bash
npx vibe-code-skills-br list
```

Ver antes sem alterar:

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool all --dry-run
```

---

## 41. O que evitar

Evitar:

```bash
npm install vibe-code-skills-br
```

com `postinstall` copiando arquivos automaticamente.

Motivo:

> É ruim por segurança e transparência. O usuário instala um pacote e ele sai mexendo no projeto sem clareza.

Melhor:

```bash
npx vibe-code-skills-br install ...
```

---

## 42. Exemplo de package.json

```json
{
  "name": "vibe-code-skills-br",
  "version": "0.1.0",
  "description": "Skills e prompts para programação com IA, Claude Code, Codex e Antigravity.",
  "type": "module",
  "bin": {
    "vibe-code-skills-br": "./bin/cli.js"
  },
  "files": [
    "bin",
    "skills",
    "README.md"
  ],
  "keywords": [
    "ai",
    "coding",
    "skills",
    "claude-code",
    "codex",
    "antigravity",
    "vibe-coding"
  ],
  "license": "MIT"
}
```

---

## 43. Comportamento ideal do CLI

Perguntas sugeridas:

```txt
Qual ferramenta você quer configurar?

[1] Claude Code
[2] Codex
[3] Antigravity
[4] Todas
```

Depois:

```txt
Onde instalar?

[1] Neste projeto
[2] Global para todos os projetos
```

Depois:

```txt
Arquivos que serão criados:

.claude/skills/audit-hardening-refactor/SKILL.md
AGENTS.md
.vibe-code-skills/prompts/01-audit-completa.txt

Confirmar? (s/N)
```

---

## 44. Frase final para README

```md
## Instalação

A forma recomendada é via `npx`, porque ela não instala dependências permanentes no seu projeto e deixa claro quais arquivos serão copiados.

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool all
```

Esse comando instala a skill no projeto atual, criando instruções compatíveis com Claude Code, Codex e Antigravity.

Para ver antes o que será alterado:

```bash
npx vibe-code-skills-br install audit-hardening-refactor --tool all --dry-run
```
```

---

## 45. Visão final do projeto

Estratégia recomendada:

```txt
GitHub como fonte principal
+
npx como instalador fácil
+
ZIP para fallback
```

Comandos futuros:

```bash
npx vibe-code-skills-br init
npx vibe-code-skills-br install audit-hardening-refactor
npx vibe-code-skills-br update
```

Posicionamento final:

```txt
Um mini gerenciador de skills para vibe coding em português.
```

---

## 46. Frase central

```txt
Transformar vibe coding em engenharia assistida por IA.
```

---

## 47. Observação

Este arquivo registra a conversa em formato estruturado Markdown, reunindo os principais pedidos, respostas, decisões, conteúdos gerados, prompts, arquitetura de instalação e posicionamento do projeto.
