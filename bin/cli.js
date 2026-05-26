#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'node:util';
import os from 'os';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// O diretório principal do pacote onde as skills estão salvas
const PACKAGE_ROOT = path.join(__dirname, '..');
const SKILLS_DIR = path.join(PACKAGE_ROOT, 'skills');

// Cores para saída limpa no terminal
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';

// Dicionário de aliases para compatibilidade com nomes antigos
const SKILL_ALIASES = {
  'orquestrador-projeto-vibe': 'vibe-orquestrador',
  'descoberta-guiada-requisitos': 'vibe-requisitos',
  'auditoria-seguranca-refatoracao': 'vibe-auditoria',
  'audit-hardening-refactor': 'vibe-auditoria',
  'git-guard': 'vibe-git-guard',
  'git-seguro': 'vibe-git-guard'
};

function resolveSkillName(name) {
  return SKILL_ALIASES[name] || name;
}

function printHelp() {
  console.log(`
${BOLD}${GREEN}Vibe Code Skills BR — CLI${RESET}
Instalador automático de regras e instruções para programação assistida por IA.

${BOLD}USO:${RESET}
  npx vibe-code-skills-br <comando> [opções]

${BOLD}COMANDOS:${RESET}
  ${GREEN}list${RESET}                                Listar todas as skills disponíveis no repositório.
  ${GREEN}install [nome-da-skill]${RESET}               Instalar uma skill no projeto atual ou globalmente (ou 'all' / omitido para todas).
  ${GREEN}uninstall [nome-da-skill]${RESET}             Desinstalar uma skill (ou 'all' / omitido para todas).

${BOLD}OPÇÕES:${RESET}
  ${CYAN}--tool, -t <ferramenta>${RESET}                  Ferramenta de destino: claude, codex, antigravity, cursor, windsurf, copilot, all (Padrão: all).
  ${CYAN}--global, -g${RESET}                              Instalação global no diretório Home (~).
  ${CYAN}--custom-file, -c <caminho>${RESET}               Instala em um arquivo ou caminho personalizado.
  ${CYAN}--force, -f${RESET}                               Sobrescrever arquivos existentes.
  ${CYAN}--dry-run${RESET}                                 Simula a operação sem modificar arquivos.
  ${CYAN}--help, -h${RESET}                                Mostra esta mensagem de ajuda.

${BOLD}EXEMPLOS:${RESET}
  npx vibe-code-skills-br list
  npx vibe-code-skills-br install
  npx vibe-code-skills-br install vibe-auditoria --tool cursor
  npx vibe-code-skills-br install vibe-orquestrador --global
  npx vibe-code-skills-br install vibe-requisitos --custom-file .my-ai-instructions
  npx vibe-code-skills-br uninstall
  npx vibe-code-skills-br uninstall vibe-requisitos
`);
}

function getAvailableSkills() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.log(`${RED}Erro: Pasta de skills não encontrada no pacote.${RESET}`);
    process.exit(1);
  }

  return fs.readdirSync(SKILLS_DIR).filter(file => {
    return fs.statSync(path.join(SKILLS_DIR, file)).isDirectory();
  });
}

function listSkills() {
  const skills = getAvailableSkills();

  console.log(`\n${BOLD}${CYAN}Skills disponíveis para instalação:${RESET}`);
  skills.forEach(skill => {
    const readmePath = path.join(SKILLS_DIR, skill, 'README.md');
    let desc = '';
    if (fs.existsSync(readmePath)) {
      const readme = fs.readFileSync(readmePath, 'utf8');
      const lines = readme.split('\n');
      desc = lines.find(l => l.trim() !== '' && !l.startsWith('#')) || '';
    }
    console.log(`  - ${BOLD}${GREEN}${skill}${RESET} ${desc ? `(${desc.trim()})` : ''}`);
  });
  console.log('');
}

