# 🔐 Configuration des secrets GitHub Actions

Ce fichier explique comment configurer les secrets nécessaires pour GitHub Actions.

## 📋 Secrets requis

### 1. NPM_TOKEN (Requis pour la publication)

- **Description** : Token d'authentification npm pour publier le package
- **Comment l'obtenir** :
  1. Connectez-vous à [npmjs.com](https://npmjs.com)
  2. Allez dans "Access Tokens" dans votre profil
  3. Créez un "Automation" token
  4. Copiez le token

### 2. SNYK_TOKEN (Optionnel - pour le scan de sécurité)

- **Description** : Token Snyk pour l'analyse de sécurité
- **Comment l'obtenir** :
  1. Créez un compte sur [snyk.io](https://snyk.io)
  2. Allez dans "Account Settings" > "API Token"
  3. Copiez le token

### 3. CODECOV_TOKEN (Optionnel - pour la couverture de code)

- **Description** : Token Codecov pour l'upload de couverture
- **Comment l'obtenir** :
  1. Connectez-vous à [codecov.io](https://codecov.io)
  2. Ajoutez votre repository
  3. Copiez le token depuis les paramètres

## 🔧 Configuration dans GitHub

1. Allez dans votre repository GitHub
2. Cliquez sur "Settings" > "Secrets and variables" > "Actions"
3. Cliquez sur "New repository secret"
4. Ajoutez chaque secret avec son nom et sa valeur

## ✅ Activation des fonctionnalités

Une fois les secrets configurés, décommentez les sections correspondantes dans `.github/workflows/ci.yml` :

```yaml
# Pour Snyk
- name: Run Snyk security scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
  with:
    args: --severity-threshold=high

# Pour Codecov
- name: Upload coverage to Codecov
  if: matrix.node-version == '20.x'
  uses: codecov/codecov-action@v3
  with:
    file: ./coverage/lcov.info
    flags: unittests
    name: codecov-umbrella
```

## 🚨 Sécurité

- ⚠️ **Ne jamais** commiter les tokens dans le code
- ✅ Utilisez toujours les secrets GitHub Actions
- 🔄 Régénérez les tokens régulièrement
- 🗑️ Supprimez les tokens inutilisés
