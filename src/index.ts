import { EnvChecker } from "./env-checker";
import { EnvCheckerOptions } from "./types";

/**
 * Fonction utilitaire pour créer rapidement un EnvChecker
 */
export function createEnvChecker(options: EnvCheckerOptions): EnvChecker {
  return new EnvChecker(options);
}

/**
 * Fonction utilitaire pour vérifier rapidement les variables d'environnement
 */
export function checkEnv(options: EnvCheckerOptions) {
  const checker = new EnvChecker(options);
  return checker.check();
}

/**
 * Fonction utilitaire pour vérifier les variables d'environnement avec mode strict
 */
export function checkEnvStrict(options: EnvCheckerOptions) {
  const checker = new EnvChecker({ ...options, strict: true });
  return checker.check();
}

/**
 * Fonction utilitaire pour obtenir une variable d'environnement avec validation
 */
export function getEnvVar(
  varName: string,
  defaultValue?: string
): string | undefined {
  const checker = new EnvChecker({ requiredVars: [], loadEnvFile: true });
  return checker.getVar(varName, defaultValue);
}

/**
 * Fonction utilitaire pour obtenir une variable d'environnement numérique
 */
export function getEnvNumber(
  varName: string,
  defaultValue?: number
): number | undefined {
  const checker = new EnvChecker({ requiredVars: [], loadEnvFile: true });
  return checker.getNumber(varName, defaultValue);
}

/**
 * Fonction utilitaire pour obtenir une variable d'environnement booléenne
 */
export function getEnvBoolean(
  varName: string,
  defaultValue?: boolean
): boolean | undefined {
  const checker = new EnvChecker({ requiredVars: [], loadEnvFile: true });
  return checker.getBoolean(varName, defaultValue);
}

/**
 * Fonction utilitaire pour détecter automatiquement les fichiers .env
 */
export function detectEnvFiles(): string[] {
  const { existsSync } = require("fs");
  const { join } = require("path");

  const envFiles = [
    ".env",
    ".env.local",
    ".env.development",
    ".env.development.local",
    ".env.production",
    ".env.production.local",
    ".env.staging",
    ".env.staging.local",
    ".env.test",
    ".env.test.local",
  ];

  return envFiles.filter((file) => existsSync(join(process.cwd(), file)));
}

/**
 * Fonction utilitaire pour charger automatiquement tous les fichiers .env détectés
 */
export function loadAllEnvFiles(): void {
  const { config } = require("dotenv");
  const envFiles = detectEnvFiles();

  envFiles.forEach((file) => {
    config({ path: file });
  });

  if (envFiles.length > 0) {
    console.log(`[ENV-CHECKER] Fichiers .env chargés: ${envFiles.join(", ")}`);
  }
}

// Export des types et classes principales
export { EnvChecker } from "./env-checker";
export * from "./types";
