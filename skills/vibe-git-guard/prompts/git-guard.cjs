const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const SUSPICIOUS_PATTERNS = [
  /BEGIN (?:RSA |EC |PEM |OPENSSH )?PRIVATE KEY/i,
  /aws_(?:access_key_id|secret_access_key)\s*=\s*['"][a-zA-Z0-9+/=]{20,40}['"]/i,
  /amzn\.mws\.[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i,
  /AIza[0-9A-Za-z-_]{35}/,
  /ya29\.[0-9A-Za-z-_]+/
];

const BANNED_EXTENSIONS = ['.env', '.key', '.pem', '.pkcs12', '.pfx', '.p12'];

try {
  const stagedFiles = execSync('git diff --cached --name-only', { encoding: 'utf8' })
    .split('\n')
    .map(f => f.trim())
    .filter(Boolean);

  let hasError = false;

  for (const file of stagedFiles) {
    const ext = path.extname(file);
    const basename = path.basename(file);

    if (BANNED_EXTENSIONS.includes(ext) || BANNED_EXTENSIONS.includes(basename) || basename === '.env') {
      console.error(`\x1b[31m[GIT-GUARD ERROR]\x1b[0m O arquivo sensível '${file}' está sendo commitado! Remova-o antes de continuar.`);
      hasError = true;
      continue;
    }

    if (fs.existsSync(file) && !fs.lstatSync(file).isDirectory()) {
      const diff = execSync(`git diff --cached -- "${file}"`, { encoding: 'utf8' });
      const addedLines = diff.split('\n').filter(line => line.startsWith('+') && !line.startsWith('+++'));

      for (const line of addedLines) {
        for (const pattern of SUSPICIOUS_PATTERNS) {
          if (pattern.test(line)) {
            console.error(`\x1b[31m[GIT-GUARD ERROR]\x1b[0m Credencial ou chave sensível detectada no diff do arquivo '${file}':`);
            console.error(`  > Line: ${line.substring(1).trim()}`);
            hasError = true;
          }
        }
      }
    }
  }

  if (hasError) {
    console.error('\n\x1b[31m[GIT-GUARD COMMIT BLOQUEADO]\x1b[0m Foram detectadas vulnerabilidades de segurança. Corrija-as e tente novamente.');
    process.exit(1);
  }
} catch (err) {
  console.warn('\x1b[33m[GIT-GUARD WARNING]\x1b[0m Falha ao executar validações do git-guard. O commit prosseguirá.', err.message);
}
