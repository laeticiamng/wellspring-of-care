# Guide d'Exécution Autonome des Tests

## 🎯 Objectif
Exécuter les tests Playwright de manière fractionnée et autonome.

---

## ⚡ Méthode Rapide (Tout-en-un)

### Option 1: Script Bash (Recommandé)
```bash
# Rendre le script exécutable
chmod +x tests/run-tests-individually.sh

# Lancer tous les tests en séquence
bash tests/run-tests-individually.sh
```

### Option 2: Commandes NPM
```bash
# Test par test
npm run test:migration:journal
npm run test:migration:sync
npm run test:migration:unlock
npm run test:migration:storage
```

---

## 📋 Étape 1: Prérequis (À faire UNE SEULE FOIS)

### A. Créer l'utilisateur test dans Supabase
1. Ouvrir: https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/sql/new
2. Copier le contenu de `tests/setup-test-user.sql`
3. Exécuter le script SQL
4. Vérifier que l'utilisateur `test@example.com` existe

### B. Démarrer le serveur de dev
```bash
# Terminal 1 (laisser ouvert)
npm run dev
```

---

## 🧪 Étape 2: Exécution Fractionnée

### Test 1: Persistance Journal
```bash
npx playwright test tests/migration.spec.ts -g "should persist journal progress after refresh" --headed
```

**Ce qui est testé:**
- ✅ Connexion utilisateur
- ✅ Création entrée journal
- ✅ Enregistrement XP/niveau
- ✅ Refresh page
- ✅ Vérification persistance

**Attendu:** PASS (test réussit sans erreur)

---

### Test 2: Synchronisation Cross-Device
```bash
npx playwright test tests/migration.spec.ts -g "should persist meditation progress across devices" --headed
```

**Ce qui est testé:**
- ✅ Session méditation device 1
- ✅ Gain XP
- ✅ Ouverture device 2
- ✅ Synchronisation automatique

**Attendu:** PASS

---

### Test 3: Déblocage Items
```bash
npx playwright test tests/migration.spec.ts -g "should unlock items based on level" --headed
```

**Ce qui est testé:**
- ✅ Comptage items verrouillés
- ✅ Génération de mixes
- ✅ Gain XP progressif
- ✅ Déblocage automatique

**Attendu:** PASS

---

### Test 4: Résilience LocalStorage
```bash
npx playwright test tests/migration.spec.ts -g "should not lose data on localStorage clear" --headed
```

**Ce qui est testé:**
- ✅ Session breathwork
- ✅ Clear localStorage
- ✅ Refresh + reconnexion
- ✅ Données restaurées depuis backend

**Attendu:** PASS

---

## 📊 Étape 3: Analyser les Résultats

### Tous les tests PASS ✅
```
✅ Migration validée avec succès
✅ Prêt pour la Phase 4 (Analytics)
```

### Certains tests FAIL ❌
```bash
# Voir les traces détaillées
npx playwright show-trace

# Relancer avec debug
npx playwright test tests/migration.spec.ts --debug

# Voir les screenshots d'échec
ls playwright-report/
```

---

## 🔍 Débogage

### Problème: "Selector not found"
**Solution:** Vérifier que les `data-testid` sont présents dans les composants

### Problème: "Authentication failed"
**Solution:** Re-exécuter `tests/setup-test-user.sql`

### Problème: "Target closed"
**Solution:** Augmenter les timeouts dans `playwright.config.ts`

### Problème: "Connection refused"
**Solution:** Vérifier que `npm run dev` tourne sur `http://localhost:5173`

---

## 📈 Rapport Final

Après exécution, générer le rapport HTML:
```bash
npx playwright show-report
```

Le rapport contient:
- 📊 Statistiques globales
- 🎬 Screenshots d'échec
- 📝 Logs détaillés
- ⏱️ Durée d'exécution

---

## ✅ Checklist Validation

- [ ] Utilisateur test créé dans Supabase
- [ ] Serveur dev démarré (localhost:5173)
- [ ] Test 1 (Journal) PASS
- [ ] Test 2 (Sync) PASS
- [ ] Test 3 (Unlock) PASS
- [ ] Test 4 (Storage) PASS
- [ ] Rapport HTML généré
- [ ] Documentation mise à jour

---

## 🎯 Commande Finale Tout-en-un

```bash
# Tout exécuter d'un coup
bash tests/run-tests-individually.sh && echo "✅ TESTS TERMINÉS"
```

---

**Statut:** 🟢 Prêt pour exécution autonome
