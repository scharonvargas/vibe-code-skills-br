# Orquestrador de Projeto Vibe (vibe-orquestrador)

Gerente de Projetos de IA focado em Spec-Driven Development (SDD) e Máquina de Estados.

Inspirado nos fluxos de trabalho "Superpower" e no framework GSD (*Get Shit Done*), esta skill transforma a IA de um simples "gerador de código conversacional" para um orquestrador rigoroso. Ela quebra a tarefa em 4 fases estritas e salva o contexto no sistema de arquivos para não se perder em projetos grandes.

## ⚙️ Fases do Orquestrador

1. **Especulação (`/vibe-spec`)**: A IA atua como Product Manager. Não escreve código. Entrevista o usuário e gera um arquivo `.vibe/SPEC.md`.
2. **Planejamento (`/vibe-plan`)**: Atua como Arquiteto. Lê o `SPEC.md`, decide a abordagem técnica e gera um arquivo `.vibe/PLAN.md` com as tarefas em uma lista de caixas de seleção `[ ]`.
3. **Execução (`/vibe-execute`)**: Atua como Engenheiro. Lê o `PLAN.md`, executa as tarefas uma a uma, marcando `[x]`, e anota o que fez no `.vibe/SCRATCHPAD.md`.
4. **Verificação (`/vibe-verify`)**: Atua como QA. Roda lint, build, e compara o estado final do projeto com as exigências do `.vibe/SPEC.md`.

## 📁 O Padrão `.vibe/` (Máquina de Estados)
Ao usar esta skill, o agente irá automaticamente criar e gerenciar a pasta oculta `.vibe/` na raiz do seu projeto. O seu `.gitignore` será atualizado na instalação da skill para garantir que anotações temporárias do agente (como o `SCRATCHPAD.md`) não sujem seu repositório Git, enquanto o `SPEC.md` e o `PLAN.md` poderão ser comitados.
