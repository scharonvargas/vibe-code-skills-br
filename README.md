# 🧭 Vibe Code Skills BR

> **Transforme o "vibe coding" caótico em engenharia de software estruturada, segura e profissional com IA.**

[![Claude Code](https://img.shields.io/badge/Claude--Code-compatível-05cd99?style=flat-square&logo=anthropic)](https://antigravity.dev)
[![Gemini](https://img.shields.io/badge/Gemini--Antigravity-compatível-4285f4?style=flat-square&logo=googlegemini)](https://antigravity.dev)
[![Cursor](https://img.shields.io/badge/Cursor-compatível-00bcd4?style=flat-square&logo=cursor)](https://antigravity.dev)
[![Windsurf](https://img.shields.io/badge/Windsurf-compatível-9c27b0?style=flat-square&logo=windsurf)](https://antigravity.dev)
[![GitHub Copilot](https://img.shields.io/badge/Copilot-compatível-181717?style=flat-square&logo=github)](https://antigravity.dev)
[![Codex](https://img.shields.io/badge/Codex-compatível-ff9800?style=flat-square)](https://antigravity.dev)

O **Vibe Code Skills BR** é uma CLI e conjunto de regras que instala instruções e prompts estruturados nos seus projetos. Ele ensina protocolos rígidos de desenvolvimento para assistentes de IA (como Claude, Gemini, Cursor, Windsurf, Copilot e Codex), garantindo que eles planejem e testem o código antes de modificar qualquer arquivo.

---

## ⚡ Instalação Rápida (Quick Start)

Instale todas as habilidades de forma automática no seu projeto atual rodando apenas:

```bash
npx vibe-code-skills-br install
```

*Para testar de forma global no sistema (disponível para todas as pastas):*
```bash
npx vibe-code-skills-br install --global
```

---

## 🛠️ Comandos da CLI

| Comando | Descrição | Exemplo |
| :--- | :--- | :--- |
| `list` | Lista as skills disponíveis no pacote | `npx vibe-code-skills-br list` |
| `install [skill]` | Instala regras no projeto (omita ou use `all` para todas) | `npx vibe-code-skills-br install vibe-orquestrador` |
| `uninstall [skill]` | Remove as regras de forma limpa (omita ou use `all` para todas) | `npx vibe-code-skills-br uninstall all` |

### Opções e Flags adicionais:
*   `--tool`, `-t`: Filtra a instalação para ferramentas específicas (`claude`, `codex`, `antigravity`, `cursor`, `windsurf`, `copilot`, `all`).
*   `--global`, `-g`: Instala as regras na Home do usuário (`~`).
*   `--custom-file`, `-c`: Grava as instruções em um arquivo personalizado.
*   `--force`, `-f`: Sobrescreve arquivos e blocos existentes no projeto.
*   `--dry-run`: Simula os comandos no console sem alterar nenhum arquivo físico.

---

## 📚 Habilidades Incluídas (Skills)

### 1. 🧭 Orquestrador de Projeto (`vibe-orquestrador`)
*   **Ideal para**: Desenvolvimento de novas funcionalidades complexas (mais de 3 arquivos) e controle de escopo.
*   **Como funciona**: Obriga a IA a seguir um ciclo rígido de 4 fases consecutivas: **Spec** (entrevista e escopo), **Plan** (desenho de arquitetura e checklists), **Execute** (codificação atômica progressiva) e **Verify** (verificação de builds e testes).
*   **Onde atua**: Cria arquivos de log e estado local no diretório `.vibe/`.

### 2. 🛡️ Auditoria, Segurança e Refatoração (`vibe-auditoria`)
*   **Ideal para**: Revisão de código legado, segurança (busca de chaves expostas) e limpeza de código duplicado.
*   **Como funciona**: Configura o assistente para agir sob três modos estritos: *Audit Only* (apenas relata problemas sem tocar no código), *Plan Only* (desenha estratégias e pede aprovação) e *Implement Scoped* (modificações incrementais seguidas por testes de regressão).

### 3. 💬 Descoberta Guiada e Requisitos (`vibe-requisitos`)
*   **Ideal para**: Modelagem de negócios e tradução técnica. Perfeito para programadores novatos ou clientes sem background técnico.
*   **Como funciona**: Ensina a IA a substituir jargões técnicos complexos (como APIs, DB migrations) por analogias do dia a dia (garçons, caixas de mudança) e foca em definir o "impacto de negócios" das mudanças antes do código.

---

## 🎛️ Mesclagem Inteligente de Instruções

A CLI possui suporte a **Smart Merging** para arquivos únicos de instrução compartilhados (como `.cursorrules`, `.windsurfrules` e `.github/copilot-instructions.md`). 

Quando você instala múltiplas skills, a CLI não sobrescreve o arquivo; ela adiciona e isola cada skill com delimitadores transparentes:
```markdown
# === VIBE CODE SKILL: vibe-orquestrador ===
[instruções da skill]
# === END SKILL: vibe-orquestrador ===
```
Ao executar `uninstall`, apenas a respectiva skill é removida do arquivo compartilhado, preservando as demais configurações do desenvolvedor.

---

## 💻 Integração e Funcionamento por IDE

*   **Antigravity IDE & Gemini**: Instala regras locais em `.antigravity/rules/` e cria Agent Skills nativas em `.gemini/skills/` que podem ser invocadas pelo chat.
*   **Claude Code**: Copia manuais detalhados para o diretório `.claude/skills/` para leitura instantânea no terminal.
*   **Cursor / Windsurf**: Adiciona as diretrizes em blocos organizados em `.cursorrules` e `.windsurfrules`.
*   **GitHub Copilot**: Configura as orientações corporativas de forma automática no arquivo `.github/copilot-instructions.md`.
*   **Codex**: Insere definições estritas de agente no arquivo central `AGENTS.md`.

---

## 🤝 Como Contribuir

Para sugerir melhorias nos manuais ou adicionar suporte para novas ferramentas:
1. Faça um fork do repositório.
2. Crie uma branch de funcionalidade (`git checkout -b feature/nova-skill`).
3. Teste localmente utilizando: `node bin/cli.js`.
4. Envie seu Pull Request!

---

## 📄 Licença

Este projeto está sob a licença [MIT](file:///./LICENSE).
