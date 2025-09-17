# Release v1.0.0 - Initial Release

## 🎉 Première version officielle d'env-checker-thiaka

Cette première version apporte une solution complète pour la validation des variables d'environnement dans les projets Node.js, NestJS et Next.js.

## ✨ Nouvelles fonctionnalités

### 🔧 Classe principale EnvChecker

- Validation complète des variables d'environnement requises et optionnelles
- Support des types (string, number, boolean)
- Mode strict pour arrêter l'exécution en cas d'erreur
- Messages d'erreur personnalisables
- Résumé détaillé des variables

### 🛠️ Fonctions utilitaires

- `checkEnv()` - Vérification rapide
- `checkEnvStrict()` - Vérification avec arrêt en cas d'erreur
- `getEnvVar()` - Obtenir une variable avec validation
- `getEnvNumber()` - Obtenir une variable numérique
- `getEnvBoolean()` - Obtenir une variable booléenne
- `detectEnvFiles()` - Détection automatique des fichiers .env
- `loadAllEnvFiles()` - Chargement automatique de tous les fichiers .env

### 🔍 Détection automatique des fichiers .env

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

## 🧪 Qualité et tests

- **16 tests unitaires** complets qui passent tous
- **Support TypeScript** avec types et interfaces
- **Configuration ESLint** pour la qualité du code
- **Configuration Jest** pour les tests
- **Couverture de code** complète

## 📚 Documentation

- **README complet** avec exemples d'utilisation
- **Exemples pratiques** pour NestJS et Next.js
- **Configuration avancée** avec gestion d'erreurs
- **Changelog détaillé**
- **Licence MIT**

## 🎯 Cas d'usage

### Projet NestJS

```typescript
import { checkEnvStrict } from "env-checker-thiaka";

checkEnvStrict({
  requiredVars: ["DATABASE_URL", "JWT_SECRET", "PORT"],
  optionalVars: ["DEBUG", "LOG_LEVEL"],
});
```

### Projet Next.js

```javascript
const { checkEnv } = require("env-checker-thiaka");

checkEnv({
  requiredVars: ["NEXT_PUBLIC_API_URL", "DATABASE_URL"],
  optionalVars: ["NEXT_PUBLIC_DEBUG"],
});
```

## 📦 Installation

```bash
npm install env-checker-thiaka
# ou
yarn add env-checker-thiaka
# ou
pnpm add env-checker-thiaka
```

## 🔗 Liens utiles

- **Package npm** : https://www.npmjs.com/package/env-checker-thiaka
- **Documentation** : https://github.com/izthiaka/env-checker#readme
- **Issues** : https://github.com/izthiaka/env-checker/issues
- **Discussions** : https://github.com/izthiaka/env-checker/discussions

## 👨‍💻 Auteur

**Ismaila T. BADJI** - [@izthiaka](https://github.com/izthiaka)

---

⭐ N'oubliez pas de donner une étoile si ce package vous aide !
