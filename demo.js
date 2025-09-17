#!/usr/bin/env node

// Démonstration du package env-checker
const {
  EnvChecker,
  checkEnv,
  getEnvVar,
  getEnvNumber,
  getEnvBoolean,
  loadAllEnvFiles,
} = require("./dist/index");

console.log("🚀 Démonstration du package @izthiaka/env-checker\n");

// 1. Charger automatiquement tous les fichiers .env
console.log("1. Chargement automatique des fichiers .env:");
loadAllEnvFiles();

// 2. Vérification simple avec checkEnv
console.log("\n2. Vérification simple:");
const result = checkEnv({
  requiredVars: ["DATABASE_URL", "PORT"],
  optionalVars: ["DEBUG", "LOG_LEVEL"],
  loadEnvFile: false,
});

console.log("Résultat:", {
  isValid: result.isValid,
  missingVars: result.missingVars,
  presentVars: result.presentVars,
});

// 3. Utilisation avec la classe EnvChecker
console.log("\n3. Utilisation avec la classe EnvChecker:");
const envChecker = new EnvChecker({
  requiredVars: ["DATABASE_URL", "PORT"],
  optionalVars: ["DEBUG", "LOG_LEVEL"],
  strict: false,
  errorPrefix: "[DEMO]",
});

// Afficher un résumé
envChecker.printSummary();

// 4. Obtenir des variables avec types
console.log("\n4. Obtenir des variables avec types:");
const port = getEnvNumber("PORT", 3000);
const debug = getEnvBoolean("DEBUG", false);
const dbUrl = getEnvVar("DATABASE_URL");

console.log("Configuration:", {
  port,
  debug,
  dbUrl: dbUrl ? "***" + dbUrl.slice(-10) : "non définie",
});

// 5. Test avec des variables définies
console.log("\n5. Test avec des variables définies:");
process.env.DATABASE_URL = "postgresql://localhost:5432/test";
process.env.PORT = "3000";
process.env.DEBUG = "true";

const testResult = checkEnv({
  requiredVars: ["DATABASE_URL", "PORT"],
  optionalVars: ["DEBUG"],
  loadEnvFile: false,
});

console.log("Test avec variables définies:", {
  isValid: testResult.isValid,
  missingVars: testResult.missingVars,
  presentVars: testResult.presentVars,
});

console.log("\n✅ Démonstration terminée !");
