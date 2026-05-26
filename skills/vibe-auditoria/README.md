# Auditoria, Segurança e Refatoração (vibe-auditoria)

Esta skill configura um assistente de IA focado em realizar revisões técnicas estritas, hardening de segurança e refatoração segura em projetos web.

## Como Usar

### Claude Code
Instale usando o instalador do repositório:
```bash
npx vibe-code-skills-br install vibe-auditoria --tool claude
```

### Codex
Instale usando:
```bash
npx vibe-code-skills-br install vibe-auditoria --tool codex
```

### Antigravity IDE
Instale usando:
```bash
npx vibe-code-skills-br install vibe-auditoria --tool antigravity
```

---

## Fluxo de Trabalho Recomendado

1. **Auditoria (`Audit Only`):** Peça para a IA ler todo o código e rodar uma auditoria geral de segurança, logs, frontend e performance.
2. **Planejamento (`Plan Only`):** Discuta as correções necessárias com base no relatório de prioridades (P0 a P3).
3. **Execução (`Implement Scoped`):** Permita que a IA aplique as correções planejadas em lotes pequenos e auditáveis, sempre rodando testes de regressão no final de cada lote.
