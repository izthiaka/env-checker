// Exemple d'utilisation avec Next.js
const { checkEnv, loadAllEnvFiles } = require("@izthiaka/env-checker");

// Charger automatiquement tous les fichiers .env détectés
loadAllEnvFiles();

// Vérifier les variables d'environnement au build
checkEnv({
  requiredVars: [
    "NEXT_PUBLIC_API_URL",
    "DATABASE_URL",
    "NEXTAUTH_SECRET",
    "NEXTAUTH_URL",
  ],
  optionalVars: ["NEXT_PUBLIC_DEBUG", "NEXT_PUBLIC_ANALYTICS_ID", "SENTRY_DSN"],
});

// Configuration Next.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    // Variables publiques (accessibles côté client)
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DEBUG: process.env.NEXT_PUBLIC_DEBUG,
    NEXT_PUBLIC_ANALYTICS_ID: process.env.NEXT_PUBLIC_ANALYTICS_ID,
  },
  // Configuration pour les variables privées
  serverRuntimeConfig: {
    DATABASE_URL: process.env.DATABASE_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    SENTRY_DSN: process.env.SENTRY_DSN,
  },
};

module.exports = nextConfig;
