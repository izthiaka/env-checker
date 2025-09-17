// Exemple d'utilisation basique avec NestJS
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { checkEnvStrict, EnvChecker } from "@izthiaka/env-checker";

async function bootstrap() {
  // Vérification stricte des variables d'environnement
  checkEnvStrict({
    requiredVars: [
      "DATABASE_URL",
      "JWT_SECRET",
      "PORT",
      "NODE_ENV",
      "REDIS_URL",
    ],
    optionalVars: ["DEBUG", "LOG_LEVEL", "CORS_ORIGIN"],
    envFile: ".env",
  });

  // Configuration avancée avec la classe EnvChecker
  const envChecker = new EnvChecker({
    requiredVars: ["DATABASE_URL", "JWT_SECRET"],
    optionalVars: ["DEBUG"],
    strict: false,
    errorPrefix: "[NESTJS-APP]",
  });

  const result = envChecker.check();

  if (!result.isValid) {
    console.error("Variables d'environnement manquantes:", result.missingVars);
    process.exit(1);
  }

  // Obtenir les variables avec types
  const config = {
    database: {
      url: envChecker.getVar("DATABASE_URL")!,
    },
    jwt: {
      secret: envChecker.getVar("JWT_SECRET")!,
    },
    server: {
      port: envChecker.getNumber("PORT", 3000)!,
    },
    debug: envChecker.getBoolean("DEBUG", false),
  };

  console.log("Configuration chargée:", config);

  const app = await NestFactory.create(AppModule);
  await app.listen(config.server.port);

  console.log(`Application démarrée sur le port ${config.server.port}`);
}

bootstrap().catch((error) => {
  console.error("Erreur lors du démarrage:", error);
  process.exit(1);
});
