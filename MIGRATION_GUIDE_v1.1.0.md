# 🔄 Guide de migration v1.0.0 → v1.1.0

## ✅ Rétrocompatibilité

**Bonne nouvelle !** La version 1.1.0 est **100% rétrocompatible** avec la version 1.0.0. Toutes vos configurations existantes continueront de fonctionner sans modification.

## 🚀 Nouvelles fonctionnalités disponibles

### 1. Validation avancée (optionnelle)

#### Avant (v1.0.0)
```typescript
import { EnvChecker } from "env-checker-thiaka";

const checker = new EnvChecker({
  requiredVars: ["DATABASE_URL", "PORT"],
  optionalVars: ["DEBUG"],
});
```

#### Après (v1.1.0) - Optionnel
```typescript
import { EnvChecker, validators, transformers, createValidationConfig } from "env-checker-thiaka";

const checker = new EnvChecker({
  requiredVars: ["DATABASE_URL", "PORT"],
  optionalVars: ["DEBUG"],
  // Nouvelles fonctionnalités optionnelles
  validation: createValidationConfig({
    format: {
      DATABASE_URL: "url",
    },
    numberRange: {
      PORT: { min: 1, max: 65535 },
    },
    transform: {
      DEBUG: transformers.toBoolean,
    },
  }),
});
```

### 2. Variables transformées

#### Avant (v1.0.0)
```typescript
const result = checker.check();
const debug = checker.getBoolean("DEBUG", false);
```

#### Après (v1.1.0) - Optionnel
```typescript
const result = checker.check();
// Ancienne méthode (toujours disponible)
const debug = checker.getBoolean("DEBUG", false);
// Nouvelle méthode avec transformation automatique
const debug = result.transformedVars.DEBUG; // boolean
```

### 3. CLI (nouvelle fonctionnalité)

#### Installation globale
```bash
npm install -g env-checker-thiaka
```

#### Utilisation
```bash
# Valider une variable
env-checker validate EMAIL test@example.com --format email

# Vérifier toutes les variables
env-checker check --required DATABASE_URL,PORT --strict

# Détecter les fichiers .env
env-checker detect
```

## 📋 Plan de migration recommandé

### Phase 1 : Mise à jour simple
1. Mettre à jour le package :
   ```bash
   npm install env-checker-thiaka@1.1.0
   ```
2. Vérifier que tout fonctionne (aucun changement requis)

### Phase 2 : Adoption progressive (optionnel)
1. **Ajouter la validation de format** pour les URLs et emails :
   ```typescript
   validation: {
     format: {
       DATABASE_URL: "url",
       ADMIN_EMAIL: "email",
     }
   }
   ```

2. **Ajouter la validation de plage** pour les nombres :
   ```typescript
   validation: {
     numberRange: {
       PORT: { min: 1, max: 65535 },
       TIMEOUT: { min: 1000, max: 30000 },
     }
   }
   ```

3. **Ajouter la transformation** pour les booléens :
   ```typescript
   validation: {
     transform: {
       DEBUG: transformers.toBoolean,
       ENABLE_FEATURE: transformers.toBoolean,
     }
   }
   ```

### Phase 3 : Migration complète (optionnel)
1. **Utiliser les variables transformées** :
   ```typescript
   const result = checker.check();
   const config = {
     debug: result.transformedVars.DEBUG,
     port: result.transformedVars.PORT,
     // ...
   };
   ```

2. **Ajouter la validation personnalisée** :
   ```typescript
   validation: {
     custom: {
       LOG_LEVEL: (value: string) => {
         const validLevels = ["error", "warn", "info", "debug"];
         return validLevels.includes(value.toLowerCase());
       },
     }
   }
   ```

## 🔍 Exemples de migration par cas d'usage

### Cas 1 : Application NestJS simple

#### Avant
```typescript
// src/main.ts
import { checkEnv } from "env-checker-thiaka";

checkEnv({
  requiredVars: ["DATABASE_URL", "JWT_SECRET", "PORT"],
  optionalVars: ["DEBUG"],
});
```

