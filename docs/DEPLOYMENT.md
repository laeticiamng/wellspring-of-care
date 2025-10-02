# Guide de Déploiement - Wellspring of Care

## Prérequis

### Développement local
- **Node.js** : v18.x ou supérieur
- **npm** : v9.x ou supérieur
- **Git** : Pour le versioning
- **Compte Supabase** : Pour la base de données et auth
- **Navigateur moderne** : Chrome, Firefox, Safari, Edge

### Production
- **Serveur web** : Compatible avec applications React SPA
- **HTTPS** : Obligatoire pour Supabase Auth
- **Domaine** : Domaine personnalisé recommandé

---

## Variables d'Environnement

### Supabase (Auto-configurées)

Ces variables sont automatiquement configurées dans Lovable :

```env
VITE_SUPABASE_URL=https://yaincoxihiqdksxgrsrk.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Secrets Supabase (Edge Functions)

Les secrets suivants doivent être configurés dans Supabase via le dashboard :

```env
# Email (Resend)
RESEND_API_KEY=re_...

# OpenAI (Story Synth, AI Chat)
OPENAI_API_KEY=sk-...

# Monitoring (Optionnel)
SENTRY_DSN=https://...@sentry.io/...

# APIs Externes (Phase 2)
HUME_API_KEY=...
SUNO_API_KEY=...
STRIPE_SECRET_KEY=sk_live_...
```

**Configuration des secrets** :
1. Dashboard Supabase → Settings → Edge Functions
2. Ajouter chaque secret individuellement
3. Redéployer les Edge Functions après ajout

---

## Configuration Supabase

### 1. Projet Supabase

Le projet est déjà configuré : `yaincoxihiqdksxgrsrk`

**Vérifications importantes** :
- ✅ RLS activé sur toutes les tables sensibles
- ✅ Policies configurées correctement
- ✅ Storage buckets créés si nécessaire
- ✅ Edge Functions déployées

### 2. Authentication Settings

**Dashboard → Authentication → Settings** :

```yaml
Site URL: https://your-domain.com
Redirect URLs:
  - https://your-domain.com/**
  - http://localhost:5173/**  # Dev only

Email Auth:
  - Enable Email Confirmations: ❌ Désactivé en dev, ✅ Activé en prod
  - Secure Email Change: ✅ Activé
  - Email Templates: Personnalisés (voir /supabase/email-templates/)

Security:
  - JWT Expiry: 3600 seconds (1 hour)
  - Refresh Token Expiry: 2592000 seconds (30 days)
  - Auto Refresh Tokens: ✅ Activé
```

### 3. RLS Policies Audit

Avant déploiement, vérifier toutes les policies RLS :

```sql
-- Lister toutes les tables sans RLS
SELECT schemaname, tablename 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename NOT IN (
  SELECT tablename 
  FROM pg_policies 
  WHERE schemaname = 'public'
);

-- Vérifier les policies permissives
SELECT * FROM pg_policies 
WHERE schemaname = 'public' 
AND permissive = true 
AND qual = 'true';  -- ⚠️ Policies trop permissives
```

### 4. Database Migrations

Les migrations sont dans `/supabase/migrations/` et sont appliquées automatiquement.

**Appliquer manuellement** (si nécessaire) :
```bash
npx supabase db reset  # Reset complet (dev only)
npx supabase db push   # Appliquer nouvelles migrations
```

---

## Build de Production

### 1. Installation des dépendances

```bash
npm install
```

### 2. Build de l'application

```bash
npm run build
```

Output dans `/dist` :
- `index.html` : Page principale
- `assets/` : JS, CSS, images optimisés
- `robots.txt`, `sitemap.xml` : SEO

### 3. Vérification du build

```bash
npm run preview
```

Ouvre le build en local sur `http://localhost:4173`

**Tests pré-déploiement** :
- ✅ Toutes les routes chargent sans erreur
- ✅ Authentification fonctionne
- ✅ API calls vers Supabase réussissent
- ✅ Images et assets se chargent
- ✅ Pas d'erreurs console

---

## Déploiement

### Option 1 : Lovable Hosting (Recommandé)

