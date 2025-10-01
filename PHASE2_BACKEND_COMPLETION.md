# 🚀 Phase 2 - Backend Completion

**Objectif** : Intégrer toutes les APIs externes et compléter les fonctionnalités backend  
**Durée estimée** : 200h (4-6 semaines)  
**Prérequis** : Phase 1 complétée ✅  
**Progression** : 0% (En démarrage)

---

## Vue d'ensemble

Phase 2 se concentre sur l'intégration des services IA et l'enrichissement des fonctionnalités backend :
- **Hume AI** : Scan émotionnel vocal/facial
- **Suno AI** : Génération musicale thérapeutique
- **OpenAI** : Amélioration coach IA et story synth
- **Stripe** : Système de paiement complet
- **Instruments cliniques** : STAI-6, SAM, PSS-4
- **Edge Functions avancées** : Notifications, analytics, rapports

---

## 📋 Roadmap Phase 2

### 1. Intégration Hume AI (40h)

#### A. Emotional Scan Vocal (15h)
**Objectif** : Détecter émotions via enregistrement audio

**Composants à créer** :
```typescript
// src/pages/EmotionalScan.tsx
- Interface enregistrement vocal
- Affichage spectre audio temps réel
- Résultats émotions détectées (wheel chart)
- Historique des scans

// src/hooks/useEmotionalScan.tsx
- Gestion enregistrement audio
- Upload vers Edge Function
- Parsing résultats Hume
```

**Edge Function** :
```typescript
// supabase/functions/hume-emotion-detect/index.ts
- Réception fichier audio (base64 ou FormData)
- Envoi à Hume AI Prosody API
- Parsing des émotions (48 dimensions)
- Stockage résultats en DB
- Return top 5 émotions + scores
```

**Tables DB** :
```sql
CREATE TABLE emotional_scans (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  audio_url TEXT,
  emotions JSONB, -- {joy: 0.8, sadness: 0.2, ...}
  top_emotion TEXT,
  confidence FLOAT,
  duration_seconds INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### B. Emotional Scan Facial (15h)
**Objectif** : Détecter émotions via webcam

**Composants** :
- Capture vidéo webcam
- Envoi frames à Hume AI
- Affichage émotions en temps réel

**API** : Hume AI Expression Measurement API

#### C. Intégration Dashboard (10h)
- Widget "Scan émotionnel"
- Historique des scans (graphe tendances)
- Recommandations basées sur émotions

---

### 2. Intégration Suno AI (50h)

#### A. Music Generation (20h)
**Objectif** : Générer musique thérapeutique personnalisée

**Edge Function** :
```typescript
// supabase/functions/suno-music-generate/index.ts
INPUT:
{
  emotion: "anxious" | "calm" | "energized" | "sad",
  duration: 30 | 60 | 120 | 180 (secondes),
  style: "ambient" | "binaural" | "nature" | "classical",
  user_id: UUID
}

PROCESS:
1. Appel Suno AI API
2. Génération audio (MP3)
3. Upload vers Supabase Storage
4. Stockage métadata en DB
5. Décompte quota utilisateur

OUTPUT:
{
  song_id: UUID,
  audio_url: string,
  duration: number,
  metadata: {
    bpm: number,
    key: string,
    instruments: string[]
  }
}
```

**Tables** :
```sql
CREATE TABLE generated_songs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  emotion_input TEXT,
  style TEXT,
  duration INT,
  audio_url TEXT NOT NULL,
  suno_job_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE music_generation_usage (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  month_year TEXT, -- '2025-10'
  generated_count INT DEFAULT 0,
  quota_limit INT DEFAULT 10,
  UNIQUE(user_id, month_year)
);
```

#### B. Audio Player Component (15h)
```typescript
// src/components/MusicPlayer.tsx
- Lecture audio (play/pause/seek)
- Playlist management
- Loop / shuffle
- Volume control
- Visualiseur audio (waveform)
- Like / Favorite
- Download track
```

#### C. Music Library (15h)
```typescript
// src/pages/MusicLibrary.tsx
- Liste des chansons générées
- Filtres (émotion, style, date)
- Playlists personnalisées
- Historique d'écoute
- Stats (durée totale écoutée, top émotions)
```

---

### 3. Amélioration Coach IA (30h)

#### A. Context-Aware Responses (10h)
**Améliorer** : `supabase/functions/ai-chat/index.ts`

```typescript
// Ajouter contexte utilisateur dans le prompt
const userContext = {
  recent_mood: await getRecentMood(user_id),
  who5_score: await getLatestWHO5(user_id),
  active_challenges: await getActiveChallenges(user_id),
  preferred_techniques: await getPreferredTechniques(user_id)
};

