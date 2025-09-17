# Changelog

Toutes les modifications notables de ce projet seront documentées dans ce fichier.

Le format est basé sur [Keep a Changelog](https://keepachangelog.com/fr/1.0.0/),
et ce projet adhère au [Semantic Versioning](https://semver.org/lang/fr/).

## [1.0.0] - 2024-12-19

### Ajouté

- Classe `EnvChecker` pour valider les variables d'environnement
- Fonction `checkEnv()` pour une vérification rapide
- Fonction `checkEnvStrict()` pour une vérification avec arrêt en cas d'erreur
- Fonctions utilitaires `getEnvVar()`, `getEnvNumber()`, `getEnvBoolean()`
- Détection automatique des fichiers .env avec `detectEnvFiles()`
- Chargement automatique de tous les fichiers .env avec `loadAllEnvFiles()`
- Support des variables requises et optionnelles
- Mode strict pour arrêter l'exécution en cas de variables manquantes
- Messages d'erreur personnalisables
- Support TypeScript complet avec types et interfaces
- Tests unitaires complets (16 tests)
- Documentation complète avec exemples
- Exemples d'utilisation pour NestJS et Next.js
- Configuration ESLint et Jest
- Scripts de build et de publication

### Fonctionnalités

- ✅ Validation des variables d'environnement requises et optionnelles
- ✅ Détection automatique des fichiers .env (.env.local, .env.development, etc.)
- ✅ Support des types (string, number, boolean)
- ✅ Mode strict pour arrêter l'exécution en cas d'erreur
- ✅ Messages d'erreur personnalisables
- ✅ Support TypeScript complet
- ✅ Fonctions utilitaires pour un usage rapide
- ✅ Tests unitaires complets
- ✅ Documentation et exemples d'utilisation

### Détails techniques

- Node.js >= 16.0.0
- TypeScript 5.0+
- Jest pour les tests
- ESLint pour le linting
- Support CommonJS et ES Modules
