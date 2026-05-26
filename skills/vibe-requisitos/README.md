# Descoberta Guiada e Requisitos (vibe-requisitos)

Esta skill atua como um **Orquestrador de Descoberta Guiada e Tradutor Técnico-Negócio** para programadores de IA, agentes autônomos e IDEs inteligentes (Claude Code, Codex, Antigravity).

Sua principal missão é servir como ponte entre o usuário de negócios (ou leigo) e a implementação de código técnico. Ela impede o "vibe coding" caótico, traduz complexidades para analogias simples e força uma modelagem de escopo saudável com foco no MVP (Minimum Viable Product).

---

## 🚀 Problemas que esta Skill resolve

1. **Paralisia de Decisão / Pergunta-Resposta Infinita:** Evita que a IA faça dezenas de perguntas puramente técnicas que confundem o usuário.
2. **Inchaço de Escopo (Feature Creep):** O usuário leigo quer tudo de uma vez. A skill atua como um Product Manager virtual, ajudando a priorizar o que é essencial e a postergar o que é acessório.
3. **Falta de Alinhamento de Expectativas:** Gera um "Relatório de Duplo Alinhamento", dividindo as alterações entre impacto de negócios (o que o usuário vai ver) e especificações técnicas (o que o código vai mudar).
4. **Falsa sensação de facilidade:** Explica a complexidade real de alterações de arquitetura e banco de dados por meio de trade-offs simplificados e "T-shirt sizing" (P, M, G).

---

## 🛠️ O que está incluído?

* **`SKILL.md`:** As diretrizes e regras de comportamento para a IA atuar como um orquestrador consultivo.
* **`AGENTS.md`:** Instruções de mapeamento para o Codex.
* **`prompts/01-descoberta-requisitos.txt`:** Prompt para quando o usuário tem apenas uma ideia vaga ("Quero um Tinder de livros").
* **`prompts/02-tradutor-tecnico.txt`:** Prompt para traduzir uma mudança complexa de código ou PR para o cliente/stakeholder.
* **`prompts/03-analise-tradeoffs.txt`:** Prompt para propor caminhos arquiteturais alternativos mostrando o custo/benefício de cada um de forma visual.

---

## 📦 Como Usar

### 1. Instalação no Projeto
Instale a skill executando o CLI do Vibe Code Skills:
```bash
npx vibe-code-skills-br install vibe-requisitos --tool all
```

### 2. Ativação no Agente
Uma vez instalada, a IA lerá as regras da skill. Você pode ativá-la explicitamente dizendo:
> "Use a skill `vibe-requisitos` para me ajudar a modelar a funcionalidade [X]."
> "Traduza a seguinte tarefa técnica para mim usando a skill `vibe-requisitos`."