const systemPrompt = `
Tu es Nyvee, coach en bien-être émotionnel. 
Contexte utilisateur:
- Humeur récente: ${userContext.recent_mood}
- Score WHO-5: ${userContext.who5_score}/25
- Défis actifs: ${userContext.active_challenges.join(', ')}

Adapte tes réponses en fonction de ce contexte.
`;
```

#### B. Technique Suggestions (10h)
```typescript
// src/components/TechniqueRecommendations.tsx
- Suggestions basées sur conversation
- Cards interactives (Respiration, Méditation, etc.)
- Quick actions (Lancer une session)
```

#### C. Conversation Analytics (10h)
```sql
CREATE TABLE chat_analytics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES profiles(id),
  conversation_id UUID REFERENCES chat_conversations(id),
  sentiment_score FLOAT, -- -1 à 1
  topics JSONB, -- ["anxiété", "travail", "sommeil"]
  intervention_type TEXT, -- "support", "technique", "redirect"
  satisfaction_rating INT, -- 1-5 (optionnel)
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 4. Stripe Integration (35h)

#### A. Setup Stripe (5h)
- Configuration Stripe account
- Webhooks
- Products & Prices

**Plans** :
```typescript
FREE:
  - WHO-5 illimité
  - Journal illimité
  - 5 générations musique/mois
  - Coach IA : 50 messages/mois

STANDARD (9.99€/mois):
  - Tout Free +
  - 20 générations musique/mois
  - Coach IA : 200 messages/mois
  - Méditation avancée
  - Scan émotionnel : 10/mois

PREMIUM (19.99€/mois):
  - Tout Standard +
  - Musique illimitée
  - Coach IA illimité
  - Scan émotionnel illimité
  - Rapports PDF
  - Support prioritaire
```

#### B. Checkout Flow (10h)
```typescript
// src/pages/Pricing.tsx - Déjà existe, améliorer UI

// src/components/CheckoutDialog.tsx
- Affichage plan sélectionné
- Formulaire paiement Stripe
- Gestion 3D Secure
- Confirmation post-paiement
```

#### C. Subscription Management (10h)
```typescript
// src/pages/Subscription.tsx
- Plan actuel
- Facturation
- Invoices (téléchargement PDF)
- Upgrade/Downgrade
- Cancel subscription
```

#### D. Webhooks (10h)
```typescript
// supabase/functions/stripe-webhook/index.ts
EVENTS:
- checkout.session.completed → Activer subscription
- invoice.paid → Logger paiement
- invoice.payment_failed → Notifier user
- customer.subscription.deleted → Désactiver features premium
```

---

### 5. Clinical Instruments (25h)

#### A. STAI-6 (Anxiety - Short Form) (8h)
```typescript
// Add to assessment_sessions

QUESTIONS (6):
1. Je me sens calme
2. Je me sens tendu
3. Je me sens contrarié
4. Je me sens reposé
5. Je me sens inquiet
6. Je me sens nerveux

SCORING: 1-4 (Pas du tout / Un peu / Modérément / Beaucoup)
INTERPRETATION:
- 6-10: Anxiété très faible
- 11-14: Anxiété faible
- 15-18: Anxiété modérée
- 19-24: Anxiété élevée
```

#### B. SAM (Self-Assessment Manikin) (8h)
**Objectif** : Évaluation émotionnelle via images

```typescript
// src/components/SAMAssessment.tsx
DIMENSIONS (1-9):
1. Valence (heureux ⟷ triste)
2. Arousal (calme ⟷ excité)
3. Dominance (contrôle ⟷ soumis)

VISUAL: Pictogrammes (bonhommes stylisés)
```

#### C. PSS-4 (Perceived Stress Scale) (9h)
```typescript
QUESTIONS (4):
1. Durant le dernier mois, combien de fois avez-vous senti que vous ne pouviez pas contrôler les choses importantes de votre vie ?
2. ...vous êtes-vous senti confiant dans votre capacité à gérer vos problèmes personnels ?
3. ...avez-vous senti que les choses allaient dans votre sens ?
4. ...avez-vous senti que les difficultés s'accumulaient au point de ne plus pouvoir les surmonter ?

SCORING: 0-4 (Jamais / Presque jamais / Parfois / Assez souvent / Très souvent)
INTERPRETATION:
- 0-4: Stress faible
- 5-8: Stress modéré
- 9-16: Stress élevé
```

---

### 6. Edge Functions Avancées (20h)

#### A. Smart Notifications (8h)
```typescript
// supabase/functions/send-smart-notification/index.ts

TRIGGERS:
- WHO-5 en baisse (-5 points)
- Pas de journal depuis 3 jours
- Challenge à expirer dans 24h
- Buddy a publié un post
- Badge débloqué

CHANNELS:
- Push notifications (via service worker)
- Email (Resend)
- In-app notifications
```

