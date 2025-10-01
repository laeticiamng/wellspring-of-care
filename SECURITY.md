# Security Policy

## Reporting Vulnerabilities

If you discover a security vulnerability in EmotionsCare, please report it responsibly:

### 🔴 Critical Vulnerabilities
**Contact immediately** : security@emotionscare.com  
**Expected response** : < 24 hours  
**Fix target** : < 48 hours

**Examples** :
- Authentication bypass
- SQL injection
- RLS policy bypass
- Exposed secrets/API keys
- XSS allowing data theft

### 🟡 Non-Critical Issues
**Contact** : security@emotionscare.com  
**Expected response** : < 72 hours  
**Fix target** : Next release cycle

**Examples** :
- Missing security headers
- Outdated dependencies (no known exploit)
- Information disclosure (non-sensitive)
- CSRF on low-impact endpoints

### ✅ What to Include

1. **Description** : Clear explanation of the vulnerability
2. **Steps to reproduce** : Detailed reproduction steps
3. **Impact assessment** : What data/functionality is affected
4. **Suggested fix** : If you have recommendations
5. **Your contact** : For follow-up questions

### ❌ What NOT to Do

- Do not disclose publicly before fix
- Do not exploit the vulnerability
- Do not test on production data without permission
- Do not demand financial compensation

---

## Security Best Practices

### Frontend Security

#### 1. Input Validation
**Always validate user inputs** using Zod schemas:

```typescript
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email("Email invalide").max(255),
  password: z.string().min(8, "Minimum 8 caractères").max(100),
});

// Valider avant envoi
const result = loginSchema.safeParse({ email, password });
if (!result.success) {
  // Afficher erreurs
  return;
}
```

#### 2. XSS Prevention
- ✅ React échappe automatiquement les contenus
- ❌ **JAMAIS** utiliser `dangerouslySetInnerHTML` avec contenu utilisateur
- ✅ Utiliser DOMPurify si HTML requis

```typescript
import DOMPurify from 'dompurify';

// Si vous DEVEZ render du HTML utilisateur
const sanitized = DOMPurify.sanitize(userContent);
```

#### 3. CSRF Protection
- ✅ Supabase gère CSRF automatiquement
- ✅ JWT tokens dans headers (pas de cookies)
- ❌ Pas de formulaires soumis à des URLs externes sans validation

#### 4. Secrets Management
- ❌ **JAMAIS** de secrets côté client (API keys, tokens)
- ✅ Secrets uniquement dans Supabase Edge Functions
- ✅ Utiliser variables d'environnement Supabase

```typescript
// ❌ MAUVAIS
const OPENAI_KEY = "sk-..."; // Exposé dans le code client

// ✅ BON
// Dans Edge Function
const OPENAI_KEY = Deno.env.get('OPENAI_API_KEY');
```

---

### Backend Security (Supabase)

#### 1. Row Level Security (RLS)

**TOUTES les tables sensibles doivent avoir RLS activé** :

```sql
-- Activer RLS
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own data
CREATE POLICY "Users view own entries"
ON public.mood_entries FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can only insert their own data
CREATE POLICY "Users insert own entries"
ON public.mood_entries FOR INSERT
WITH CHECK (auth.uid() = user_id);
```

**Vérifier les policies permissives** :

```sql
-- Trouver les policies trop permissives
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
AND qual = 'true'  -- ⚠️ Permet tout !
OR with_check = 'true';
```

#### 2. Security Definer Functions

**Éviter les récursions infinies** :

```sql
-- ❌ MAUVAIS : Référence circulaire
CREATE POLICY "Admins can view all"
ON public.profiles FOR SELECT
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'admin'
  -- ⚠️ Récursion !
);

-- ✅ BON : Security definer function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role text)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Admins can view all"
ON public.profiles FOR SELECT
USING (public.has_role(auth.uid(), 'admin'));
```

#### 3. Edge Functions Security

**CORS Headers** :
```typescript
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Handle CORS preflight
if (req.method === 'OPTIONS') {
  return new Response(null, { headers: corsHeaders });
}
```

**Input Validation** :
```typescript
import { z } from 'zod';

const requestSchema = z.object({
  message: z.string().min(1).max(5000),
  userId: z.string().uuid(),
});

// Valider les inputs
const result = requestSchema.safeParse(await req.json());
if (!result.success) {
  return new Response(
    JSON.stringify({ error: 'Invalid input', details: result.error }),
    { status: 400, headers: corsHeaders }
  );
}
```

