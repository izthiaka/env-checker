---
name: 🐛 Bug Report
about: Signaler un bug dans env-checker-thiaka
title: "[BUG] "
labels: ["bug", "needs-triage"]
assignees: ""
---

## 🐛 Description du bug

Une description claire et concise du bug.

## 🔄 Étapes pour reproduire

1. Aller à '...'
2. Cliquer sur '....'
3. Faire défiler vers '....'
4. Voir l'erreur

## ✅ Comportement attendu

Une description claire et concise de ce qui devrait se passer.

## ❌ Comportement actuel

Une description claire et concise de ce qui se passe actuellement.

## 📸 Captures d'écran

Si applicable, ajoutez des captures d'écran pour aider à expliquer votre problème.

## 🔧 Environnement

- **OS** : [ex. Windows 10, macOS 12.0, Ubuntu 20.04]
- **Node.js version** : [ex. 16.14.0]
- **Package version** : [ex. 1.0.0]
- **Framework** : [ex. NestJS, Next.js, Express]

## 📝 Code d'exemple

```typescript
// Ajoutez votre code ici
import { EnvChecker } from "env-checker-thiaka";

const checker = new EnvChecker({
  requiredVars: ["DATABASE_URL"],
});
```

## 📋 Informations supplémentaires

Ajoutez tout autre contexte concernant le problème ici.

## ✅ Checklist

- [ ] J'ai vérifié que le bug n'a pas déjà été signalé
- [ ] J'ai fourni toutes les informations nécessaires
- [ ] J'ai testé avec la dernière version du package
