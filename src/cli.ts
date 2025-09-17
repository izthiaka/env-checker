#!/usr/bin/env node

import { Command } from "commander";
import {
  EnvChecker,
  validators,
  transformers,
  createValidationConfig,
} from "./index";
import { existsSync } from "fs";
import { join } from "path";

const program = new Command();

program
  .name("env-checker")
  .description("CLI pour valider les variables d'environnement")
  .version("1.0.0");

program
  .command("check")
  .description("Vérifier les variables d'environnement")
  .option("-f, --file <file>", "Fichier .env à utiliser", ".env")
  .option(
    "-r, --required <vars>",
    "Variables requises (séparées par des virgules)"
  )
  .option(
    "-o, --optional <vars>",
    "Variables optionnelles (séparées par des virgules)"
  )
  .option("-s, --strict", "Mode strict (arrêter en cas d'erreur)")
  .option("-v, --verbose", "Affichage détaillé")
  .action((options) => {
    const requiredVars = options.required ? options.required.split(",") : [];
    const optionalVars = options.optional ? options.optional.split(",") : [];

    const checker = new EnvChecker({
      envFile: options.file,
      requiredVars,
      optionalVars,
      strict: options.strict,
      loadEnvFile: true,
    });

    const result = checker.check();

    if (options.verbose) {
      checker.printSummary();
    }

    if (!result.isValid) {
      console.error("❌ Validation échouée");
      if (result.errors.length > 0) {
        console.error("Erreurs:", result.errors.join("\n"));
      }
      if (result.validationErrors.length > 0) {
        console.error(
          "Erreurs de validation:",
          result.validationErrors.join("\n")
        );
      }
      process.exit(1);
    } else {
      console.log("✅ Toutes les variables sont valides");
      if (options.verbose) {
        console.log("Variables transformées:", result.transformedVars);
      }
    }
  });

program
  .command("validate")
  .description("Valider une variable spécifique")
  .argument("<varName>", "Nom de la variable")
  .argument("<value>", "Valeur à valider")
  .option(
    "-f, --format <format>",
    "Format de validation (email, url, uuid, date, json, port, ip, semver, hex, base64)"
  )
  .option("-r, --regex <pattern>", "Pattern regex personnalisé")
  .option(
    "-t, --transform <transform>",
    "Transformation à appliquer (lowerCase, upperCase, trim, toNumber, toBoolean, toArray, toObject)"
  )
  .action((varName, value, options) => {
    const validationConfig = createValidationConfig({
      format: options.format ? { [varName]: options.format } : undefined,
      regex: options.regex
        ? { [varName]: new RegExp(options.regex) }
        : undefined,
      transform: options.transform
        ? { [varName]: (transformers as any)[options.transform] }
        : undefined,
    });

    const checker = new EnvChecker({
      requiredVars: [],
      validation: validationConfig,
    });

    const result = checker.validateVar(varName, value);

    if (result.isValid) {
      console.log("✅ Variable valide");
      console.log(`Valeur originale: ${value}`);
      if (result.transformedValue !== value) {
        console.log(`Valeur transformée: ${result.transformedValue}`);
      }
    } else {
      console.error("❌ Variable invalide");
      console.error("Erreurs:", result.errors.join("\n"));
      process.exit(1);
    }
  });

program
  .command("detect")
  .description("Détecter les fichiers .env disponibles")
  .action(() => {
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

    const foundFiles = envFiles.filter((file) =>
      existsSync(join(process.cwd(), file))
    );

    if (foundFiles.length > 0) {
      console.log("📁 Fichiers .env détectés:");
      foundFiles.forEach((file) => console.log(`  - ${file}`));
    } else {
      console.log("❌ Aucun fichier .env trouvé");
    }
  });

program
  .command("example")
  .description("Générer un exemple de configuration")
  .option(
    "-t, --type <type>",
    "Type d'exemple (nestjs, nextjs, express)",
    "nestjs"
  )
  .action((options) => {
    const examples = {
      nestjs: `
// Exemple pour NestJS
import { EnvChecker, validators, transformers } from 'env-checker-thiaka';

const checker = new EnvChecker({
  requiredVars: ['DATABASE_URL', 'JWT_SECRET', 'PORT'],
  optionalVars: ['DEBUG', 'LOG_LEVEL'],
  validation: {
    format: {
      DATABASE_URL: 'url',
      JWT_SECRET: 'hex',
    },
    numberRange: {
      PORT: { min: 1, max: 65535 },
    },
    transform: {
      DEBUG: transformers.toBoolean,
      LOG_LEVEL: transformers.toLowerCase,
    },
  },
});

const result = checker.check();
if (!result.isValid) {
  console.error('Configuration invalide:', result.validationErrors);
  process.exit(1);
}

const config = {
  database: { url: result.transformedVars.DATABASE_URL },
  jwt: { secret: result.transformedVars.JWT_SECRET },
  server: { port: result.transformedVars.PORT },
  debug: result.transformedVars.DEBUG,
  logLevel: result.transformedVars.LOG_LEVEL,
};
      `,
      nextjs: `
// Exemple pour Next.js
const { EnvChecker, validators, transformers } = require('env-checker-thiaka');

const checker = new EnvChecker({
  requiredVars: ['NEXT_PUBLIC_API_URL', 'DATABASE_URL'],
  optionalVars: ['NEXT_PUBLIC_DEBUG'],
  validation: {
    format: {
      NEXT_PUBLIC_API_URL: 'url',
      DATABASE_URL: 'url',
    },
    transform: {
      NEXT_PUBLIC_DEBUG: transformers.toBoolean,
    },
  },
});

const result = checker.check();
if (!result.isValid) {
  console.error('Configuration invalide:', result.validationErrors);
  process.exit(1);
}
      `,
      express: `
// Exemple pour Express
import { EnvChecker, validators, transformers } from 'env-checker-thiaka';

const checker = new EnvChecker({
  requiredVars: ['PORT', 'NODE_ENV'],
  optionalVars: ['CORS_ORIGIN', 'RATE_LIMIT'],
  validation: {
    numberRange: {
      PORT: { min: 1, max: 65535 },
    },
    format: {
      NODE_ENV: 'semver',
    },
    transform: {
      CORS_ORIGIN: transformers.toArray,
      RATE_LIMIT: transformers.toNumber,
    },
  },
});

const result = checker.check();
if (!result.isValid) {
  console.error('Configuration invalide:', result.validationErrors);
  process.exit(1);
}
      `,
    };

    console.log((examples as any)[options.type] || examples.nestjs);
  });

program.parse();