**Rate Limiting** :
```typescript
// Utiliser la table rate_limit_counters
const { data: limit } = await supabase.rpc('increment_rate_limit_counter', {
  p_identifier: userId,
  p_window_duration_seconds: 60,
  p_max_requests: 100
});

if (limit.rate_limited) {
  return new Response(
    JSON.stringify({ error: 'Rate limit exceeded' }),
    { 
      status: 429,
      headers: { 
        ...corsHeaders,
        'Retry-After': '60'
      }
    }
  );
}
```

---

## Security Checklist

### Authentication & Authorization
- [ ] RLS activé sur toutes les tables sensibles
- [ ] Policies testées pour chaque rôle (user, manager, admin)
- [ ] Pas de référence circulaire dans les policies
- [ ] Security definer functions pour les checks de rôle
- [ ] JWT tokens avec expiration appropriée (1h)
- [ ] Refresh tokens sécurisés
- [ ] Email confirmation en production
- [ ] Password reset flow sécurisé

### Input Validation
- [ ] Validation Zod sur tous les formulaires
- [ ] Validation côté serveur (Edge Functions)
- [ ] Sanitization HTML si nécessaire
- [ ] Limites de taille sur les inputs (max lengths)
- [ ] Validation des types de fichiers upload
- [ ] Pas d'injection SQL possible (utiliser query builder)

### Secrets & Keys
- [ ] Pas de secrets dans le code client
- [ ] Secrets stockés dans Supabase Vault
- [ ] Rotation régulière des API keys
- [ ] `.gitignore` inclut `.env` (si utilisé)
- [ ] Pas de clés d'API dans les logs

### Network Security
- [ ] HTTPS obligatoire (redirect HTTP → HTTPS)
- [ ] CORS configuré correctement
- [ ] Rate limiting sur les endpoints critiques
- [ ] Security headers (CSP, X-Frame-Options, etc.)
- [ ] No SQL injection possible

### Data Protection
- [ ] Données sensibles chiffrées au repos
- [ ] SSL/TLS en transit
- [ ] Backup régulier de la DB (Supabase natif)
- [ ] Logs ne contiennent pas de données sensibles
- [ ] Pas de PII dans les URLs

### RGPD Compliance
- [ ] Privacy Policy accessible
- [ ] Cookie consent banner
- [ ] Export des données (JSON)
- [ ] Suppression compte complète
- [ ] Droit de rectification implémenté
- [ ] Retention policy documentée

### Monitoring
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Alertes pour tentatives d'attaque
- [ ] Logs d'accès analysés
- [ ] Audit trail pour actions admin

---

## Incident Response Plan

### 1. Detection (0-15 min)
- Alerte monitoring (Sentry, Uptime)
- User report
- Security audit finding

**Actions** :
- Confirmer l'incident
- Évaluer la gravité (critique/haute/moyenne/basse)
- Notifier l'équipe sécurité

### 2. Containment (15-60 min)
**Critique** :
- Désactiver l'endpoint compromis
- Révoquer les clés API exposées
- Activer le mode maintenance si nécessaire

**Non-critique** :
- Documenter le problème
- Planifier le fix

### 3. Investigation (1-4h)
- Identifier la cause root
- Vérifier l'étendue (combien d'users affectés)
- Collecter les logs pertinents
- Documenter la timeline

### 4. Remediation (4-24h)
- Développer le patch
- Tester en environnement de staging
- Déployer en production
- Vérifier le fix

### 5. Recovery (24-48h)
- Notifier les utilisateurs affectés
- Restaurer les données si nécessaire
- Re-enabled les fonctionnalités

### 6. Post-Mortem (< 1 semaine)
- Document what happened
- Root cause analysis
- Améliorer les process pour éviter récidive
- Mettre à jour cette documentation

---

## Security Contacts

- **Email** : security@emotionscare.com
- **PGP Key** : [À ajouter si applicable]
- **Bug Bounty** : Non disponible actuellement
- **Security Team** : security-team@emotionscare.com

---

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | ✅ Full support    |
| < 1.0   | ❌ Not supported   |

---

## Acknowledgments

Nous remercions les chercheurs en sécurité qui ont signalé des vulnérabilités de manière responsable :

- [Liste vide pour l'instant - à compléter au fur et à mesure]

---

**Version** : 1.0  
**Dernière mise à jour** : Octobre 2025  
**Prochaine revue** : Janvier 2026
