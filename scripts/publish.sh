#!/bin/bash

# Script de publication du package env-checker sur npm

echo "🚀 Publication du package @izthiaka/env-checker sur npm..."

# Vérifier que nous sommes dans le bon répertoire
if [ ! -f "package.json" ]; then
    echo "❌ Erreur: package.json non trouvé. Assurez-vous d'être dans le répertoire du package."
    exit 1
fi

# Vérifier que le build est à jour
echo "🔨 Vérification du build..."
if [ ! -d "dist" ] || [ ! -f "dist/index.js" ]; then
    echo "📦 Build du package..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ Le build a échoué. Arrêt de la publication."
        exit 1
    fi
fi

# Lancer les tests
echo "🧪 Exécution des tests..."
npm test
if [ $? -ne 0 ]; then
    echo "❌ Les tests ont échoué. Arrêt de la publication."
    exit 1
fi

# Linter le code
echo "🔍 Vérification du code..."
npm run lint
if [ $? -ne 0 ]; then
    echo "❌ Le linting a échoué. Arrêt de la publication."
    exit 1
fi

# Vérifier la version
CURRENT_VERSION=$(node -p "require('./package.json').version")
echo "📋 Version actuelle: $CURRENT_VERSION"

# Demander confirmation
read -p "🤔 Voulez-vous publier la version $CURRENT_VERSION ? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Publication annulée."
    exit 1
fi

# Vérifier si l'utilisateur est connecté à npm
echo "🔐 Vérification de la connexion npm..."
npm whoami
if [ $? -ne 0 ]; then
    echo "❌ Vous n'êtes pas connecté à npm. Veuillez vous connecter avec 'npm login'"
    exit 1
fi

# Publier le package
echo "📤 Publication sur npm..."
npm publish

if [ $? -eq 0 ]; then
    echo "✅ Package publié avec succès sur npm!"
    echo "🌐 Vous pouvez le voir sur: https://www.npmjs.com/package/@izthiaka/env-checker"
else
    echo "❌ Erreur lors de la publication."
    exit 1
fi

echo "🎉 Publication terminée!"
