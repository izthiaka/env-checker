// Exemple d'utilisation avancée avec gestion d'erreurs personnalisée
import {
  EnvChecker,
  getEnvVar,
  getEnvNumber,
  getEnvBoolean,
} from "@izthiaka/env-checker";

// Configuration personnalisée avec gestion d'erreurs
class AppConfig {
  private envChecker: EnvChecker;

  constructor() {
    this.envChecker = new EnvChecker({
      requiredVars: [
        "DATABASE_URL",
        "JWT_SECRET",
        "PORT",
        "NODE_ENV",
        "REDIS_URL",
        "SMTP_HOST",
        "SMTP_PORT",
        "SMTP_USER",
        "SMTP_PASS",
      ],
      optionalVars: [
        "DEBUG",
        "LOG_LEVEL",
        "CORS_ORIGIN",
        "RATE_LIMIT_WINDOW_MS",
        "RATE_LIMIT_MAX_REQUESTS",
      ],
      envFile: ".env",
      strict: false,
      errorPrefix: "[APP-CONFIG]",
    });

    this.validateEnvironment();
  }

  private validateEnvironment(): void {
    const result = this.envChecker.check();

    if (!result.isValid) {
      console.error("❌ Configuration invalide:");
      result.errors.forEach((error) => console.error(`  - ${error}`));

      // Envoyer une notification (Slack, email, etc.)
      this.notifyErrors(result.errors);

      process.exit(1);
    }

    console.log("✅ Configuration valide");
    this.envChecker.printSummary();
  }

  private notifyErrors(errors: string[]): void {
    // Exemple: envoyer une notification Slack
    const message = `🚨 Variables d'environnement manquantes:\n${errors.join(
      "\n"
    )}`;
    console.log("📧 Notification envoyée:", message);

    // Ici vous pourriez intégrer avec Slack, Discord, email, etc.
    // await this.sendSlackNotification(message);
  }

  // Getters pour les variables d'environnement avec types
  get database() {
    return {
      url: this.envChecker.getVar("DATABASE_URL")!,
    };
  }

  get jwt() {
    return {
      secret: this.envChecker.getVar("JWT_SECRET")!,
    };
  }

  get server() {
    return {
      port: this.envChecker.getNumber("PORT", 3000)!,
      nodeEnv: this.envChecker.getVar("NODE_ENV")!,
    };
  }

  get redis() {
    return {
      url: this.envChecker.getVar("REDIS_URL")!,
    };
  }

  get smtp() {
    return {
      host: this.envChecker.getVar("SMTP_HOST")!,
      port: this.envChecker.getNumber("SMTP_PORT", 587)!,
      user: this.envChecker.getVar("SMTP_USER")!,
      pass: this.envChecker.getVar("SMTP_PASS")!,
    };
  }

  get features() {
    return {
      debug: this.envChecker.getBoolean("DEBUG", false),
      logLevel: this.envChecker.getVar("LOG_LEVEL", "info"),
      corsOrigin: this.envChecker.getVar("CORS_ORIGIN", "*"),
    };
  }

  get rateLimit() {
    return {
      windowMs: this.envChecker.getNumber("RATE_LIMIT_WINDOW_MS", 900000), // 15 minutes
      maxRequests: this.envChecker.getNumber("RATE_LIMIT_MAX_REQUESTS", 100),
    };
  }
}

// Utilisation
const config = new AppConfig();

export default config;

// Exemple d'utilisation dans une application Express
import express from "express";

const app = express();

// Middleware pour vérifier les variables d'environnement
app.use((req, res, next) => {
  // Vérification rapide avec les fonctions utilitaires
  const apiKey = getEnvVar("API_KEY");
  const debug = getEnvBoolean("DEBUG", false);

  if (debug) {
    console.log("🔍 Mode debug activé");
  }

  next();
});

app.listen(config.server.port, () => {
  console.log(`🚀 Serveur démarré sur le port ${config.server.port}`);
  console.log(`📊 Environnement: ${config.server.nodeEnv}`);
  console.log(`🐛 Debug: ${config.features.debug}`);
});
