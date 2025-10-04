# 📊 Rapport d'Audit des Modules - EmotionsCare

## Date: 2025-01-XX
## Objectif: Évaluer l'état d'intégration de `useModuleProgress` dans tous les modules

---

## ✅ Modules Intégrés avec Backend (5/14)

Ces modules utilisent correctement `useModuleProgress` pour persister les données en base de données:

| Module | Fichier | Status | Notes |
|--------|---------|--------|-------|
| 🎯 Ambition Arcade | `AmbitionArcade.tsx` | ✅ **Intégré** | XP, niveau, missions trackées |
| 💪 Boss Grit | `BossGrit.tsx` | ✅ **Intégré** | XP, trophées, challenges trackés |
| 🎵 Music Therapy | `MusicTherapy.tsx` | ✅ **Intégré** | XP, forêts débloquées, sessions |
| 🫧 Nyvée | `Nyvee.tsx` | ✅ **Intégré** | XP, types de bulles débloqués |
| 🎨 Screen Silk | `ScreenSilk.tsx` | ✅ **Intégré** | XP, types de soie débloqués |

---

## ❌ Modules avec localStorage (8/14) - **À MIGRER**

Ces modules utilisent encore `localStorage` et doivent être migrés vers `useModuleProgress`:

### Priorité HAUTE 🔴

| Module | Fichier | localStorage Keys | Impact |
|--------|---------|-------------------|--------|
| 📝 Journal | `Journal.tsx` | `journal_progress` | Perte de données utilisateur |
| 🎧 Mood Mixer | `MoodMixer.tsx` | `mood_mixer_progress` | Perte de mixes sauvegardés |
| 🧘 Meditation | `Meditation.tsx` | `meditation_xp`, `meditation_level`, `meditation_completed`, `meditation_total_time` | Perte de sessions complétées |
| 🫁 Breathwork | `Breathwork.tsx` | `breathwork_xp`, `breathwork_level`, `breathwork_completed` | Perte de techniques maîtrisées |

### Priorité MOYENNE 🟡

| Module | Fichier | localStorage Keys | Impact |
|--------|---------|-------------------|--------|
| 🪞 AR Filters | `ARFilters.tsx` | `ar_filters_progress` | Perte de filtres débloqués |
| 🏛️ VR Breath | `VRBreath.tsx` | `vr_breath_progress` | Perte de fresques/environnements |
| ⚡ Flash Glow | `FlashGlow.tsx` | `flashglow_progress` | Perte de mantras/intensités |
| 🎭 Emotional Scan | `EmotionalScan.tsx` | `emotional_scan_progress` | Perte de masques collectés |

---

## ⚠️ Module Sans Progression (1/14)

| Module | Fichier | Notes |
|--------|---------|-------|
| 📖 Story Synth | `StorySynth.tsx` | Pas de système XP/niveau - utilise uniquement `useStorySession` pour les fragments |

---

## 🔍 Problèmes Critiques Détectés

### 1. **Incohérence avec les résumés précédents**
- Les résumés mentionnaient que `Journal`, `MoodMixer`, `BubbleBeat`, `VRGalaxy` étaient intégrés
- **RÉALITÉ**: Ces modules utilisent toujours `localStorage`
- ❌ **ERREUR**: Le code n'a pas été correctement mis à jour

### 2. **Risques de perte de données**
- Utilisateurs perdent leur progression lors de:
  - Changement de navigateur
  - Effacement du cache
  - Utilisation multi-device
- **Impact**: Frustration utilisateur, abandon de l'app

### 3. **Duplications de logique**
- Chaque module réimplémente:
  - Calcul de XP (formules différentes)
  - Système de niveaux (seuils incohérents)
  - Gestion d'unlocks (logiques variées)
- **Impact**: Maintenance difficile, bugs potentiels

### 4. **Inconsistance des seuils**
| Module | XP par niveau | Notes |
|--------|---------------|-------|
| Journal | 500 XP | ✅ Cohérent |
| MoodMixer | 500 XP | ✅ Cohérent |
| Meditation | 800 XP | ❌ **Incohérent** |
| Breathwork | 500 XP | ✅ Cohérent |
| ARFilters | 500 XP | ✅ Cohérent |

---

## 📋 Plan d'Action Recommandé