#### Après (avec améliorations)
```typescript
// src/main.ts
import { EnvChecker, validators, transformers, createValidationConfig } from "env-checker-thiaka";

const checker = new EnvChecker({
  requiredVars: ["DATABASE_URL", "JWT_SECRET", "PORT"],
  optionalVars: ["DEBUG"],
  validation: createValidationConfig({
    format: {
      DATABASE_URL: "url",
    },
    numberRange: {
      PORT: { min: 1, max: 65535 },
    },
    transform: {
      DEBUG: transformers.toBoolean,
    },
  }),
});

const result = checker.check();
if (!result.isValid) {
  console.error("Configuration invalide:", result.validationErrors);
  process.exit(1);
}

// Utiliser les variables transformées
const config = {
  database: { url: result.transformedVars.DATABASE_URL },
  jwt: { secret: result.transformedVars.JWT_SECRET },
  server: { port: result.transformedVars.PORT },
  debug: result.transformedVars.DEBUG,
};
```

### Cas 2 : Application Next.js

#### Avant
```typescript
// next.config.js
const { checkEnv } = require("env-checker-thiaka");

checkEnv({
  requiredVars: ["NEXT_PUBLIC_API_URL", "DATABASE_URL"],
  optionalVars: ["NEXT_PUBLIC_DEBUG"],
});
```

#### Après (avec améliorations)
```typescript
// next.config.js
const { EnvChecker, validators, transformers, createValidationConfig } = require("env-checker-thiaka");

const checker = new EnvChecker({
  requiredVars: ["NEXT_PUBLIC_API_URL", "DATABASE_URL"],
  optionalVars: ["NEXT_PUBLIC_DEBUG"],
  validation: createValidationConfig({
    format: {
      NEXT_PUBLIC_API_URL: "url",
      DATABASE_URL: "url",
    },
    transform: {
      NEXT_PUBLIC_DEBUG: transformers.toBoolean,
    },
  }),
});

const result = checker.check();
if (!result.isValid) {
  console.error("Configuration invalide:", result.validationErrors);
  process.exit(1);
}
```

## ⚠️ Points d'attention

### 1. Types TypeScript
Si vous utilisez TypeScript, vous devrez peut-être mettre à jour vos types :

```typescript
// Avant
interface EnvCheckResult {
  isValid: boolean;
  missingVars: string[];
  // ...
}

// Après
interface EnvCheckResult {
  isValid: boolean;
  missingVars: string[];
  validationErrors: string[]; // Nouveau
  transformedVars: Record<string, any>; // Nouveau
  // ...
}
```

### 2. Gestion d'erreurs
Les nouvelles erreurs de validation sont disponibles dans `result.validationErrors` :

```typescript
const result = checker.check();
if (!result.isValid) {
  // Erreurs de variables manquantes
  if (result.errors.length > 0) {
    console.error("Variables manquantes:", result.errors);
  }
  
  // Nouvelles erreurs de validation
  if (result.validationErrors.length > 0) {
    console.error("Erreurs de validation:", result.validationErrors);
  }
}
```

## 🆘 Support

Si vous rencontrez des problèmes lors de la migration :

1. **Vérifiez la documentation** : [README.md](README.md)
2. **Consultez les exemples** : [examples/](examples/)
3. **Ouvrez une issue** : [GitHub Issues](https://github.com/izthiaka/env-checker/issues)
4. **Testez d'abord** : Utilisez la CLI pour valider vos configurations

## 🎉 Conclusion

La migration vers v1.1.0 est **facile et progressive**. Vous pouvez :

- ✅ **Rester sur l'ancienne API** (100% compatible)
- ✅ **Adopter progressivement** les nouvelles fonctionnalités
- ✅ **Migrer complètement** quand vous êtes prêt

Les nouvelles fonctionnalités vous permettront d'avoir une validation plus robuste et des configurations plus sûres !
