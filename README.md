# env-checker-thiaka

[![npm version](https://badge.fury.io/js/env-checker-thiaka.svg)](https://badge.fury.io/js/env-checker-thiaka)
[![npm downloads](https://img.shields.io/npm/dm/env-checker-thiaka.svg)](https://www.npmjs.com/package/env-checker-thiaka)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/%3C%2F%3E-TypeScript-%230074c1.svg)](http://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D16.0.0-green.svg)](https://nodejs.org/)
[![GitHub stars](https://img.shields.io/github/stars/izthiaka/env-checker.svg)](https://github.com/izthiaka/env-checker/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/izthiaka/env-checker.svg)](https://github.com/izthiaka/env-checker/issues)

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

### 🚀 Validation avancée (Nouveau en v1.1.0)

```typescript
import { EnvChecker, validators, transformers, createValidationConfig } from "env-checker-thiaka";

const checker = new EnvChecker({
  requiredVars: ["EMAIL", "API_KEY", "PORT", "DATABASE_URL"],
  optionalVars: ["DEBUG", "LOG_LEVEL", "CORS_ORIGINS"],
  validation: createValidationConfig({
    // Validation de format prédéfini
    format: {
      EMAIL: "email",
      DATABASE_URL: "url",
    },
    
    // Validation regex personnalisée
    regex: {
      API_KEY: /^[A-Za-z0-9]{32}$/, // Clé API de 32 caractères
    },
    
    // Validation de plage pour les nombres
    numberRange: {
      PORT: { min: 1, max: 65535 },
    },
    
    // Validation personnalisée
    custom: {
      LOG_LEVEL: (value: string) => {
        const validLevels = ["error", "warn", "info", "debug", "trace"];
        return validLevels.includes(value.toLowerCase());
      },
    },
    
    // Transformation des valeurs
    transform: {
      DEBUG: transformers.toBoolean,
      LOG_LEVEL: transformers.toLowerCase,
      CORS_ORIGINS: (value: string) => transformers.toArray(value, ","),
    },
  }),
});

const result = checker.check();
if (!result.isValid) {
  console.error("Erreurs:", result.validationErrors);
  process.exit(1);
}

// Utiliser les variables transformées
const config = {
  email: result.transformedVars.EMAIL,
  apiKey: result.transformedVars.API_KEY,
  port: result.transformedVars.PORT,
  debug: result.transformedVars.DEBUG, // boolean
  logLevel: result.transformedVars.LOG_LEVEL, // lowercase string
  corsOrigins: result.transformedVars.CORS_ORIGINS, // string[]
};
```

### Utilisation avec la classe EnvChecker

```typescript
import { EnvChecker } from "env-checker-thiaka";

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

### 🛠️ CLI (Nouveau en v1.1.0)

```bash
# Installation globale pour utiliser la CLI
npm install -g env-checker-thiaka

# Valider une variable spécifique
env-checker validate EMAIL test@example.com --format email

# Vérifier toutes les variables d'environnement
env-checker check --required DATABASE_URL,PORT --strict

# Détecter les fichiers .env disponibles
env-checker detect

# Générer un exemple de configuration
env-checker example --type nestjs
```

### Fonctions utilitaires

```typescript
import {
  getEnvVar,
  getEnvNumber,
  getEnvBoolean,
  loadAllEnvFiles,
} from "env-checker-thiaka";

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

### Fonctionnalités de base
- ✅ **Validation des variables requises et optionnelles**
- ✅ **Détection automatique des fichiers .env**
- ✅ **Support des types (string, number, boolean)**
- ✅ **Mode strict pour arrêter l'exécution en cas d'erreur**
- ✅ **Messages d'erreur personnalisables**
- ✅ **Support TypeScript complet**
- ✅ **Fonctions utilitaires pour un usage rapide**
- ✅ **Tests unitaires complets**

### Nouvelles fonctionnalités v1.1.0
- 🚀 **Validation avancée avec regex, format et validation personnalisée**
- 🔄 **Transformation automatique des valeurs (toBoolean, toNumber, toArray, etc.)**
- 🛠️ **CLI complète pour validation en ligne de commande**
- 📊 **Validation de plage pour les nombres (min/max)**
- 🎯 **Validateurs prédéfinis (email, url, uuid, port, ip, semver, hex, base64)**
- 🔧 **API étendue avec variables transformées**

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
