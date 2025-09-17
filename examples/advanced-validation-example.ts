// Exemple avancé avec validation regex, transformation et validation personnalisée
import {
  EnvChecker,
  validators,
  transformers,
  createValidationConfig,
} from "env-checker-thiaka";

// Configuration avancée avec toutes les nouvelles fonctionnalités
const checker = new EnvChecker({
  requiredVars: [
    "DATABASE_URL",
    "JWT_SECRET",
    "PORT",
    "API_KEY",
    "ADMIN_EMAIL",
    "REDIS_URL",
    "NODE_ENV",
  ],
  optionalVars: [
    "DEBUG",
    "LOG_LEVEL",
    "CORS_ORIGINS",
    "RATE_LIMIT_WINDOW_MS",
    "RATE_LIMIT_MAX_REQUESTS",
    "SENTRY_DSN",
    "FEATURE_FLAGS",
  ],
  validation: createValidationConfig({
    // Validation de format prédéfini
    format: {
      DATABASE_URL: "url",
      ADMIN_EMAIL: "email",
      REDIS_URL: "url",
      SENTRY_DSN: "url",
    },

    // Validation regex personnalisée
    regex: {
      API_KEY: /^[A-Za-z0-9]{32}$/, // Clé API de 32 caractères alphanumériques
      JWT_SECRET: /^[A-Za-z0-9+/]{64}$/, // Secret JWT en base64 de 64 caractères
      NODE_ENV: /^(development|production|staging|test)$/, // Environnements valides
    },

    // Validation de plage pour les nombres
    numberRange: {
      PORT: { min: 1, max: 65535 },
      RATE_LIMIT_WINDOW_MS: { min: 1000, max: 3600000 }, // 1s à 1h
      RATE_LIMIT_MAX_REQUESTS: { min: 1, max: 10000 },
    },

    // Validation personnalisée
    custom: {
      LOG_LEVEL: (value: string) => {
        const validLevels = ["error", "warn", "info", "debug", "trace"];
        return validLevels.includes(value.toLowerCase());
      },
      CORS_ORIGINS: (value: string) => {
        // Vérifier que c'est une liste d'URLs valides séparées par des virgules
        const urls = value.split(",").map((url) => url.trim());
        return urls.every((url) => validators.url(url));
      },
      FEATURE_FLAGS: (value: string) => {
        // Vérifier que c'est un JSON valide avec des booléens
        try {
          const flags = JSON.parse(value);
          return Object.values(flags).every((flag) => typeof flag === "boolean");
        } catch {
          return false;
        }
      },
    },

    // Transformation des valeurs
    transform: {
      DEBUG: transformers.toBoolean,
      LOG_LEVEL: transformers.toLowerCase,
      CORS_ORIGINS: (value: string) => transformers.toArray(value, ","),
      RATE_LIMIT_WINDOW_MS: transformers.toNumber,
      RATE_LIMIT_MAX_REQUESTS: transformers.toNumber,
      FEATURE_FLAGS: transformers.toObject,
      NODE_ENV: transformers.toLowerCase,
    },
  }),
  strict: false,
  errorPrefix: "[APP-CONFIG]",
});

// Vérification avec gestion d'erreurs avancée
const result = checker.check();

if (!result.isValid) {
  console.error("❌ Configuration invalide:");
  
  if (result.errors.length > 0) {
    console.error("Variables manquantes:");
    result.errors.forEach((error) => console.error(`  - ${error}`));
  }
  
  if (result.validationErrors.length > 0) {
    console.error("Erreurs de validation:");
    result.validationErrors.forEach((error) => console.error(`  - ${error}`));
  }
  
  process.exit(1);
}

console.log("✅ Configuration valide");
checker.printSummary();

// Configuration typée avec les variables transformées
const config = {
  database: {
    url: result.transformedVars.DATABASE_URL,
  },
  jwt: {
    secret: result.transformedVars.JWT_SECRET,
  },
  server: {
    port: result.transformedVars.PORT,
    nodeEnv: result.transformedVars.NODE_ENV,
  },
  api: {
    key: result.transformedVars.API_KEY,
  },
  admin: {
    email: result.transformedVars.ADMIN_EMAIL,
  },
  redis: {
    url: result.transformedVars.REDIS_URL,
  },
  features: {
    debug: result.transformedVars.DEBUG,
    logLevel: result.transformedVars.LOG_LEVEL,
    corsOrigins: result.transformedVars.CORS_ORIGINS,
    rateLimit: {
      windowMs: result.transformedVars.RATE_LIMIT_WINDOW_MS || 900000,
      maxRequests: result.transformedVars.RATE_LIMIT_MAX_REQUESTS || 100,
    },
    flags: result.transformedVars.FEATURE_FLAGS || {},
  },
  monitoring: {
    sentryDsn: result.transformedVars.SENTRY_DSN,
  },
};

console.log("🔧 Configuration finale:", JSON.stringify(config, null, 2));

// Exemple d'utilisation dans une application Express
import express from "express";

const app = express();

// Middleware de validation des variables d'environnement
app.use((req, res, next) => {
  // Vérification rapide avec les fonctions utilitaires
  const apiKey = checker.getVar("API_KEY");
  const debug = checker.getBoolean("DEBUG", false);
  
  if (debug) {
    console.log("🔍 Mode debug activé");
    console.log("Request:", req.method, req.path);
  }
  
  next();
});

// Route avec validation des feature flags
app.get("/api/feature/:flag", (req, res) => {
  const { flag } = req.params;
  const featureFlags = checker.getTransformedVar("FEATURE_FLAGS") || {};
  
  if (featureFlags[flag]) {
    res.json({ enabled: true, flag });
  } else {
    res.json({ enabled: false, flag });
  }
});

app.listen(config.server.port, () => {
  console.log(`🚀 Serveur démarré sur le port ${config.server.port}`);
  console.log(`📊 Environnement: ${config.server.nodeEnv}`);
  console.log(`🐛 Debug: ${config.features.debug}`);
  console.log(`📝 Log Level: ${config.features.logLevel}`);
  console.log(`🌐 CORS Origins: ${config.features.corsOrigins?.join(", ")}`);
});

export default config;
