# 🤝 Guide de contribution

Merci de votre intérêt à contribuer à `env-checker-thiaka` ! Ce document vous guidera à travers le processus de contribution.

## 📋 Table des matières

- [Code de conduite](#code-de-conduite)
- [Comment contribuer](#comment-contribuer)
- [Processus de développement](#processus-de-développement)
- [Standards de code](#standards-de-code)
- [Tests](#tests)
- [Documentation](#documentation)
- [Processus de soumission](#processus-de-soumission)

## 📜 Code de conduite

Ce projet adhère au [Code de conduite du contributeur](https://www.contributor-covenant.org/). En participant, vous acceptez de respecter ce code.

## 🚀 Comment contribuer

### Types de contributions

- 🐛 **Signaler des bugs**
- ✨ **Proposer de nouvelles fonctionnalités**
- 📚 **Améliorer la documentation**
- 🧪 **Ajouter des tests**
- 🔧 **Corriger des bugs**
- ⚡ **Optimiser les performances**

### Avant de commencer

1. **Vérifiez les issues existantes** pour éviter les doublons
2. **Créez une issue** pour discuter des changements majeurs
3. **Fork le repository** sur GitHub
4. **Clone votre fork** localement

## 🔧 Processus de développement

### Configuration de l'environnement

```bash
# Cloner votre fork
git clone https://github.com/VOTRE_USERNAME/env-checker.git
cd env-checker

# Installer les dépendances
npm install

# Lancer les tests
npm test

# Lancer le linting
npm run lint

# Build le projet
npm run build
```

### Workflow Git

1. **Créer une branche** pour votre fonctionnalité :
   ```bash
   git checkout -b feature/nom-de-votre-fonctionnalite
   ```

2. **Faire vos modifications** en suivant les standards de code

3. **Tester vos changements** :
   ```bash
   npm test
   npm run lint
   npm run build
   ```

4. **Commiter vos changements** :
   ```bash
   git add .
   git commit -m "feat: ajouter nouvelle fonctionnalité"
   ```

5. **Pousser vers votre fork** :
   ```bash
   git push origin feature/nom-de-votre-fonctionnalite
   ```

6. **Créer une Pull Request** sur GitHub

## 📏 Standards de code

### TypeScript

- Utilisez TypeScript strict
- Ajoutez des types explicites quand nécessaire
- Suivez les conventions de nommage camelCase
- Documentez les fonctions publiques avec JSDoc

### ESLint

- Respectez les règles ESLint configurées
- Utilisez `npm run lint:fix` pour corriger automatiquement

### Formatage

- Utilisez des guillemets doubles (`"`) pour les chaînes
- Indentation de 2 espaces
- Point-virgule obligatoire
- Lignes vides pour séparer les sections logiques

## 🧪 Tests

### Écrire des tests

- Ajoutez des tests pour toute nouvelle fonctionnalité
- Maintenez une couverture de code élevée
- Utilisez des noms de tests descriptifs en français
- Testez les cas limites et les erreurs

### Structure des tests

```typescript
describe('NomDeLaClasse', () => {
  describe('nomDeLaMéthode', () => {
    it('devrait faire quelque chose de spécifique', () => {
      // Arrange
      const input = 'test';
      
      // Act
      const result = functionToTest(input);
      
      // Assert
      expect(result).toBe('expected');
    });
  });
});
```

### Lancer les tests

```bash
# Tests une fois
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

## 📚 Documentation

### README

- Mettez à jour le README si vous ajoutez des fonctionnalités
- Ajoutez des exemples d'utilisation
- Vérifiez que tous les liens fonctionnent

### JSDoc

```typescript
/**
 * Valide les variables d'environnement
 * @param options - Options de configuration
 * @returns Résultat de la validation
 * @example
 * ```typescript
 * const result = checkEnv({
 *   requiredVars: ['DATABASE_URL']
 * });
 * ```
 */
export function checkEnv(options: EnvCheckerOptions): EnvCheckResult
```

### Changelog

- Ajoutez vos changements au CHANGELOG.md
- Suivez le format [Keep a Changelog](https://keepachangelog.com/)

## 📤 Processus de soumission

### Pull Request

1. **Titre descriptif** : Utilisez un titre clair et concis
2. **Description détaillée** : Expliquez ce que fait votre PR
3. **Référencez les issues** : Utilisez `Fixes #123` ou `Closes #123`
4. **Ajoutez des captures d'écran** si applicable

### Template de PR

```markdown
## 📝 Description

Brève description des changements.

## 🔄 Type de changement

- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## ✅ Checklist

- [ ] J'ai testé mes changements
- [ ] J'ai mis à jour la documentation
- [ ] J'ai ajouté des tests
- [ ] Les tests passent
- [ ] Le linting passe
- [ ] J'ai mis à jour le CHANGELOG

## 📸 Captures d'écran

Si applicable, ajoutez des captures d'écran.

## 🔗 Issues liées

Fixes #123
```

## 🏷️ Convention de commits

Utilisez le format [Conventional Commits](https://www.conventionalcommits.org/) :

```
type(scope): description

feat: ajouter nouvelle fonctionnalité
fix: corriger bug
docs: mise à jour documentation
style: formatage du code
refactor: refactoring
test: ajouter tests
chore: tâches de maintenance
```

## 🎯 Processus de review

1. **Maintainer assigne des reviewers**
2. **Reviewers examinent le code**
3. **Feedback et modifications** si nécessaire
4. **Approbation et merge** une fois satisfait

## 🆘 Besoin d'aide ?

- 📧 **Email** : thiaka.badji@gmail.com
- 💬 **Issues** : Créez une issue sur GitHub
- 📖 **Documentation** : Consultez le README

## 🙏 Remerciements

Merci à tous les contributeurs qui rendent ce projet meilleur !

---

**Merci de contribuer à env-checker-thiaka !** 🎉