EmotionsCare est hébergé sur Lovable :

1. **Build automatique** : À chaque commit, Lovable rebuild
2. **URL de production** : `https://[project-id].lovable.app`
3. **Domaine personnalisé** : Configurable dans Lovable Settings

**Aucune action manuelle requise** ✅

### Option 2 : Vercel

```bash
# Installer Vercel CLI
npm i -g vercel

# Premier déploiement
vercel

# Déploiement production
vercel --prod
```

**Configuration Vercel** :
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

**Variables d'environnement Vercel** :
Ajouter `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` dans Settings → Environment Variables

### Option 3 : Netlify

```bash
# Installer Netlify CLI
npm i -g netlify-cli

# Déploiement
netlify deploy --prod
```

**netlify.toml** :
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 4 : Auto-hébergement (Nginx)

**Nginx configuration** :

```nginx
server {
    listen 80;
    server_name emotionscare.com;

    # Redirect to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name emotionscare.com;

    ssl_certificate /etc/letsencrypt/live/emotionscare.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/emotionscare.com/privkey.pem;

    root /var/www/emotionscare/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
}
```

**Déploiement** :
```bash
# Build
npm run build

# Copier sur le serveur
scp -r dist/* user@server:/var/www/emotionscare/dist/

# Redémarrer Nginx
ssh user@server "sudo systemctl restart nginx"
```

---

## Edge Functions

### Déploiement automatique

Les Edge Functions dans `/supabase/functions/` sont **automatiquement déployées** par Lovable.

### Déploiement manuel (si nécessaire)

```bash
# Déployer une fonction spécifique
npx supabase functions deploy function-name

# Déployer toutes les fonctions
npx supabase functions deploy
```

### Vérification

```bash
# Logs en temps réel
npx supabase functions serve function-name

# Tester localement
curl -X POST \
  http://localhost:54321/functions/v1/function-name \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -d '{"test": "data"}'
```

---

## Post-Déploiement

### 1. Health Checks

**Endpoints à vérifier** :
- ✅ `https://your-domain.com` → Page d'accueil
- ✅ `https://your-domain.com/auth` → Login page
- ✅ `https://your-domain.com/dashboard` → Dashboard (auth required)
- ✅ `https://yaincoxihiqdksxgrsrk.supabase.co` → API Supabase

**Edge Functions** :
```bash
# Test delete-user-data
curl -X POST \
  https://yaincoxihiqdksxgrsrk.supabase.co/functions/v1/delete-user-data \
  -H "Authorization: Bearer USER_JWT"
```

### 2. Monitoring Setup

**Uptime monitoring** :
- UptimeRobot : Ping toutes les 5 minutes
- BetterUptime : Alertes Slack/Email
- Status page : `status.emotionscare.com`

**Error tracking** :
- Sentry DSN configuré
- Source maps uploadées
- Alertes configurées pour erreurs critiques

**Performance** :
- Lighthouse CI : Score > 90
- Core Web Vitals : Verts
- Bundle size : < 800KB

### 3. SEO

**Vérifications** :
- ✅ `robots.txt` accessible
- ✅ `sitemap.xml` soumis à Google Search Console
- ✅ Meta tags présents sur toutes les pages
- ✅ Open Graph tags configurés
- ✅ Schema.org markup (si applicable)

### 4. Analytics

**Google Analytics** (optionnel) :
```html
<!-- Dans index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## Rollback Procédure

### En cas de problème critique en production

**1. Rollback immédiat (Vercel/Netlify)** :
```bash
# Vercel
vercel rollback

# Netlify
netlify rollback
```

**2. Rollback Supabase migrations** :
```sql
-- Lister les migrations
SELECT * FROM supabase_migrations.schema_migrations;

