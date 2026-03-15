const { execSync } = require('child_process');

process.env.DATABASE_URL = "postgresql://postgres:p%24ass%3Aword%21@db.rpxttduahcjyebkrjucw.supabase.co:5432/postgres";

console.log("Sending Prisma definitions to Supabase...");
try {
  execSync('npx prisma db push', { stdio: 'inherit' });
  console.log("Supabase sync complete!");
} catch (error) {
  console.error("Prisma push encountered an error:");
}
