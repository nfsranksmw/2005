/**
 * AAS Skill Manager - Agentic Awesome Skills Installer for Google Antigravity
 * Repository: https://github.com/sickn33/agentic-awesome-skills
 *
 * Provides local catalog indexing, search across 2,712 skills, and automated
 * sparse installation directly into .agents/skills/ without requiring Git.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const REPO_OWNER = 'sickn33';
const REPO_NAME = 'agentic-awesome-skills';
const REPO_BRANCH = 'main';

const BASE_RAW_URL = `https://raw.githubusercontent.com/${REPO_OWNER}/${REPO_NAME}/${REPO_BRANCH}`;
const GITHUB_API_URL = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

const WORKSPACE_ROOT = path.resolve(__dirname, '..');
const SKILLS_DIR = path.join(WORKSPACE_ROOT, '.agents', 'skills');
const INDEX_CACHE_PATH = path.join(__dirname, 'aas-skills-index.json');
const TREE_CACHE_PATH = path.join(__dirname, 'aas-repo-tree.json');

// Helper to make HTTPS GET requests with redirect support and custom User-Agent
function fetchUrl(url, asJson = false) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.pathname + parsedUrl.search,
      headers: {
        'User-Agent': 'Antigravity-AAS-Manager/1.0',
        'Accept': asJson ? 'application/json' : '*/*'
      }
    };

    https.get(options, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location, asJson).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} from ${url}`));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (asJson) {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(new Error(`Failed to parse JSON: ${e.message}`));
          }
        } else {
          resolve(body);
        }
      });
    }).on('error', reject);
  });
}

// Ensure the skills index is cached locally
async function getSkillsIndex() {
  if (fs.existsSync(INDEX_CACHE_PATH)) {
    try {
      const cached = JSON.parse(fs.readFileSync(INDEX_CACHE_PATH, 'utf8'));
      if (Array.isArray(cached) && cached.length > 0) return cached;
    } catch (_) {}
  }
  console.log('🔄 Descargando catálogo completo de habilidades (2,712+ skills)...');
  const indexUrl = `${BASE_RAW_URL}/skills_index.json`;
  const data = await fetchUrl(indexUrl, true);
  fs.writeFileSync(INDEX_CACHE_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log(`✅ Catálogo indexado guardado: ${data.length} habilidades disponibles.`);
  return data;
}

// Ensure the repo tree is cached locally to know which auxiliary files exist per skill
async function getRepoTree() {
  if (fs.existsSync(TREE_CACHE_PATH)) {
    try {
      const cached = JSON.parse(fs.readFileSync(TREE_CACHE_PATH, 'utf8'));
      if (cached && Array.isArray(cached.tree)) return cached.tree;
    } catch (_) {}
  }
  console.log('🔄 Obteniendo árbol de archivos de GitHub...');
  const treeUrl = `${GITHUB_API_URL}/git/trees/${REPO_BRANCH}?recursive=1`;
  const data = await fetchUrl(treeUrl, true);
  if (data && Array.isArray(data.tree)) {
    fs.writeFileSync(TREE_CACHE_PATH, JSON.stringify(data, null, 2), 'utf8');
    return data.tree;
  }
  return [];
}

// Install a single skill by ID
async function installSkill(skillId, tree = null) {
  const targetDir = path.join(SKILLS_DIR, skillId);
  console.log(`\n📦 Instalando habilidad: ${skillId}...`);

  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  if (!tree) {
    tree = await getRepoTree();
  }

  // Find all files belonging to skills/<skillId>/
  const prefix = `skills/${skillId}/`;
  const skillFiles = tree.filter(item => item.type === 'blob' && item.path.startsWith(prefix));

  if (skillFiles.length === 0) {
    // Fallback: try fetching SKILL.md directly
    try {
      const skillMdUrl = `${BASE_RAW_URL}/skills/${skillId}/SKILL.md`;
      const content = await fetchUrl(skillMdUrl);
      fs.writeFileSync(path.join(targetDir, 'SKILL.md'), content, 'utf8');
      console.log(`   ✓ ${skillId}/SKILL.md`);
      return true;
    } catch (e) {
      console.error(`   ❌ No se encontró la habilidad '${skillId}' en el repositorio.`);
      return false;
    }
  }

  for (const file of skillFiles) {
    const relPath = file.path.substring(prefix.length);
    const destPath = path.join(targetDir, relPath);
    const destDir = path.dirname(destPath);
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const fileUrl = `${BASE_RAW_URL}/${file.path}`;
    try {
      const content = await fetchUrl(fileUrl);
      fs.writeFileSync(destPath, content, 'utf8');
      console.log(`   ✓ ${relPath}`);
    } catch (err) {
      console.error(`   ⚠️ Error descargando ${relPath}: ${err.message}`);
    }
  }

  console.log(`✨ Habilidad '${skillId}' instalada con éxito en .agents/skills/${skillId}`);
  return true;
}

// Predefined Curated Bundles
const BUNDLES = {
  'essentials': [
    'concise-planning',
    'systematic-debugging',
    'test-driven-development',
    'lint-and-validate',
    'git-pushing'
  ],
  'webapp': [
    'frontend-design',
    'tailwind-patterns',
    'ui-a11y',
    'browser-automation',
    'form-cro',
    'seo-audit',
    'web-performance-optimization'
  ],
  'core-aas': [
    'aas-discover',
    'aas-compose-stack',
    'aas-review-stack'
  ],
  'testing-qa': [
    'e2e-testing',
    'api-testing',
    'code-review',
    'accessibility-compliance-accessibility-audit'
  ],
  'recommended-project': [
    // Essentials
    'concise-planning',
    'systematic-debugging',
    'test-driven-development',
    'lint-and-validate',
    'git-pushing',
    // WebApp & Design
    'frontend-design',
    'tailwind-patterns',
    'ui-a11y',
    'browser-automation',
    'form-cro',
    'seo-audit',
    // Testing & Performance
    'e2e-testing',
    'api-testing',
    'code-review',
    'accessibility-compliance-accessibility-audit',
    // AAS Core Meta-Skills
    'aas-discover',
    'aas-compose-stack',
    'aas-review-stack'
  ]
};

// Search skills in the catalog
async function searchSkills(query) {
  const index = await getSkillsIndex();
  const q = query.toLowerCase().trim();
  const results = index.filter(s => {
    return (s.name && s.name.toLowerCase().includes(q)) ||
           (s.id && s.id.toLowerCase().includes(q)) ||
           (s.category && s.category.toLowerCase().includes(q)) ||
           (s.description && s.description.toLowerCase().includes(q));
  });

  console.log(`\n🔍 Resultados de búsqueda para '${query}' (${results.length} encontrados):`);
  console.log('='.repeat(70));
  results.slice(0, 25).forEach(r => {
    console.log(`• \x1b[36m${r.id}\x1b[0m [${r.category || 'general'}]`);
    console.log(`  ${(r.description || 'Sin descripción').substring(0, 100)}...`);
  });
  if (results.length > 25) {
    console.log(`\n... y ${results.length - 25} resultados más. Usa un término más específico.`);
  }
}

// List installed skills
function listInstalled() {
  if (!fs.existsSync(SKILLS_DIR)) {
    console.log('No hay carpeta .agents/skills en este proyecto.');
    return;
  }
  const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  console.log(`\n📂 Habilidades instaladas en .agents/skills/ (${entries.length} totales):`);
  console.log('='.repeat(70));
  entries.forEach(name => {
    const skillMd = path.join(SKILLS_DIR, name, 'SKILL.md');
    let desc = '';
    if (fs.existsSync(skillMd)) {
      const content = fs.readFileSync(skillMd, 'utf8');
      const match = content.match(/description:\s*(?:>-\s*)?([^\n]+)/);
      if (match) desc = match[1].trim().replace(/^["']|["']$/g, '');
    }
    console.log(`• \x1b[32m${name}\x1b[0m: ${desc.substring(0, 80)}...`);
  });
}

// CLI Entrypoint
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'list';

  try {
    if (command === 'search') {
      const query = args.slice(1).join(' ');
      if (!query) {
        console.log('Uso: node aas-skill-manager.js search <palabra-clave>');
        return;
      }
      await searchSkills(query);
    } else if (command === 'install') {
      const skillIds = args.slice(1);
      if (skillIds.length === 0) {
        console.log('Uso: node aas-skill-manager.js install <skill-id> [<skill-id-2> ...]');
        return;
      }
      const tree = await getRepoTree();
      for (const id of skillIds) {
        await installSkill(id, tree);
      }
      console.log('\n🎉 Instalación completada con éxito.');
    } else if (command === 'install-bundle') {
      const bundleName = args[1] || 'recommended-project';
      const bundleList = BUNDLES[bundleName];
      if (!bundleList) {
        console.log(`Paquete desconocido '${bundleName}'. Opciones: ${Object.keys(BUNDLES).join(', ')}`);
        return;
      }
      console.log(`🚀 Instalando paquete '${bundleName}' (${bundleList.length} habilidades)...`);
      const tree = await getRepoTree();
      for (const id of bundleList) {
        await installSkill(id, tree);
      }
      console.log(`\n🎉 Paquete '${bundleName}' instalado con éxito.`);
    } else if (command === 'list') {
      listInstalled();
    } else {
      console.log('Comandos disponibles:');
      console.log('  node aas-skill-manager.js list');
      console.log('  node aas-skill-manager.js search <término>');
      console.log('  node aas-skill-manager.js install <skill-id>');
      console.log('  node aas-skill-manager.js install-bundle <recommended-project|essentials|webapp|core-aas|testing-qa>');
    }
  } catch (err) {
    console.error('Error:', err.message);
  }
}

if (require.main === module) {
  main();
}

module.exports = {
  installSkill,
  searchSkills,
  getSkillsIndex,
  BUNDLES
};
