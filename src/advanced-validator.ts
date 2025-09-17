import { ValidationConfig } from "./types";

/**
 * Validateurs prédéfinis pour les formats communs
 */
export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  },

  url: (value: string): boolean => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  },

  uuid: (value: string): boolean => {
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(value);
  },

  date: (value: string): boolean => {
    const date = new Date(value);
    return !isNaN(date.getTime());
  },

  json: (value: string): boolean => {
    try {
      JSON.parse(value);
      return true;
    } catch {
      return false;
    }
  },

  port: (value: string): boolean => {
    const port = parseInt(value, 10);
    return !isNaN(port) && port >= 1 && port <= 65535;
  },

  ip: (value: string): boolean => {
    const ipRegex =
      /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
    return ipRegex.test(value);
  },

  semver: (value: string): boolean => {
    const semverRegex =
      /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/;
    return semverRegex.test(value);
  },

  hex: (value: string): boolean => {
    const hexRegex = /^[0-9a-fA-F]+$/;
    return hexRegex.test(value);
  },

  base64: (value: string): boolean => {
    const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
    return base64Regex.test(value) && value.length % 4 === 0;
  },
};

/**
 * Transformateurs prédéfinis pour les valeurs
 */
export const transformers = {
  toLowerCase: (value: string): string => value.toLowerCase(),
  toUpperCase: (value: string): string => value.toUpperCase(),
  trim: (value: string): string => value.trim(),
  toNumber: (value: string): number => Number(value),
  toBoolean: (value: string): boolean => {
    const lowerValue = value.toLowerCase();
    return ["true", "1", "yes", "on"].includes(lowerValue);
  },
  toArray: (value: string, separator: string = ","): string[] => {
    return value.split(separator).map((item) => item.trim());
  },
  toObject: (value: string): any => {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  },
};

/**
 * Classe pour la validation avancée des variables d'environnement
 */
export class AdvancedValidator {
  private config: ValidationConfig;

  constructor(config: ValidationConfig) {
    this.config = config;
  }

  /**
   * Valide une variable avec toutes les règles configurées
   */
  validate(
    varName: string,
    value: string
  ): { isValid: boolean; errors: string[]; transformedValue?: any } {
    const errors: string[] = [];
    let transformedValue: any = value;

    // Validation regex
    if (this.config.regex?.[varName]) {
      if (!this.config.regex[varName].test(value)) {
        errors.push(
          `Variable ${varName} ne correspond pas au pattern regex: ${this.config.regex[varName]}`
        );
      }
    }

    // Validation de format prédéfini
    if (this.config.format?.[varName]) {
      const format = this.config.format[varName];
      if (!validators[format](value)) {
        errors.push(`Variable ${varName} n'est pas un ${format} valide`);
      }
    }

    // Validation personnalisée
    if (this.config.custom?.[varName]) {
      if (!this.config.custom[varName](value)) {
        errors.push(
          `Variable ${varName} ne passe pas la validation personnalisée`
        );
      }
    }

    // Validation de plage pour les nombres
    if (this.config.numberRange?.[varName]) {
      const numValue = Number(value);
      if (isNaN(numValue)) {
        errors.push(`Variable ${varName} n'est pas un nombre valide`);
      } else {
        const range = this.config.numberRange[varName];
        if (range.min !== undefined && numValue < range.min) {
          errors.push(`Variable ${varName} doit être >= ${range.min}`);
        }
        if (range.max !== undefined && numValue > range.max) {
          errors.push(`Variable ${varName} doit être <= ${range.max}`);
        }
      }
    }

    // Transformation
    if (this.config.transform?.[varName]) {
      try {
        transformedValue = this.config.transform[varName](value);
      } catch (error) {
        errors.push(`Erreur lors de la transformation de ${varName}: ${error}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      transformedValue,
    };
  }

  /**
   * Valide toutes les variables d'un objet
   */
  validateAll(vars: Record<string, string>): {
    isValid: boolean;
    errors: string[];
    transformedVars: Record<string, any>;
  } {
    const allErrors: string[] = [];
    const transformedVars: Record<string, any> = {};

    for (const [varName, value] of Object.entries(vars)) {
      const result = this.validate(varName, value);
      allErrors.push(...result.errors);
      transformedVars[varName] = result.transformedValue;
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
      transformedVars,
    };
  }
}

/**
 * Fonction utilitaire pour créer une configuration de validation rapide
 */
export function createValidationConfig(
  config: Partial<ValidationConfig>
): ValidationConfig {
  return {
    regex: config.regex || {},
    custom: config.custom || {},
    transform: config.transform || {},
    numberRange: config.numberRange || {},
    format: config.format || {},
  };
}
