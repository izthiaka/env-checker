# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.1.0] - 2024-01-XX

### ✨ Ajouté

#### 🔍 Validation avancée
- **Validation regex** : Support des patterns regex personnalisés pour les variables
- **Validation de format prédéfini** : email, url, uuid, date, json, port, ip, semver, hex, base64
- **Validation de plage numérique** : min/max pour les nombres
- **Validation personnalisée** : Fonctions de validation custom pour des cas spécifiques

#### 🔄 Transformation des valeurs
- **Transformateurs prédéfinis** : toBoolean, toNumber, toArray, toObject, toLowerCase, toUpperCase, trim
- **Variables transformées** : Accès aux valeurs transformées via `getTransformedVar()` et `getAllTransformedVars()`
- **Transformation automatique** : Appliquée lors de la validation

#### 🛠️ CLI complète
- **`env-checker check`** : Validation des variables d'environnement en ligne de commande
- **`env-checker validate`** : Validation d'une variable spécifique avec options
- **`env-checker detect`** : Détection automatique des fichiers .env disponibles
- **`env-checker example`** : Génération d'exemples de configuration pour différents frameworks

#### 📚 Nouvelles API
- **`AdvancedValidator`** : Classe pour la validation avancée avec règles complexes
- **`validators`** : Objet avec des validateurs prédéfinis (email, url, uuid, etc.)
- **`transformers`** : Objet avec des transformateurs prédéfinis
- **`createValidationConfig()`** : Fonction utilitaire pour créer des configurations de validation
- **`validateVar()`** : Méthode pour valider une variable spécifique
- **`getTransformedVar()`** : Méthode pour obtenir une variable transformée
- **`getAllTransformedVars()`** : Méthode pour obtenir toutes les variables transformées

#### 📖 Documentation et exemples
- **Exemple avancé** : Configuration complète avec toutes les fonctionnalités
- **Tests complets** : 42 tests couvrant toutes les nouvelles fonctionnalités
- **Documentation CLI** : Aide intégrée et exemples d'utilisation

### 🔧 Amélioré

- **Interface `EnvCheckResult`** : Ajout de `validationErrors` et `transformedVars`
- **Interface `EnvCheckerOptions`** : Ajout de `validation` pour la configuration avancée
- **Gestion d'erreurs** : Messages d'erreur plus détaillés et informatifs
- **Performance** : Validation optimisée avec cache des résultats

### 🎯 Exemples d'utilisation

#### Validation avancée
```typescript
const checker = new EnvChecker({
  requiredVars: ['EMAIL', 'API_KEY', 'PORT'],
  validation: {
    format: { EMAIL: 'email' },
    regex: { API_KEY: /^[A-Za-z0-9]{32}$/ },
    numberRange: { PORT: { min: 1, max: 65535 } },
    transform: { DEBUG: transformers.toBoolean }
  }
});
```

#### CLI
```bash
# Valider une variable
env-checker validate EMAIL test@example.com --format email

# Vérifier toutes les variables
env-checker check --required DATABASE_URL,PORT --strict

# Détecter les fichiers .env
env-checker detect
```

### 📊 Statistiques

- **Tests** : 42 tests (100% passent)
- **Nouveaux fichiers** : 5 fichiers ajoutés
- **Lignes de code** : +1017 lignes ajoutées
- **Fonctionnalités** : 6 nouvelles fonctionnalités majeures

---

## [1.0.0] - 2024-01-XX

### ✨ Ajouté

#### Fonctionnalités de base
- **Validation des variables d'environnement** : Vérification de présence et de validité
- **Support des fichiers .env** : Chargement automatique des fichiers .env
- **Variables requises et optionnelles** : Gestion flexible des variables
- **Mode strict** : Arrêt de l'application en cas de variables manquantes
- **Détection automatique** : Recherche de fichiers .env dans le projet

#### API principale
- **`EnvChecker`** : Classe principale pour la validation
- **`checkEnv()`** : Fonction utilitaire pour validation rapide
- **`getEnvVar()`** : Récupération sécurisée des variables
- **`getEnvNumber()`** : Conversion en nombre avec validation
- **`getEnvBoolean()`** : Conversion en booléen avec validation
- **`loadAllEnvFiles()`** : Chargement de tous les fichiers .env

#### Configuration
- **Support TypeScript** : Types complets et IntelliSense
- **Configuration flexible** : Options personnalisables
- **Messages d'erreur** : Préfixes personnalisables
- **Résumé détaillé** : Affichage des statistiques de validation

#### Tests et qualité
- **Tests unitaires** : Couverture complète avec Jest
- **Linting** : Configuration ESLint pour la qualité du code
- **TypeScript** : Configuration stricte pour la sécurité des types
- **CI/CD** : GitHub Actions pour tests et publication automatique

#### Documentation
- **README complet** : Guide d'installation et d'utilisation
- **Exemples** : Exemples pour NestJS, Next.js et Express
- **Contributing** : Guide pour les contributeurs
- **Issue templates** : Templates pour les bugs et demandes de fonctionnalités

### 📊 Statistiques initiales

- **Tests** : 36 tests
- **Fichiers** : 15 fichiers
- **Lignes de code** : ~800 lignes
- **Fonctionnalités** : 8 fonctionnalités de base