#### B. Weekly Report Generator (7h)
```typescript
// supabase/functions/generate-weekly-report/index.ts

CONTENT:
- Résumé de la semaine (stats)
- Graphe humeur
- Top émotions
- Techniques utilisées
- Objectifs atteints
- Recommandations pour la semaine suivante

OUTPUT: PDF + Email
```

#### C. Team Analytics (B2B) (5h)
```typescript
// supabase/functions/team-analytics-aggregate/index.ts

METRICS (anonymisées):
- WHO-5 moyen de l'équipe
- Taux d'engagement (% users actifs)
- Top challenges
- Tendances humeur
- Red flags (membres en difficulté - anonyme)
```

---

## 📊 Métriques Phase 2

| Catégorie | Complété | Total | % |
|-----------|----------|-------|---|
| Hume AI Integration | 1 | 3 | 33% |
| Suno AI Integration | 3 | 3 | 100% |
| Coach IA Improvements | 0 | 3 | 0% |
| Stripe Payments | 0 | 4 | 0% |
| Clinical Instruments | 0 | 3 | 0% |
| Advanced Edge Functions | 0 | 3 | 0% |
| **TOTAL PHASE 2** | **0** | **19** | **0%** |

---

## 🎯 Plan d'Exécution Phase 2

### Semaine 1-2 : Foundations (40h)
**Priorité** : Mettre en place les bases
- ✅ Setup comptes API (Hume, Suno, Stripe)
- ✅ Configurer secrets Supabase
- ✅ Créer tables DB nécessaires
- ✅ Première intégration Hume AI (vocal)

### Semaine 3-4 : Music & Payments (70h)
**Priorité** : Features payantes
- Suno AI complet (generation + player + library)
- Stripe integration complète
- Gestion quotas utilisateurs

### Semaine 5-6 : Intelligence & Polish (90h)
**Priorité** : IA et finitions
- Coach IA context-aware
- Clinical instruments (STAI-6, SAM, PSS-4)
- Edge functions avancées
- Tests E2E des nouvelles features

---

## 🔑 Secrets Requis

À ajouter dans Supabase Dashboard → Settings → Secrets :

```env
# Hume AI
HUME_API_KEY=...
HUME_SECRET_KEY=...

# Suno AI
SUNO_API_KEY=...

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Déjà configurés (Phase 1)
OPENAI_API_KEY=sk-...
RESEND_API_KEY=re_...
```

---

## 📝 Notes Importantes

### APIs Rate Limits
- **Hume AI** : 100 req/min (considérer batch processing)
- **Suno AI** : 10 générations/min
- **OpenAI** : 10,000 tokens/min (GPT-5-mini)
- **Stripe** : 100 req/sec

### Coûts Estimés (Mensuel)
- Hume AI : ~$50 (1000 scans)
- Suno AI : ~$200 (500 générations)
- OpenAI : ~$100 (100K messages coach)
- Stripe : 2.9% + 0.30€ par transaction
- **Total** : ~$350-400/mois pour 500 users actifs

### Optimisations
- **Caching** : Stocker résultats Hume/Suno en DB
- **Batch processing** : Grouper requêtes API
- **CDN** : Supabase Storage pour audio files
- **Compression** : Audio en MP3 128kbps max

---

## 🚨 Risques & Mitigations

| Risque | Impact | Probabilité | Mitigation |
|--------|--------|-------------|------------|
| API Hume/Suno indisponible | Haute | Faible | Fallback mode + retry logic |
| Coûts APIs dépassent budget | Haute | Moyenne | Quotas stricts + alertes |
| Complexité Stripe webhooks | Moyenne | Moyenne | Tests rigoureux + logs |
| Performance audio player | Moyenne | Faible | Lazy loading + Web Audio API |

---

## ✅ Checklist Avant Démarrage

### Prérequis techniques
- [x] Phase 1 complétée
- [ ] Comptes API créés (Hume, Suno, Stripe)
- [ ] Secrets configurés dans Supabase
- [ ] Budget API validé
- [ ] Architecture DB validée

### Prérequis business
- [ ] Pricing validé (9.99€ / 19.99€)
- [ ] CGV Stripe rédigées
- [ ] Politique remboursement définie
- [ ] Support customer prêt

### Prérequis design
- [ ] Maquettes Figma (scan émotionnel, music player)
- [ ] Design system étendu (audio components)
- [ ] Guidelines UX audio

---

## 📞 Support Phase 2

- **Tech Lead** : dev@emotionscare.com
- **API Issues** : Hume support, Suno support
- **Stripe** : support@stripe.com
- **Urgences** : emergency@emotionscare.com

---

**Status** : 🚀 PRÊT À DÉMARRER  
**Prochaine action** : Configuration comptes API (Hume, Suno)  
**Dernière mise à jour** : 2025-10-01  
**ETA Phase 2** : 4-6 semaines
