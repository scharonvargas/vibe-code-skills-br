# 🛡️ Git Guard & Secret Protection (`vibe-git-guard`)

> **Previne ativamente o commit e vazamento de chaves de API, arquivos .env, tokens e credenciais confidenciais.**

Esta skill age como uma barreira protetora para o seu repositório de código, ensinando os assistentes de IA a nunca adicionarem arquivos confidenciais ao controle de versão e fornecendo ferramentas automáticas para bloquear commits contendo segredos.

---

## ⚡ O que esta Skill faz?

1. **Evita vazamento de arquivos confidenciais**: Impede que arquivos como `.env`, `*.key`, `*.pem`, `id_rsa` ou pastas confidenciais sejam adicionados à árvore de commits do Git.
2. **Ignora segredos no contexto de IA**: Cria arquivos de ignore para assistentes de IA (como `.cursorignore` e `.claudeignore`) para evitar que a IA leia e decore credenciais reais locais.
3. **Bloqueia adição indiscriminada (`git add .`)**: Força a IA a commitar de forma cirúrgica e explícita (`git add file1 file2`), checando o status de arquivos não rastreados que possam conter dados sensíveis.
4. **Instalação de Pre-commit Hook**: Fornece um script automatizado que cria uma barreira no Git local antes que o commit seja gerado.

---

## 🚀 Como usar o Hook de Pré-commit local

Ao instalar a skill, um script de configuração rápida é colocado no diretório do seu projeto. Para instalar o hook de pré-commit que valida chaves de API locais antes de cada commit:

```bash
node .vibe-code-skills/prompts/vibe-git-guard/setup-pre-commit.js
```

Após rodar o script, qualquer tentativa de commit (seja por IA ou humana) contendo padrões óbvios de chaves (como `BEGIN [TIPO] PRIVATE KEY`, strings correspondentes a tokens da AWS, OpenAI, Firebase ou arquivos `.env` modificados) será sumariamente bloqueada no Git.
