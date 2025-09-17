#!/bin/bash

# Script de build et publication du package env-checker

echo "🚀 Démarrage du build du package env-checker..."

# Nettoyer les anciens builds
echo "🧹 Nettoyage des anciens builds..."
rm -rf dist/
rm -rf node_modules/

# Installer les dépendances
echo "📦 Installation des dépendances..."
npm install

# Lancer les tests
echo "🧪 Exécution des tests..."
npm test

if [ $? -ne 0 ]; then
    echo "❌ Les tests ont échoué. Arrêt du build."
    exit 1
fi

# Linter le code
echo "🔍 Vérification du code avec ESLint..."
npm run lint

if [ $? -ne 0 ]; then
    echo "❌ Le linting a échoué. Arrêt du build."
    exit 1
fi

# Build du projet
echo "🔨 Build du projet TypeScript..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Le build a échoué. Arrêt du processus."
    exit 1
fi

echo "✅ Build terminé avec succès!"
echo "📁 Fichiers générés dans le dossier dist/"

# Optionnel: publier sur npm
if [ "$1" = "--publish" ]; then
    echo "📤 Publication sur npm..."
    npm publish
    echo "✅ Package publié sur npm!"
fi

echo "🎉 Processus terminé!"
