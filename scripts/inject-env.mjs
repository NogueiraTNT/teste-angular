/**
 * Gera `src/environments/environment.secrets.ts` a partir de `.env` ou variáveis de ambiente.
 * Se não houver `.env`, usa variáveis já exportadas no shell (útil em CI).
 * Se não houver dados, copia `environment.secrets.example.ts` quando o arquivo de saída não existir.
 */
import { config } from 'dotenv';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const envPath = join(root, '.env');
const outPath = join(root, 'src/environments/environment.secrets.ts');
const examplePath = join(root, 'src/environments/environment.secrets.example.ts');

const KEYS = [
  ['apiKey', 'FIREBASE_API_KEY'],
  ['authDomain', 'FIREBASE_AUTH_DOMAIN'],
  ['projectId', 'FIREBASE_PROJECT_ID'],
  ['storageBucket', 'FIREBASE_STORAGE_BUCKET'],
  ['messagingSenderId', 'FIREBASE_MESSAGING_SENDER_ID'],
  ['appId', 'FIREBASE_APP_ID'],
];

function escape(str) {
  return String(str ?? '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'");
}

if (fs.existsSync(envPath)) {
  config({ path: envPath });
} else {
  config();
}

const values = Object.fromEntries(KEYS.map(([, envName]) => [envName, process.env[envName] ?? '']));
const hasAny = Object.values(values).some((v) => v && String(v).length > 0);
const allPresent = KEYS.every(([, envName]) => process.env[envName] && String(process.env[envName]).length > 0);

if (allPresent) {
  const lines = [];
  lines.push('/** Gerado por scripts/inject-env.mjs — não edite à mão */');
  lines.push('export const firebaseSecrets = {');
  for (const [prop, envName] of KEYS) {
    lines.push(`  ${prop}: '${escape(process.env[envName])}',`);
  }
  lines.push('} as const;');
  fs.writeFileSync(outPath, `${lines.join('\n')}\n`, 'utf8');
  console.log('[inject-env] Gerado environment.secrets.ts a partir das variáveis de ambiente.');
} else if (!fs.existsSync(outPath)) {
  fs.copyFileSync(examplePath, outPath);
  console.warn(
    '[inject-env] Variáveis Firebase incompletas; copiado environment.secrets.example.ts → environment.secrets.ts. ' +
      'Crie `.env` (veja `.env.example`) e rode `npm run env`.',
  );
} else if (!hasAny) {
  console.warn('[inject-env] Nenhuma variável Firebase encontrada; mantendo environment.secrets.ts existente.');
} else {
  console.warn('[inject-env] Variáveis Firebase incompletas; mantendo environment.secrets.ts existente.');
}
