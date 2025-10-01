# Documentation Technique EmotionsCare

## Architecture

### Stack technologique
- **Frontend** : React 18 + TypeScript + Vite
- **UI** : Tailwind CSS + shadcn/ui + Framer Motion
- **Backend** : Supabase (PostgreSQL + Edge Functions)
- **Auth** : Supabase Auth (JWT)
- **Storage** : Supabase Storage
- **State** : React Query (TanStack Query)

### Structure du projet

```
emotionscare/
├── src/
│   ├── components/         # Composants UI réutilisables
│   │   ├── ui/            # shadcn components
│   │   └── ...            # Composants métier
│   ├── pages/             # Pages de l'application
│   ├── hooks/             # Custom React hooks
│   ├── contexts/          # React contexts (Auth, etc.)
│   ├── lib/               # Utilitaires et helpers
│   ├── services/          # Services externes (API)
│   ├── types/             # TypeScript types
│   └── integrations/      # Intégrations Supabase
├── supabase/
│   ├── functions/         # Edge Functions
│   └── migrations/        # Database migrations
└── docs/                  # Documentation
```

## Base de données

### Tables principales

#### `profiles`
Profils utilisateurs étendus
```sql
- id: uuid (PK, ref auth.users)
- username: text
- avatar_url: text
- role: text (user|manager|admin)
- created_at: timestamp
- updated_at: timestamp
```

#### `mood_entries`
Journal d'humeur
```sql
- id: uuid (PK)
- user_id: uuid (FK profiles)
- mood: text
- intensity: integer (1-10)
- notes: text
- created_at: timestamp
```

#### `assessments`
Évaluations cliniques
```sql
- id: uuid (PK)
- user_id: uuid (FK profiles)
- instrument: text (WHO-5, PANAS, etc.)
- score_json: jsonb
- submitted_at: timestamp
```

#### `music_therapy_sessions`
Sessions de musicothérapie
```sql
- id: uuid (PK)
- user_id: uuid (FK profiles)
- emotion_input: text
- playlist_data: jsonb
- created_at: timestamp
```

### RLS (Row Level Security)

Toutes les tables utilisent RLS pour sécuriser l'accès aux données :

```sql
-- Exemple: profiles
CREATE POLICY "Users can view own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);
```

## API & Edge Functions

### Structure d'une Edge Function

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "@supabase/supabase-js";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Your logic here
    return new Response(
      JSON.stringify({ data: "success" }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

### Edge Functions existantes

#### `delete-user-data`
Suppression RGPD complète des données utilisateur

**Endpoint** : POST `/functions/v1/delete-user-data`  
**Auth** : Required (user JWT)  
**Input** : Aucun (utilise auth.uid())  
**Output** : 
```typescript
{
  success: boolean;
  message: string;
  deletedData: {
    profiles: number;
    mood_entries: number;
    assessments: number;
    // ... autres tables
  }
}
```

#### `ai-chat`
Conversations avec l'IA Coach (Nyvee)

**Endpoint** : POST `/functions/v1/ai-chat`  
**Auth** : Required  
**Input** :
```typescript
{
  message: string;
  conversationId?: string;
}
```
**Output** :
```typescript
{
  response: string;
  conversationId: string;
}
```

#### `assess-start` / `assess-submit`
Gestion des évaluations cliniques

**assess-start**  
Initialise une session d'évaluation
```typescript
// Input
{ instrument: 'WHO-5' | 'PANAS' | 'PHQ-9' | 'GAD-7' }

// Output
{ sessionId: string; questions: Question[] }
```

**assess-submit**  
Soumet les réponses et calcule le score
```typescript
// Input
{ sessionId: string; answers: Record<string, any> }

// Output
{ score: number; interpretation: string; recommendations: string[] }
```

## Authentification

### Flow d'authentification

1. **Inscription**
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure_password',
  options: {
    data: { username: 'johndoe' }
  }
});
```

2. **Connexion**
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure_password'
});
```