### Phase 1: Migration Backend (Priorité HAUTE) 🔴
**Durée estimée**: 2-3 heures

1. **Journal.tsx** (30 min)
   - Remplacer `localStorage.getItem('journal_progress')` par `useModuleProgress('journal')`
   - Migrer: `level`, `xp`, `entries`, `chapters`
   - Ajouter animation level-up

2. **MoodMixer.tsx** (30 min)
   - Remplacer `localStorage.getItem('mood_mixer_progress')` par `useModuleProgress('mood_mixer')`
   - Migrer: `level`, `xp`, `sets`
   - Gérer les mixes sauvegardés

3. **Meditation.tsx** (45 min)
   - Remplacer localStorage par `useModuleProgress('meditation')`
   - **Adapter le seuil de 800 XP à 500 XP** pour cohérence
   - Migrer: `level`, `xp`, `completed`, `total_time`

4. **Breathwork.tsx** (30 min)
   - Remplacer localStorage par `useModuleProgress('breathwork')`
   - Migrer: `level`, `xp`, `completed`

### Phase 2: Migration Backend (Priorité MOYENNE) 🟡
**Durée estimée**: 2-3 heures

5. **ARFilters.tsx** (30 min)
6. **VRBreath.tsx** (45 min)
7. **FlashGlow.tsx** (30 min)
8. **EmotionalScan.tsx** (30 min)

### Phase 3: Normalisation 🔧
**Durée estimée**: 1 heure

- Uniformiser les seuils XP (500 XP/niveau partout)
- Créer des constantes partagées:
  ```typescript
  export const GLOBAL_XP_PER_LEVEL = 500;
  export const RARITY_XP_BONUS = {
    common: 0,
    rare: 50,
    epic: 100,
    legendary: 200
  };
  ```
- Documenter les formules de calcul XP

### Phase 4: Migration de Données Utilisateurs 📦
**Durée estimée**: 2 heures

- Créer un script de migration localStorage → Supabase
- Permettre aux utilisateurs de conserver leur progression
- Afficher un message informatif

---

## 🎯 Bénéfices Attendus

### Pour les utilisateurs:
- ✅ Progression sauvegardée en base de données
- ✅ Sync multi-devices
- ✅ Aucune perte de données
- ✅ Expérience cohérente

### Pour les développeurs:
- ✅ Code centralisé et maintenable
- ✅ Moins de bugs
- ✅ Facile d'ajouter de nouveaux modules
- ✅ Meilleure observabilité (analytics)

---

## 📊 Métriques Actuelles

| Métrique | Valeur | Cible |
|----------|--------|-------|
| Modules avec backend | 5/14 (36%) | 13/14 (93%) |
| Modules avec localStorage | 8/14 (57%) | 0/14 (0%) |
| Cohérence XP/niveau | 87% | 100% |
| Risque perte de données | **ÉLEVÉ** | **NUL** |

---

## ⚠️ Avertissements

1. **NE PAS supprimer le localStorage** avant d'avoir migré les données utilisateurs
2. **Prévoir une période de transition** où les deux systèmes coexistent
3. **Tester la migration** avec des comptes test d'abord
4. **Communiquer aux utilisateurs** la mise à jour importante

---

## 🔗 Fichiers Concernés

### Hooks
- ✅ `src/hooks/useModuleProgress.tsx` - Hook principal (existe déjà)

### Pages à Migrer
- ❌ `src/pages/Journal.tsx`
- ❌ `src/pages/MoodMixer.tsx`
- ❌ `src/pages/Meditation.tsx`
- ❌ `src/pages/Breathwork.tsx`
- ❌ `src/pages/ARFilters.tsx`
- ❌ `src/pages/VRBreath.tsx`
- ❌ `src/pages/FlashGlow.tsx`
- ❌ `src/pages/EmotionalScan.tsx`

### Base de Données
- ✅ Table `module_progress` - existe déjà avec RLS policies

---

## 🎬 Prochaines Étapes Immédiates

1. **Valider ce rapport** avec l'équipe
2. **Prioriser les modules** selon l'usage utilisateur
3. **Planifier les sprints** de migration
4. **Commencer par Journal** (module le plus utilisé)

---

**Fin du rapport d'audit**

*Ce document sera mis à jour au fur et à mesure de l'avancement des migrations.*
