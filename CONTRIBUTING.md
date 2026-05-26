# Guia de Contribuição — vibe-code-skills-br

Obrigado por querer contribuir para tornar a programação com inteligência artificial mais profissional e segura para todos! Este é um espaço aberto para desenvolvedores de todos os níveis compartilharem suas skills, prompts e configurações.

---

## 🛠️ Como Funciona o Repositório?

O repositório é um pacote Node.js simples que expõe um CLI executável via `npx`. A estrutura de arquivos segue este padrão:

```txt
vibe-code-skills-br/
├── README.md              # Documentação principal
├── CONTRIBUTING.md        # Este guia
├── package.json           # Definições do npm/cli
├── bin/
│   └── cli.js             # Código do instalador automático
└── skills/
    └── [nome-da-skill]/   # Pasta da sua skill
        ├── SKILL.md       # Regras e escopo detalhados da skill
        ├── AGENTS.md      # Prompt/Configuração para Codex
        ├── README.md      # Instruções de uso desta skill específica
        └── prompts/       # Pasta com arquivos de prompts de apoio (.txt)
            ├── 01-nome-prompt.txt
            └── 02-nome-prompt.txt
```

---

## 💡 Como Criar e Contribuir com uma Nova Skill

### Passo 1: Fork e Clone
1. Faça um Fork do repositório original.
2. Clone o repositório para a sua máquina local:
   ```bash
   git clone https://github.com/SEU_USUARIO/vibe-code-skills-br.git
   cd vibe-code-skills-br
   ```

### Passo 2: Criar a Estrutura da Skill
Crie uma nova subpasta em `skills/` seguindo a convenção em minúsculas separadas por hífen (kebab-case), por exemplo: `skills/meu-novo-helper`.

Crie os arquivos mínimos obrigatórios:
1. **`SKILL.md`:** Instruções e diretrizes detalhadas estruturadas em Markdown para a IA.
2. **`README.md`:** Explicação em português do que a skill faz e como usá-la.
3. **`prompts/`:** Pelo menos 1 prompt prático em `.txt` para o usuário copiar e colar rapidamente.

### Passo 3: Testar Localmente
Para testar como o instalador CLI se comporta com a sua nova skill antes de abrir o Pull Request:

```bash
# Listar as skills (sua skill nova deve aparecer na lista!)
node bin/cli.js list

# Testar a instalação da sua skill simulando as cópias de arquivos
node bin/cli.js install meu-novo-helper --tool all --dry-run
```

### Passo 4: Commit e Pull Request
1. Adicione os arquivos no Git.
2. Faça um commit com mensagem clara (ex: `feat: adicionar skill meu-novo-helper`).
3. Envie para o seu fork (`git push origin feature/meu-novo-helper`).
4. Abra um **Pull Request (PR)** detalhando qual problema a sua skill resolve.

---

## 🎨 Diretrizes para Escrever as Regras de uma Skill

Para garantir que as instruções sejam seguidas de forma confiável pelas IAs:
- **Seja Imperativo:** Use frases claras e diretas. Evite termos vagos como "tente fazer" ou "se possível". Use "Você deve", "Nunca", "Sempre".
- **Defina Limites Claros:** Deixe explícito o que a IA **pode** e o que ela **não pode** fazer (ex: escopo permitido e proibido).
- **Evite Placeholders:** Entregue instruções completas. Código de exemplo deve ser válido ou claramente genérico.
- **Português Claro:** Mantenha as explicações de uso no `README.md` em português claro e acessível para iniciantes.
