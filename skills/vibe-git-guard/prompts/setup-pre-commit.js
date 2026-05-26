import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CWD = process.cwd();
const gitDir = path.join(CWD, '.git');

if (!fs.existsSync(gitDir)) {
  console.error('\x1b[31mErro: Diretório .git não encontrado. Certifique-se de que está na raiz de um repositório Git.\x1b[0m');
  process.exit(1);
}

const hooksDir = path.join(gitDir, 'hooks');
if (!fs.existsSync(hooksDir)) {
  fs.mkdirSync(hooksDir, { recursive: true });
}

const preCommitPath = path.join(hooksDir, 'pre-commit');

// Escreve um script shell simples que delega a validação para o script Node.js compilado em CommonJS (.cjs)
const hookContent = `#!/bin/sh
node .vibe-code-skills/prompts/vibe-git-guard/git-guard.cjs
`;

fs.writeFileSync(preCommitPath, hookContent, { mode: 0o755 });

try {
  if (process.platform !== 'win32') {
    execSync(`chmod +x "${preCommitPath}"`);
  }
} catch (err) {
  // Silencia erros se não conseguir executar o chmod
}

console.log('\x1b[32m✓ Hook de pré-commit do Git Guard configurado com sucesso em .git/hooks/pre-commit!\x1b[0m');
