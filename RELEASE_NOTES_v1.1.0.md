# 🚀 Release v1.1.0 - Validation avancée et CLI

## ✨ Nouvelles fonctionnalités majeures

### 🔍 Validation avancée
- **Validation regex** : Support des patterns regex personnalisés pour les variables
- **Validation de format prédéfini** : email, url, uuid, date, json, port, ip, semver, hex, base64
- **Validation de plage numérique** : min/max pour les nombres
- **Validation personnalisée** : Fonctions de validation custom pour des cas spécifiques

### 🔄 Transformation des valeurs
- **Transformateurs prédéfinis** : toBoolean, toNumber, toArray, toObject, toLowerCase, toUpperCase, trim
- **Variables transformées** : Accès aux valeurs transformées via `getTransformedVar()` et `getAllTransformedVars()`
- **Transformation automatique** : Appliquée lors de la validation

### 🛠️ CLI complète
- **`env-checker check`** : Validation des variables d'environnement en ligne de commande
- **`env-checker validate`** : Validation d'une variable spécifique avec options
- **`env-checker detect`** : Détection automatique des fichiers .env disponibles
- **`env-checker example`** : Génération d'exemples de configuration pour différents frameworks

### 📚 Nouvelles API
- **`AdvancedValidator`** : Classe pour la validation avancée avec règles complexes
- **`validators`** : Objet avec des validateurs prédéfinis (email, url, uuid, etc.)
- **`transformers`** : Objet avec des transformateurs prédéfinis
- **`createValidationConfig()`** : Fonction utilitaire pour créer des configurations de validation
- **`validateVar()`** : Méthode pour valider une variable spécifique
- **`getTransformedVar()`** : Méthode pour obtenir une variable transformée
- **`getAllTransformedVars()`** : Méthode pour obtenir toutes les variables transformées

## 🎯 Exemples d'utilisation

### Validation avancée
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

### CLI
```bash
# Valider une variable
env-checker validate EMAIL test@example.com --format email

# Vérifier toutes les variables
env-checker check --required DATABASE_URL,PORT --strict

# Détecter les fichiers .env
env-checker detect
```

## 📊 Statistiques

- **Tests** : 42 tests (100% passent)
- **Nouveaux fichiers** : 5 fichiers ajoutés
- **Lignes de code** : +1017 lignes ajoutées
- **Fonctionnalités** : 6 nouvelles fonctionnalités majeures

## 🔧 Améliorations

- **Interface `EnvCheckResult`** : Ajout de `validationErrors` et `transformedVars`
- **Interface `EnvCheckerOptions`** : Ajout de `validation` pour la configuration avancée
- **Gestion d'erreurs** : Messages d'erreur plus détaillés et informatifs
- **Performance** : Validation optimisée avec cache des résultats

## 📖 Documentation

- **README mis à jour** avec tous les exemples avancés
- **CHANGELOG complet** avec toutes les modifications
- **Exemples avancés** pour différents cas d'usage
- **Documentation CLI** avec aide intégrée

## 🚀 Installation

```bash
npm install env-checker-thiaka@1.1.0
# ou
yarn add env-checker-thiaka@1.1.0
# ou
pnpm add env-checker-thiaka@1.1.0
```

## 🔄 Migration depuis v1.0.0

Cette version est **rétrocompatible** avec v1.0.0. Toutes les fonctionnalités existantes continuent de fonctionner. Les nouvelles fonctionnalités sont optionnelles et peuvent être ajoutées progressivement.

## 🎉 Merci !

Merci à tous les utilisateurs qui ont contribué à cette version ! Vos retours et suggestions ont été précieux pour améliorer le package.

---

**Auteur** : Ismaila T. BADJI ([@izthiaka](https://github.com/izthiaka))  
**Package** : [env-checker-thiaka](https://www.npmjs.com/package/env-checker-thiaka)  
**Repository** : [GitHub](https://github.com/izthiaka/env-checker)
