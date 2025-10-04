# 🤖 Exécution Autonome des Tests - Mode Ultra-Simple

## 🎯 Une Seule Commande

```bash
bash tests/run-all-autonomous.sh
```

**C'est tout!** Le script fait tout automatiquement:
- ✅ Vérifie/démarre le serveur dev
- ✅ Installe Playwright si nécessaire
- ✅ Exécute les 4 tests séquentiellement
- ✅ Génère le rapport HTML
- ✅ Affiche le résumé complet
- ✅ Nettoie automatiquement

---

## 📋 Prérequis (À faire UNE FOIS)

### 1. Créer l'utilisateur test dans Supabase

**Important:** Cette étape est requise avant la première exécution.

1. Ouvrir: https://supabase.com/dashboard/project/yaincoxihiqdksxgrsrk/sql/new
2. Copier-coller le contenu de `tests/setup-test-user.sql`
3. Cliquer sur "Run"
4. Vérifier le message de succès

**Email:** test@example.com  
**Mot de passe:** password123

---

## 🚀 Exécution

```bash
# Rendre le script exécutable (une seule fois)
chmod +x tests/run-all-autonomous.sh

# Lancer les tests
bash tests/run-all-autonomous.sh
```

---

## 📊 Interprétation des Résultats

### ✅ Tous les tests PASS (4/4)
```
🎉 SUCCÈS TOTAL! Tous les tests sont passés
✅ Migration validée avec succès
✅ Prêt pour la Phase 4 (Analytics)
```

### ⚠️ Certains tests FAIL (< 4/4)
Le script affiche automatiquement:
- Quel(s) test(s) ont échoué
- Un lien vers le rapport HTML détaillé
- Les screenshots d'échec

---

## 🔍 Rapport HTML Interactif

Le rapport HTML s'ouvre automatiquement à la fin:
- 📈 Statistiques globales
- 🎬 Screenshots des échecs
- 📝 Logs détaillés étape par étape
- ⏱️ Durée d'exécution de chaque test

---

## 🎯 Tests Exécutés (4 Scénarios)

### Test 1: Persistance Journal
**Objectif:** Données sauvegardées après refresh  
**Actions:** Connexion → Journal → Refresh → Vérification

### Test 2: Synchronisation Cross-Device
**Objectif:** Sync entre deux navigateurs simulés  
**Actions:** Device 1 (méditation) → Device 2 → Vérification sync

### Test 3: Déblocage Items par Niveau
**Objectif:** Items débloqués selon XP/niveau  
**Actions:** Générer mixes → Monter niveau → Vérifier déblocage

### Test 4: Résilience LocalStorage
**Objectif:** Pas de perte après clear localStorage  
**Actions:** Breathwork → Clear localStorage → Refresh → Vérification

---

## 🔧 Dépannage Rapide

### Erreur: "Connection refused"
```bash
# Démarrer manuellement le serveur dans un autre terminal
npm run dev
```

### Erreur: "Selector not found"
```bash
# Vérifier les data-testid dans les composants
# Les fichiers modifiés: Journal.tsx, Meditation.tsx, Breathwork.tsx, MoodMixer.tsx
```

### Erreur: "Authentication failed"
```bash
# Re-exécuter le script SQL de création d'utilisateur
# Fichier: tests/setup-test-user.sql
```

### Erreur: "Target closed"
```bash
# Augmenter les timeouts dans playwright.config.ts
# Ou relancer simplement le script
```

---

## 📈 Structure des Tests

```
tests/
├── migration.spec.ts          # Les 4 tests E2E
├── setup-test-user.sql        # Création utilisateur test
├── run-tests-individually.sh  # Exécution manuelle test par test
└── run-all-autonomous.sh      # 🤖 SCRIPT AUTONOME (recommandé)
```

---

## ✅ Checklist de Validation Finale

- [ ] Utilisateur test créé dans Supabase
- [ ] Script rendu exécutable (`chmod +x`)
- [ ] Commande lancée: `bash tests/run-all-autonomous.sh`
- [ ] 4/4 tests PASS
- [ ] Rapport HTML généré
- [ ] Documentation mise à jour

---

## 🎯 Statut

**🟢 PRÊT POUR EXÉCUTION AUTONOME**

Une seule commande suffit:
```bash
bash tests/run-all-autonomous.sh
```

---

**Durée estimée:** 2-3 minutes  
**Complexité:** ⭐ Ultra-simple  
**Intervention manuelle:** Zéro (après setup initial)