-- Rollback dernière migration
-- (nécessite migration down script)
```

**3. Rollback Edge Functions** :
- Dashboard Supabase → Edge Functions
- Sélectionner version précédente
- Redéployer

**4. Communication** :
- Status page update
- Email aux utilisateurs si nécessaire
- Post-mortem après résolution

---

## Checklist de Déploiement

### Pré-déploiement
- [ ] Tests E2E passent (Playwright)
- [ ] Tests unitaires passent (si existants)
- [ ] Pas d'erreurs console
- [ ] Build production réussi
- [ ] Variables d'environnement configurées
- [ ] Secrets Supabase ajoutés
- [ ] RLS policies vérifiées
- [ ] Migrations appliquées

### Déploiement
- [ ] Build déployé
- [ ] Edge Functions déployées
- [ ] DNS configuré (si nouveau domaine)
- [ ] SSL/TLS actif
- [ ] Redirections HTTP → HTTPS

### Post-déploiement
- [ ] Health checks OK
- [ ] Authentication fonctionne
- [ ] API calls réussissent
- [ ] Monitoring actif
- [ ] Logs accessibles
- [ ] Backup configuré
- [ ] Status page à jour

### Documentation
- [ ] CHANGELOG.md mis à jour
- [ ] Version taggée dans Git
- [ ] Documentation utilisateur à jour
- [ ] Équipe notifiée

---

## Maintenance

### Mises à jour régulières

**Hebdomadaire** :
- Vérifier les logs d'erreurs
- Monitorer les performances
- Vérifier l'uptime

**Mensuel** :
- Mettre à jour les dépendances npm
- Vérifier les CVE sécurité
- Audit Lighthouse
- Backup manuel de la DB

**Trimestriel** :
- Revue complète de sécurité
- Audit RLS policies
- Nettoyage des données obsolètes
- Mise à jour de la documentation

---

## Rollback Procédure d'Urgence

### En cas de problème critique

**1. Rollback Git immédiat** :
```bash
git revert HEAD
git push origin main
```

**2. Rollback hébergeur** :
```bash
# Vercel
vercel rollback

# Netlify  
netlify rollback

# Lovable: via le dashboard (historique des déploiements)
```

**3. Rollback Supabase migrations** :
- Dashboard Supabase → Database → Migrations
- Identifier la migration problématique
- Exécuter le script de rollback SQL

**4. Communication** :
- Mettre à jour la status page
- Notifier les utilisateurs si impact majeur
- Documenter l'incident pour post-mortem

## Performance Optimization

### Bundle Size

```bash
# Analyser le bundle
npm run build -- --analyze

# Objectifs:
# - Initial bundle: < 500KB gzipped
# - Lazy-loaded chunks: < 200KB each
```

### Caching Strategy

```nginx
# Cache statique agressif
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# API calls: pas de cache
location /api {
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}
```

### CDN Configuration

Si utilisation d'un CDN (Cloudflare, etc.) :
- Activer la minification automatique (JS, CSS, HTML)
- Configurer le cache selon le type de ressource
- Activer HTTP/2 et HTTP/3
- Utiliser Brotli compression

## Security Hardening

### Content Security Policy

```html
<meta http-equiv="Content-Security-Policy" 
  content="
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net;
    style-src 'self' 'unsafe-inline';
    img-src 'self' data: https:;
    connect-src 'self' https://*.supabase.co;
    font-src 'self' data:;
  ">
```

### Security Headers

À configurer sur le serveur/hébergeur :

```
Strict-Transport-Security: max-age=31536000; includeSubDomains
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

## Disaster Recovery

### Backup Strategy

**Base de données** :
- Backup automatique Supabase : Quotidien (7 jours)
- Backup manuel mensuel : Export SQL complet
- Stockage off-site : AWS S3 ou équivalent

**Code** :
- Git repository principal
- Git mirror sur serveur backup
- Tags pour chaque version de production

**Procédure de restauration** :
1. Identifier la dernière version stable
2. Restaurer depuis backup DB
3. Redéployer la version de code correspondante
4. Vérifier l'intégrité des données
5. Tester les fonctionnalités critiques

## Support

- **Support technique** : support@wellspringofcare.com
- **Issues critiques** : GitHub Issues (priority label)
- **Documentation** : `/docs` ou site de documentation dédié
- **Status page** : status.wellspringofcare.com (recommandé)
- **Équipe DevOps** : Contact direct pour urgences

---

**Version** : 1.0.0  
**Dernière mise à jour** : Octobre 2025  
**Status** : Production Ready  
**Prochaine revue** : Janvier 2026
