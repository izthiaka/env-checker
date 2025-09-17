import { config } from "dotenv";
import { existsSync } from "fs";
import { join } from "path";
import { EnvCheckerOptions, EnvCheckResult } from "./types";

/**
 * Classe principale pour vérifier les variables d'environnement
 */
export class EnvChecker {
  private options: Required<EnvCheckerOptions>;

  constructor(options: EnvCheckerOptions) {
    this.options = {
      envFile: ".env",
      optionalVars: [],
      loadEnvFile: true,
      strict: false,
      errorPrefix: "[ENV-CHECKER]",
      ...options,
    };

    this.loadEnvFileIfNeeded();
  }

  /**
   * Charge le fichier .env si nécessaire
   */
  private loadEnvFileIfNeeded(): void {
    if (!this.options.loadEnvFile) {
      return;
    }

    const envPath = this.resolveEnvFilePath();

    if (existsSync(envPath)) {
      config({ path: envPath });
    }
  }

  /**
   * Résout le chemin du fichier .env
   */
  private resolveEnvFilePath(): string {
    const { envFile } = this.options;

    if (envFile?.startsWith("/")) {
      return envFile; // Chemin absolu
    }

    return join(process.cwd(), envFile);
  }

  /**
   * Vérifie les variables d'environnement
   */
  public check(): EnvCheckResult {
    const result: EnvCheckResult = {
      isValid: true,
      missingVars: [],
      presentVars: [],
      optionalPresentVars: [],
      optionalMissingVars: [],
      errors: [],
    };

    // Vérifier les variables requises
    for (const varName of this.options.requiredVars) {
      const value = process.env[varName];

      if (value === undefined || value === "") {
        result.missingVars.push(varName);
        result.isValid = false;
        result.errors.push(
          `${this.options.errorPrefix} Variable requise manquante: ${varName}`
        );
      } else {
        result.presentVars.push(varName);
      }
    }

    // Vérifier les variables optionnelles
    for (const varName of this.options.optionalVars) {
      const value = process.env[varName];

      if (value === undefined || value === "") {
        result.optionalMissingVars.push(varName);
      } else {
        result.optionalPresentVars.push(varName);
      }
    }

    // Gérer le mode strict
    if (this.options.strict && !result.isValid) {
      const errorMessage = result.errors.join("\n");
      console.error(errorMessage);
      process.exit(1);
    }

    return result;
  }

  /**
   * Vérifie et retourne une variable spécifique
   */
  public getVar(varName: string, defaultValue?: string): string | undefined {
    const value = process.env[varName];

    if (value === undefined || value === "") {
      if (defaultValue !== undefined) {
        return defaultValue;
      }

      if (this.options.strict) {
        console.error(
          `${this.options.errorPrefix} Variable manquante: ${varName}`
        );
        process.exit(1);
      }

      return undefined;
    }

    return value;
  }

  /**
   * Vérifie et retourne une variable numérique
   */
  public getNumber(varName: string, defaultValue?: number): number | undefined {
    const value = this.getVar(varName);

    if (value === undefined) {
      return defaultValue;
    }

    const numValue = Number(value);

    if (isNaN(numValue)) {
      const errorMessage = `${this.options.errorPrefix} Variable ${varName} n'est pas un nombre valide: ${value}`;

      if (this.options.strict) {
        console.error(errorMessage);
        process.exit(1);
      }

      return defaultValue;
    }

    return numValue;
  }

  /**
   * Vérifie et retourne une variable booléenne
   */
  public getBoolean(
    varName: string,
    defaultValue?: boolean
  ): boolean | undefined {
    const value = this.getVar(varName);

    if (value === undefined) {
      return defaultValue;
    }

    const lowerValue = value.toLowerCase();

    if (["true", "1", "yes", "on"].includes(lowerValue)) {
      return true;
    }

    if (["false", "0", "no", "off"].includes(lowerValue)) {
      return false;
    }

    const errorMessage = `${this.options.errorPrefix} Variable ${varName} n'est pas un booléen valide: ${value}`;

    if (this.options.strict) {
      console.error(errorMessage);
      process.exit(1);
    }

    return defaultValue;
  }

  /**
   * Affiche un résumé des variables d'environnement
   */
  public printSummary(): void {
    const result = this.check();

    console.log(
      `${this.options.errorPrefix} Résumé des variables d'environnement:`
    );
    console.log(
      `  Variables requises présentes: ${result.presentVars.length}/${this.options.requiredVars.length}`
    );
    console.log(
      `  Variables optionnelles présentes: ${result.optionalPresentVars.length}/${this.options.optionalVars.length}`
    );

    if (result.missingVars.length > 0) {
      console.log(`  Variables manquantes: ${result.missingVars.join(", ")}`);
    }

    if (result.optionalMissingVars.length > 0) {
      console.log(
        `  Variables optionnelles manquantes: ${result.optionalMissingVars.join(
          ", "
        )}`
      );
    }
  }
}