function copyFile(src, dest, dryRun, force) {
  if (fs.existsSync(dest) && !force) {
    console.log(`  ${YELLOW}⚠ Ignorado (já existe):${RESET} ${dest} ${CYAN}(use --force para sobrescrever)${RESET}`);
    return;
  }

  if (dryRun) {
    console.log(`  [DRY-RUN] Criaria/sobrescreveria arquivo: ${BOLD}${dest}${RESET}`);
    return;
  }
  const destDir = path.dirname(dest);
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }
  fs.copyFileSync(src, dest);
  console.log(`  ${GREEN}✓ Criado/Atualizado:${RESET} ${dest}`);
}

function mergeAgentsFile(src, dest, dryRun, force) {
  if (!fs.existsSync(dest)) {
    copyFile(src, dest, dryRun, force);
    return;
  }

  const srcContent = fs.readFileSync(src, 'utf8');
  const destContent = fs.readFileSync(dest, 'utf8');
  
  // Encontra o cabeçalho do agente de origem
  const srcLines = srcContent.split('\n');
  const agentHeaderLine = srcLines.find(line => line.startsWith('# Agent Definition:'));
  
  if (!agentHeaderLine) {
    // Se o arquivo de origem não tiver o cabeçalho de definição, faz fallback para cópia direta
    copyFile(src, dest, dryRun, force);
    return;
  }

  const agentHeader = agentHeaderLine.trim();
  const hasAgent = destContent.includes(agentHeader);

  if (hasAgent) {
    if (!force) {
      console.log(`  ${YELLOW}⚠ Ignorado (definição do agente já existe no AGENTS.md):${RESET} ${dest} ${CYAN}(use --force para atualizar a definição deste agente)${RESET}`);
      return;
    }

    if (dryRun) {
      console.log(`  [DRY-RUN] Atualizaria a definição do agente "${agentHeader}" em: ${BOLD}${dest}${RESET}`);
      return;
    }

    // Substitui apenas o bloco correspondente ao agente
    const blocks = destContent.split(/(?=# Agent Definition:)/g);
    let updated = false;
    for (let i = 0; i < blocks.length; i++) {
      if (blocks[i].trim().startsWith(agentHeader)) {
        blocks[i] = srcContent + (srcContent.endsWith('\n') ? '' : '\n');
        updated = true;
        break;
      }
    }

    if (updated) {
      fs.writeFileSync(dest, blocks.join(''), 'utf8');
      console.log(`  ${GREEN}✓ Atualizado bloco do agente em:${RESET} ${dest}`);
    }
  } else {
    // Se não existir, adicionamos ao final do arquivo de forma segura
    if (dryRun) {
      console.log(`  [DRY-RUN] Anexaria a definição do agente "${agentHeader}" no final de: ${BOLD}${dest}${RESET}`);
      return;
    }

    const needsNewline = destContent.length > 0 && !destContent.endsWith('\n');
    const newContent = destContent + (needsNewline ? '\n\n' : '\n') + srcContent + (srcContent.endsWith('\n') ? '' : '\n');
    fs.writeFileSync(dest, newContent, 'utf8');
    console.log(`  ${GREEN}✓ Adicionada definição do agente em:${RESET} ${dest}`);
  }
}

function removeAgentFromFile(dest, agentHeader, dryRun) {
  if (!fs.existsSync(dest)) return;

  const destContent = fs.readFileSync(dest, 'utf8');
  if (!destContent.includes(agentHeader)) return;

  if (dryRun) {
    console.log(`  [DRY-RUN] Removeria a definição do agente "${agentHeader}" de: ${BOLD}${dest}${RESET}`);
    return;
  }

  const blocks = destContent.split(/(?=# Agent Definition:)/g);
  const remainingBlocks = blocks.filter(block => !block.trim().startsWith(agentHeader));
  
  if (remainingBlocks.length === 0 || (remainingBlocks.length === 1 && remainingBlocks[0].trim() === '')) {
    // Se não restou nada, remove o arquivo AGENTS.md inteiro
    fs.unlinkSync(dest);
    console.log(`  ${RED}✗ Removido arquivo vazio:${RESET} ${dest}`);
  } else {
    // Caso contrário, grava os blocos restantes
    const newContent = remainingBlocks.join('').trim() + '\n';
    fs.writeFileSync(dest, newContent, 'utf8');
    console.log(`  ${RED}✗ Removida definição do agente de:${RESET} ${dest}`);
  }
}

function mergeInstructionFile(src, dest, skillName, dryRun, force) {
  if (!fs.existsSync(dest)) {
    if (dryRun) {
      console.log(`  [DRY-RUN] Criaria arquivo com bloco da skill "${skillName}": ${BOLD}${dest}${RESET}`);
      return;
    }
    const srcContent = fs.readFileSync(src, 'utf8');
    const newContent = `# === VIBE CODE SKILL: ${skillName} ===\n${srcContent}\n# === END SKILL: ${skillName} ===\n`;
    const destDir = path.dirname(dest);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }
    fs.writeFileSync(dest, newContent, 'utf8');
    console.log(`  ${GREEN}✓ Criado arquivo com bloco da skill em:${RESET} ${dest}`);
    return;
  }

  const destContent = fs.readFileSync(dest, 'utf8');
  const startDelimiter = `# === VIBE CODE SKILL: ${skillName} ===`;
  const endDelimiter = `# === END SKILL: ${skillName} ===`;

  const startIndex = destContent.indexOf(startDelimiter);
  const endIndex = destContent.indexOf(endDelimiter);

  const srcContent = fs.readFileSync(src, 'utf8');
  const blockContent = `${startDelimiter}\n${srcContent}\n${endDelimiter}`;

  if (startIndex !== -1 && endIndex !== -1 && endIndex > startIndex) {
    if (!force) {
      console.log(`  ${YELLOW}⚠ Ignorado (bloco da skill "${skillName}" já existe):${RESET} ${dest} ${CYAN}(use --force para atualizar o bloco)${RESET}`);
      return;
    }

    if (dryRun) {
      console.log(`  [DRY-RUN] Atualizaria o bloco da skill "${skillName}" em: ${BOLD}${dest}${RESET}`);
      return;
    }

    const before = destContent.substring(0, startIndex);
    const after = destContent.substring(endIndex + endDelimiter.length);
    const updatedContent = before.trimEnd() + '\n\n' + blockContent + '\n\n' + after.trimStart();
    fs.writeFileSync(dest, updatedContent.trim() + '\n', 'utf8');
    console.log(`  ${GREEN}✓ Atualizado bloco da skill em:${RESET} ${dest}`);
  } else {
    if (dryRun) {
      console.log(`  [DRY-RUN] Anexaria bloco da skill "${skillName}" em: ${BOLD}${dest}${RESET}`);
      return;
    }

    const needsNewline = destContent.length > 0 && !destContent.endsWith('\n');
    const updatedContent = destContent + (needsNewline ? '\n\n' : '\n') + blockContent + '\n';
    fs.writeFileSync(dest, updatedContent, 'utf8');
    console.log(`  ${GREEN}✓ Adicionado bloco da skill em:${RESET} ${dest}`);
  }
}

function removeInstructionFromFile(dest, skillName, dryRun) {
  if (!fs.existsSync(dest)) return;

  const destContent = fs.readFileSync(dest, 'utf8');
  const startDelimiter = `# === VIBE CODE SKILL: ${skillName} ===`;
  const endDelimiter = `# === END SKILL: ${skillName} ===`;

  const startIndex = destContent.indexOf(startDelimiter);
  const endIndex = destContent.indexOf(endDelimiter);

  if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
    return;
  }

  if (dryRun) {
    console.log(`  [DRY-RUN] Removeria bloco da skill "${skillName}" de: ${BOLD}${dest}${RESET}`);
    return;
  }

  const before = destContent.substring(0, startIndex);
  const after = destContent.substring(endIndex + endDelimiter.length);
  const updatedContent = (before.trimEnd() + '\n\n' + after.trimStart()).trim();

  if (updatedContent === '') {
    fs.unlinkSync(dest);
    console.log(`  ${RED}✗ Removido arquivo vazio:${RESET} ${dest}`);
  } else {
    fs.writeFileSync(dest, updatedContent + '\n', 'utf8');
    console.log(`  ${RED}✗ Removido bloco da skill "${skillName}" de:${RESET} ${dest}`);
  }
}

function getBestSkillFile(sourceSkillPath, targetTool) {
  // 1. Verifica arquivo específico da ferramenta
  const specificPath = path.join(sourceSkillPath, `SKILL.${targetTool}.md`);
  if (fs.existsSync(specificPath)) return specificPath;
  
  // 2. Verifica se existe o SKILL.md genérico
  const genericPath = path.join(sourceSkillPath, 'SKILL.md');
  if (fs.existsSync(genericPath)) return genericPath;
  
  // 3. Fallback inteligente: procura por qualquer arquivo que comece com "SKILL." e termine com ".md"
  try {
    const files = fs.readdirSync(sourceSkillPath);
    const skillFile = files.find(file => file.startsWith('SKILL.') && file.endsWith('.md'));
    if (skillFile) {
      return path.join(sourceSkillPath, skillFile);
    }
  } catch (err) {
    // Silencia erros de diretório inexistente
  }
  
  return null;
}

function installSkill(skillName, options) {
  const resolvedName = resolveSkillName(skillName);
  const sourceSkillPath = path.join(SKILLS_DIR, resolvedName);
  
  if (!fs.existsSync(sourceSkillPath)) {
    console.log(`${RED}Erro: A skill "${skillName}" não foi encontrada no pacote.${RESET}`);
    console.log(`Use ${BOLD}npx vibe-code-skills-br list${RESET} para ver as skills disponíveis.`);
    process.exit(1);
  }

  const tool = options.tool || 'all';
  const dryRun = options.dryRun || false;
  const force = options.force || false;
  const isGlobal = options.global || false;
  const targetProjectDir = isGlobal ? os.homedir() : process.cwd();

  console.log(`\n${BOLD}${CYAN}Iniciando a instalação da skill "${resolvedName}"...${RESET}`);
  if (isGlobal) console.log(`${CYAN}Destino: Instalação Global (Home)${RESET}`);
  if (dryRun) console.log(`${YELLOW}Modo DRY-RUN ativo. Nenhuma alteração física será feita.${RESET}`);

  // 1. Instalar para Claude Code (.claude/skills/<resolvedName>/SKILL.md)
  if (tool === 'claude' || tool === 'all') {
    const srcSkill = getBestSkillFile(sourceSkillPath, 'claude');
    if (srcSkill) {
      const destSkill = path.join(targetProjectDir, '.claude', 'skills', resolvedName, 'SKILL.md');
      console.log(`Instalando para ${BOLD}Claude Code${RESET}...`);
      copyFile(srcSkill, destSkill, dryRun, force);
    }
  }

  // 2. Instalar para Codex (AGENTS.md)
  if (tool === 'codex' || tool === 'all') {
    if (isGlobal) {
      console.log(`  ${YELLOW}⚠ Codex não suporta instalação global (ignorado).${RESET}`);
    } else {
      const srcAgents = path.join(sourceSkillPath, 'AGENTS.md');
      if (fs.existsSync(srcAgents)) {
        const destAgents = path.join(targetProjectDir, 'AGENTS.md');
        console.log(`Instalando para ${BOLD}Codex${RESET}...`);
        mergeAgentsFile(srcAgents, destAgents, dryRun, force);
      }
    }
  }

  // 3. Instalar para Antigravity (.antigravity/rules/<resolvedName>.md e Agent Skills do Gemini)
  if (tool === 'antigravity' || tool === 'all') {
    const srcSkill = getBestSkillFile(sourceSkillPath, 'antigravity');
    if (srcSkill) {
      // 3.1. Destino retrocompatível antigo (regras do prompt de sistema)
      const destRule = path.join(targetProjectDir, '.antigravity', 'rules', `${resolvedName}.md`);
      console.log(`Instalando para ${BOLD}Antigravity IDE (Regras Locals)${RESET}...`);
      copyFile(srcSkill, destRule, dryRun, force);

      // 3.2. Destino como Agent Skill nativa do Gemini/Antigravity (para o menu /)
      if (isGlobal) {
        const geminiSkillDir = path.join(os.homedir(), '.gemini', 'config', 'skills', resolvedName);
        console.log(`Instalando como ${BOLD}Agent Skill do Gemini/Antigravity (Slash Commands - Global)${RESET}...`);
        copyFile(srcSkill, path.join(geminiSkillDir, 'SKILL.md'), dryRun, force);
      } else {
        const geminiSkillDir1 = path.join(targetProjectDir, '.gemini', 'skills', resolvedName);
        const geminiSkillDir2 = path.join(targetProjectDir, '.gemini', 'config', 'skills', resolvedName);
        console.log(`Instalando como ${BOLD}Agent Skill do Gemini/Antigravity (Slash Commands - Local)${RESET}...`);
        copyFile(srcSkill, path.join(geminiSkillDir1, 'SKILL.md'), dryRun, force);
        copyFile(srcSkill, path.join(geminiSkillDir2, 'SKILL.md'), dryRun, force);
      }
    }
  }

  // 4. Instalar para Cursor (.cursorrules)
  if (tool === 'cursor' || tool === 'all') {
    const srcSkill = getBestSkillFile(sourceSkillPath, 'cursor');
    if (srcSkill) {
      const destCursor = path.join(targetProjectDir, '.cursorrules');
      console.log(`Instalando para ${BOLD}Cursor${RESET}...`);
      mergeInstructionFile(srcSkill, destCursor, resolvedName, dryRun, force);
    }
  }

  // 5. Instalar para Windsurf (.windsurfrules)
  if (tool === 'windsurf' || tool === 'all') {
    const srcSkill = getBestSkillFile(sourceSkillPath, 'windsurf');
    if (srcSkill) {
      const destWindsurf = path.join(targetProjectDir, '.windsurfrules');
      console.log(`Instalando para ${BOLD}Windsurf${RESET}...`);
      mergeInstructionFile(srcSkill, destWindsurf, resolvedName, dryRun, force);
    }
  }

  // 6. Instalar para GitHub Copilot (.github/copilot-instructions.md)
  if (tool === 'copilot' || tool === 'all') {
    const srcSkill = getBestSkillFile(sourceSkillPath, 'copilot');
    if (srcSkill) {
      const destCopilot = path.join(targetProjectDir, '.github', 'copilot-instructions.md');
      console.log(`Instalando para ${BOLD}GitHub Copilot${RESET}...`);
      mergeInstructionFile(srcSkill, destCopilot, resolvedName, dryRun, force);
    }
  }

  // 7. Instalar em arquivo personalizado (--custom-file)
  if (options.customFile) {
    const srcSkill = getBestSkillFile(sourceSkillPath, 'all');
    if (srcSkill) {
      const destCustom = path.isAbsolute(options.customFile)
        ? options.customFile
        : path.join(targetProjectDir, options.customFile);
      console.log(`Instalando para arquivo personalizado ${BOLD}${options.customFile}${RESET}...`);
      mergeInstructionFile(srcSkill, destCustom, resolvedName, dryRun, force);
    }
  }

  // 8. Copiar os prompts de apoio (.vibe-code-skills/prompts/<resolvedName>/*)
  const srcPrompts = path.join(sourceSkillPath, 'prompts');
  if (fs.existsSync(srcPrompts)) {
    const promptFiles = fs.readdirSync(srcPrompts);
    if (promptFiles.length > 0) {
      console.log(`Copiando prompts de apoio para ${BOLD}.vibe-code-skills/prompts/${resolvedName}/${RESET}...`);
      promptFiles.forEach(file => {
        const srcFile = path.join(srcPrompts, file);
        const destFile = path.join(targetProjectDir, '.vibe-code-skills', 'prompts', resolvedName, file);
        copyFile(srcFile, destFile, dryRun, force);
      });
    }
  }

  // 9. Configurações Especiais por Skill (apenas local)
  if (resolvedName === 'vibe-orquestrador' && !isGlobal && !dryRun) {
    const gitignorePath = path.join(targetProjectDir, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      if (!gitignoreContent.includes('.vibe/')) {
        const needsLeadingNewline = gitignoreContent.length > 0 && !gitignoreContent.endsWith('\n');
        const insertion = `${needsLeadingNewline ? '\n' : ''}\n# Vibe Orchestrator State\n.vibe/\n`;
        fs.appendFileSync(gitignorePath, insertion);
        console.log(`  ${GREEN}✓ Atualizado:${RESET} .gitignore (adicionado .vibe/)`);
      }
    }
  }

  console.log(`\n${BOLD}${GREEN}Instalação concluída!${RESET}`);
}

function removeFileOrDir(targetPath, dryRun) {
  if (!fs.existsSync(targetPath)) return;
  
  if (dryRun) {
    console.log(`  [DRY-RUN] Removeria: ${BOLD}${targetPath}${RESET}`);
    return;
  }
  
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    fs.rmSync(targetPath, { recursive: true, force: true });
    console.log(`  ${RED}✗ Removido diretório:${RESET} ${targetPath}`);
  } else {
    fs.unlinkSync(targetPath);
    console.log(`  ${RED}✗ Removido arquivo:${RESET} ${targetPath}`);
  }
}

function uninstallSkill(skillName, options) {
  const resolvedName = resolveSkillName(skillName);
  const dryRun = options.dryRun || false;
  const isGlobal = options.global || false;
  const targetProjectDir = isGlobal ? os.homedir() : process.cwd();

  console.log(`\n${BOLD}${RED}Desinstalando a skill "${resolvedName}"...${RESET}`);
  if (isGlobal) console.log(`${CYAN}Destino: Remoção Global (Home)${RESET}`);
  if (dryRun) console.log(`${YELLOW}Modo DRY-RUN ativo. Nenhuma alteração física será feita.${RESET}`);

  // Tenta remover das pastas conhecidas e dos prompts
  const claudePath = path.join(targetProjectDir, '.claude', 'skills', resolvedName);
  const antigravityPath = path.join(targetProjectDir, '.antigravity', 'rules', `${resolvedName}.md`);
  const geminiPath1 = path.join(targetProjectDir, '.gemini', 'skills', resolvedName);
  const geminiPath2 = path.join(targetProjectDir, '.gemini', 'config', 'skills', resolvedName);
  const geminiPath = isGlobal
    ? path.join(os.homedir(), '.gemini', 'config', 'skills', resolvedName)
    : geminiPath2;
  const cursorPath = path.join(targetProjectDir, '.cursorrules');
  const windsurfPath = path.join(targetProjectDir, '.windsurfrules');
  const copilotPath = path.join(targetProjectDir, '.github', 'copilot-instructions.md');
  const promptsPath = path.join(targetProjectDir, '.vibe-code-skills', 'prompts', resolvedName);
  
  // Codex usa AGENTS.md raiz, removemos apenas o bloco da skill atual de forma segura (apenas local)
  if (!isGlobal) {
    const srcAgents = path.join(SKILLS_DIR, resolvedName, 'AGENTS.md');
    if (fs.existsSync(srcAgents)) {
      const srcContent = fs.readFileSync(srcAgents, 'utf8');
      const agentHeaderLine = srcContent.split('\n').find(line => line.startsWith('# Agent Definition:'));
      if (agentHeaderLine) {
        const destAgents = path.join(targetProjectDir, 'AGENTS.md');
        removeAgentFromFile(destAgents, agentHeaderLine.trim(), dryRun);
      }
    }
  }
  
  // Se removemos arquivo personalizado
  if (options.customFile) {
    const destCustom = path.isAbsolute(options.customFile)
      ? options.customFile
      : path.join(targetProjectDir, options.customFile);
    removeInstructionFromFile(destCustom, resolvedName, dryRun);
  }
  
  removeFileOrDir(claudePath, dryRun);
  removeFileOrDir(antigravityPath, dryRun);
  removeFileOrDir(geminiPath, dryRun);
  if (!isGlobal) removeFileOrDir(geminiPath1, dryRun);
  removeInstructionFromFile(cursorPath, resolvedName, dryRun);
  removeInstructionFromFile(windsurfPath, resolvedName, dryRun);
  removeInstructionFromFile(copilotPath, resolvedName, dryRun);
  removeFileOrDir(promptsPath, dryRun);

  // Limpar regras do .gitignore (apenas local)
  if (resolvedName === 'vibe-orquestrador' && !isGlobal && !dryRun) {
    const gitignorePath = path.join(targetProjectDir, '.gitignore');
    if (fs.existsSync(gitignorePath)) {
      const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
      const targetRule = '\n# Vibe Orchestrator State\n.vibe/\n';
      const targetRuleAlt = '# Vibe Orchestrator State\n.vibe/\n';
      
      let updatedContent = gitignoreContent.replace(targetRule, '').replace(targetRuleAlt, '');
      updatedContent = updatedContent.trimEnd() + '\n';
      
      if (updatedContent.trim() === '') {
        fs.writeFileSync(gitignorePath, '', 'utf8');
      } else {
        fs.writeFileSync(gitignorePath, updatedContent, 'utf8');
      }
      console.log(`  ${RED}✗ Limpo:${RESET} .gitignore (removido .vibe/)`);
    }
  }

  console.log(`\n${BOLD}${GREEN}Desinstalação concluída!${RESET}`);
}

function main() {
  const args = process.argv.slice(2);

  let parsed;
  try {
    parsed = parseArgs({
      args,
      options: {
        tool: { type: 'string', short: 't', default: 'all' },
        global: { type: 'boolean', short: 'g', default: false },
        'custom-file': { type: 'string', short: 'c' },
        force: { type: 'boolean', short: 'f', default: false },
        'dry-run': { type: 'boolean', default: false },
        help: { type: 'boolean', short: 'h', default: false },
      },
      allowPositionals: true,
    });
  } catch (error) {
    console.log(`${RED}Erro ao analisar argumentos: ${error.message}${RESET}`);
    process.exit(1);
  }

  const { values, positionals } = parsed;

  if (values.help || positionals.length === 0) {
    printHelp();
    return;
  }

  const command = positionals[0];

  if (command === 'list') {
    listSkills();
    return;
  }

  if (command === 'install') {
    const skillName = positionals[1];
    const validTools = ['all', 'claude', 'codex', 'antigravity', 'cursor', 'windsurf', 'copilot'];
    if (!validTools.includes(values.tool)) {
      console.log(`${RED}Erro: Ferramenta "${values.tool}" inválida. Use: claude, codex, antigravity, cursor, windsurf, copilot ou all.${RESET}`);
      process.exit(1);
    }
    const installOptions = {
      tool: values.tool,
      dryRun: values['dry-run'],
      force: values.force,
      global: values.global,
      customFile: values['custom-file']
    };

    if (!skillName || skillName.toLowerCase() === 'all') {
      const skills = getAvailableSkills();
      console.log(`\n${BOLD}${CYAN}Instalando TODAS as skills disponíveis...${RESET}`);
      skills.forEach(skill => {
        installSkill(skill, installOptions);
      });
    } else {
      installSkill(skillName, installOptions);
    }
    return;
  }

  if (command === 'uninstall') {
    const skillName = positionals[1];
    const uninstallOptions = {
      dryRun: values['dry-run'],
      global: values.global,
      customFile: values['custom-file']
    };

    if (!skillName || skillName.toLowerCase() === 'all') {
      const skills = getAvailableSkills();
      console.log(`\n${BOLD}${RED}Desinstalando TODAS as skills...${RESET}`);
      skills.forEach(skill => {
        uninstallSkill(skill, uninstallOptions);
      });
    } else {
      uninstallSkill(skillName, uninstallOptions);
    }
    return;
  }

  console.log(`${RED}Erro: Comando desconhecido "${command}"${RESET}`);
  printHelp();
  process.exit(1);
}

main();
