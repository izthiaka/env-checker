# env-checker-thiaka

Un package npm pour valider les variables d'environnement dans les projets Node.js, NestJS et Next.js. Évitez les erreurs de variables d'environnement manquantes avec une validation simple et efficace.

## 🚀 Installation

```bash
npm install env-checker-thiaka
# ou
yarn add env-checker-thiaka
# ou
pnpm add env-checker-thiaka
```

## 📖 Utilisation

### Utilisation basique

```typescript
import { EnvChecker, checkEnv } from "env-checker-thiaka";

// Vérification simple
const result = checkEnv({
  requiredVars: ["DATABASE_URL", "PORT", "JWT_SECRET"],
  optionalVars: ["DEBUG", "LOG_LEVEL"],
});

if (!result.isValid) {
  console.error("Variables d'environnement manquantes:", result.missingVars);
  process.exit(1);
}
```

### Utilisation avec la classe EnvChecker

```typescript
import { EnvChecker } from "@izthiaka/env-checker";

const envChecker = new EnvChecker({
  requiredVars: ["DATABASE_URL", "PORT"],
  optionalVars: ["DEBUG"],
  envFile: ".env.local", // Fichier .env personnalisé
  strict: true, // Arrêter l'exécution si des variables manquent
});

// Vérifier toutes les variables
const result = envChecker.check();

// Obtenir une variable spécifique
const port = envChecker.getNumber("PORT", 3000);
const debug = envChecker.getBoolean("DEBUG", false);
const dbUrl = envChecker.getVar("DATABASE_URL");

// Afficher un résumé
envChecker.printSummary();
```

### Fonctions utilitaires

```typescript
import {
  getEnvVar,
  getEnvNumber,
  getEnvBoolean,
  loadAllEnvFiles,
} from "@izthiaka/env-checker";

// Charger automatiquement tous les fichiers .env
loadAllEnvFiles();

// Obtenir des variables avec types
const port = getEnvNumber("PORT", 3000);
const debug = getEnvBoolean("DEBUG", false);
const apiKey = getEnvVar("API_KEY");
```

## 🔧 Configuration

### Options de EnvChecker

```typescript
interface EnvCheckerOptions {
  /** Chemin vers le fichier .env (par défaut: .env) */
  envFile?: string;
  /** Variables d'environnement requises */
  requiredVars: string[];
  /** Variables d'environnement optionnelles */
  optionalVars?: string[];
  /** Charger automatiquement le fichier .env */
  loadEnvFile?: boolean;
  /** Mode strict (arrêter l'exécution si des variables manquent) */
  strict?: boolean;
  /** Préfixe pour les messages d'erreur */
  errorPrefix?: string;
}
```

### Résultat de vérification

```typescript
interface EnvCheckResult {
  /** Indique si toutes les variables requises sont présentes */
  isValid: boolean;
  /** Variables manquantes */
  missingVars: string[];
  /** Variables présentes */
  presentVars: string[];
  /** Variables optionnelles présentes */
  optionalPresentVars: string[];
  /** Variables optionnelles manquantes */
  optionalMissingVars: string[];
  /** Messages d'erreur */
  errors: string[];
}
```

## 📝 Exemples d'utilisation

### Projet NestJS

```typescript
// src/main.ts
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { checkEnvStrict } from "@izthiaka/env-checker";

async function bootstrap() {
  // Vérifier les variables d'environnement au démarrage
  checkEnvStrict({
    requiredVars: ["DATABASE_URL", "JWT_SECRET", "PORT", "NODE_ENV"],
    optionalVars: ["DEBUG", "LOG_LEVEL"],
  });

  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
```

### Projet Next.js

```typescript
// next.config.js
const { checkEnv } = require("@izthiaka/env-checker");

// Vérifier les variables d'environnement au build
checkEnv({
  requiredVars: ["NEXT_PUBLIC_API_URL", "DATABASE_URL", "NEXTAUTH_SECRET"],
  optionalVars: ["NEXT_PUBLIC_DEBUG"],
});

module.exports = {
  // Configuration Next.js...
};
```

### Configuration avancée

```typescript
import { EnvChecker } from "@izthiaka/env-checker";

const envChecker = new EnvChecker({
  requiredVars: ["DATABASE_URL", "PORT"],
  optionalVars: ["DEBUG", "LOG_LEVEL"],
  envFile: ".env.production",
  strict: false,
  errorPrefix: "[MON-APP]",
});

// Vérification avec gestion d'erreurs personnalisée
const result = envChecker.check();

if (!result.isValid) {
  console.error("Configuration invalide:");
  result.errors.forEach((error) => console.error(`  - ${error}`));

  // Envoyer une notification Slack, par exemple
  // await notifySlack(result.errors);

  process.exit(1);
}

// Utilisation des variables validées
const config = {
  database: {
    url: envChecker.getVar("DATABASE_URL")!,
  },
  server: {
    port: envChecker.getNumber("PORT", 3000)!,
  },
  debug: envChecker.getBoolean("DEBUG", false),
};
```

## 🎯 Fonctionnalités

- ✅ **Validation des variables requises et optionnelles**
- ✅ **Détection automatique des fichiers .env**
- ✅ **Support des types (string, number, boolean)**
- ✅ **Mode strict pour arrêter l'exécution en cas d'erreur**
- ✅ **Messages d'erreur personnalisables**
- ✅ **Support TypeScript complet**
- ✅ **Fonctions utilitaires pour un usage rapide**
- ✅ **Tests unitaires complets**

## 🔍 Détection automatique des fichiers .env

Le package détecte automatiquement les fichiers .env suivants :

- `.env`
- `.env.local`
- `.env.development`
- `.env.development.local`
- `.env.production`
- `.env.production.local`
- `.env.staging`
- `.env.staging.local`
- `.env.test`
- `.env.test.local`

## 🧪 Tests

```bash
npm test
npm run test:watch
```

## 📦 Build

```bash
npm run build
```

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à ouvrir une issue ou une pull request.

## 📄 Licence

MIT

## 👨‍💻 Auteur

**Ismaila T. BADJI** - [@izthiaka](https://github.com/izthiaka)

---

⭐ N'oubliez pas de donner une étoile si ce package vous aide !
