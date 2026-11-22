const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const serverDir = path.resolve(__dirname, '..');
const envPath = path.join(serverDir, '.env');
const envExamplePath = path.join(serverDir, '.env.example');

// 1. Ensure .env exists so Prisma CLI never complains about missing env vars
if (!fs.existsSync(envPath)) {
  console.log('No .env found, creating default production .env...');
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
  } else {
    fs.writeFileSync(
      envPath,
      'PORT=5000\nDATABASE_URL="file:./dev.db"\nJWT_SECRET="leadmanager_super_secret_jwt_key_2026_dev"\nNODE_ENV=production\n'
    );
  }
}

// 2. Load environment variables
require('dotenv').config({ path: envPath });

// Ensure fallbacks are guaranteed
process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./dev.db';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'leadmanager_super_secret_jwt_key_2026_dev';

console.log('=== Building Lead Manager Backend ===');
console.log('Using DATABASE_URL:', process.env.DATABASE_URL);

// 3. Generate Prisma Client
console.log('Running: prisma generate...');
execSync('npx prisma generate', {
  cwd: serverDir,
  stdio: 'inherit',
  env: { ...process.env },
});

// 4. Push SQLite schema (creates dev.db and tables)
console.log('Running: prisma db push...');
execSync('npx prisma db push --accept-data-loss', {
  cwd: serverDir,
  stdio: 'inherit',
  env: { ...process.env },
});

// 5. Seed initial demo data
try {
  console.log('Running: database seed...');
  execSync('node prisma/seed.js', {
    cwd: serverDir,
    stdio: 'inherit',
    env: { ...process.env },
  });
} catch (err) {
  console.warn('Notice: Seeding completed or skipped:', err.message);
}

console.log('=== Backend build finished successfully! ===');