3. **Session management**
```typescript
// Récupérer l'utilisateur actuel
const { data: { user } } = await supabase.auth.getUser();

// Écouter les changements d'auth
supabase.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_IN') console.log('User signed in');
  if (event === 'SIGNED_OUT') console.log('User signed out');
});
```

### Gestion des rôles

```typescript
// Vérifier le rôle utilisateur
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('id', user.id)
  .single();

if (profile.role === 'admin') {
  // Admin actions
}
```

## Hooks personnalisés

### `useAssess`
Gestion des évaluations cliniques

```typescript
const { startAssessment, submitAnswers, isLoading } = useAssess();

// Démarrer une évaluation
const session = await startAssessment('WHO-5');

// Soumettre les réponses
const result = await submitAnswers(session.id, answers);
```

### `useMoodEntries`
CRUD pour le journal d'humeur

```typescript
const { entries, addEntry, updateEntry, deleteEntry } = useMoodEntries();

// Ajouter une entrée
await addEntry({
  mood: 'happy',
  intensity: 8,
  notes: 'Great day!'
});
```

### `useGamification`
Système de points et badges

```typescript
const { points, level, badges, addPoints } = useGamification();

// Ajouter des points
await addPoints(10, 'Completed journal entry');
```

## Sécurité

### Bonnes pratiques implémentées

1. **RLS sur toutes les tables**
2. **CORS configuré correctement**
3. **Validation des inputs côté serveur**
4. **Chiffrement SSL/TLS**
5. **Secrets stockés dans Supabase Vault**
6. **JWT avec expiration**
7. **Rate limiting sur les Edge Functions**

### Checklist sécurité

- ✅ RLS activé sur toutes les tables sensibles
- ✅ Validation Zod sur tous les formulaires
- ✅ Pas de secrets côté client
- ✅ Sanitisation des inputs HTML
- ✅ CSRF protection (Supabase natif)
- ✅ XSS prevention (React natif)
- ⚠️ Rate limiting (à implémenter)
- ⚠️ Monitoring d'erreurs (Sentry à configurer)

## Performance

### Optimisations implémentées

1. **React Query** : Cache et refetch automatique
2. **Code splitting** : Lazy loading des routes
3. **Image optimization** : WebP + lazy loading
4. **Database indexes** : Sur les colonnes fréquemment requêtées
5. **Edge Functions** : Déployées sur CDN global

### Métriques cibles

- **FCP** (First Contentful Paint) : < 1.5s
- **LCP** (Largest Contentful Paint) : < 2.5s
- **TTI** (Time to Interactive) : < 3.5s
- **CLS** (Cumulative Layout Shift) : < 0.1

## Tests

### Tests unitaires (à implémenter)

```bash
npm run test
```

Structure des tests :
```
src/
├── components/
│   └── __tests__/
│       └── Button.test.tsx
├── hooks/
│   └── __tests__/
│       └── useAssess.test.ts
```

### Tests E2E (Playwright - à implémenter)

```bash
npm run test:e2e
```

Scénarios critiques :
- Inscription / Connexion
- Création d'entrée journal
- Complétion d'évaluation WHO-5
- Génération playlist musicothérapie

## Déploiement

### Variables d'environnement

```env
# Supabase (auto-configuré)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Optionnel (APIs externes)
OPENAI_API_KEY=sk-...
HUME_API_KEY=...
SUNO_API_KEY=...
```

### Build de production

```bash
npm run build
```

Outputs dans `/dist`

### Monitoring

**À implémenter** :
- Sentry pour les erreurs
- LogRocket pour session replay
- Supabase Analytics pour les métriques DB

## Maintenance

### Tâches récurrentes

- **Hebdomadaire** : Vérifier les logs Supabase
- **Mensuel** : Audit des RLS policies
- **Trimestriel** : Revue de sécurité complète
- **Annuel** : Mise à jour des dépendances majeures

### Backup

- **Base de données** : Supabase backup automatique quotidien (7 jours de rétention)
- **Storage** : Backup manuel recommandé mensuel

## Support

- **Issues** : GitHub Issues
- **Documentation** : docs.emotionscare.com
- **Contact** : dev@emotionscare.com
