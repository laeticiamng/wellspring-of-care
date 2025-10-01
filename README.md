# Wellspring of Care 💙

Une plateforme innovante de bien-être mental combinant IA, gamification et thérapies digitales pour accompagner chaque utilisateur dans son parcours émotionnel.

## 🎯 Vision

**"Prendre soin de soi, ensemble."**

Wellspring of Care transforme le suivi du bien-être mental en une expérience engageante, personnalisée et accessible, alliant science, technologie et bienveillance.

## ✨ Fonctionnalités Principales

### 🫧 Modules Thérapeutiques
- **Nyvée** - Bulle respirante interactive avec biofeedback
- **Scan Émotionnel** - Détection IA via Hume (audio/vidéo)
- **Thérapie Musicale** - Génération Suno adaptée à l'émotion
- **Coach IA** - Assistant GPT-4 pour support émotionnel
- **Journal** - Écriture thérapeutique avec analyse
- **Méditation** - Sessions guidées personnalisées

### 🎮 Gamification
- **Flash Glow** - Flash cards émotionnelles gamifiées
- **Boss Level Grit** - Combats contre émotions difficiles
- **Bubble Beat** - Jeu de rythme thérapeutique
- **Ambition Arcade** - Quêtes d'objectifs personnels
- **Mood Mixer** - DJ de création musicale émotionnelle

### 🌌 Expériences Immersives
- **VR Breath** - Respiration immersive océanique
- **VR Galaxy** - Exploration galactique apaisante
- **Screen Silk** - Cinéma thérapeutique interactif
- **Story Synth** - Narration immersive personnalisée

### 📊 Suivi & Insights
- **Weekly Bars** - Jardin des saisons évolutif
- **Leaderboard** - Système d'auras communautaires
- **Analytics** - Insights personnalisés et patterns
- **Export** - Rapports PDF/JSON/CSV

### 👥 Social & Community
- **Hub Social** - Feed communautaire bienveillant
- **Support Groups** - Groupes de soutien thématiques
- **Partage Anonyme** - Expression libre et sécurisée

### 🔐 Sécurité & Confidentialité
- **2FA** - Authentification à deux facteurs
- **RGPD** - Export & suppression données
- **Sessions** - Gestion sécurisée
- **Audit Logs** - Traçabilité complète

## 🚀 Technologies

### Frontend
- **React 18** + TypeScript
- **Vite** - Build ultra-rapide
- **Tailwind CSS** - Design system
- **shadcn/ui** - Composants accessibles
- **Framer Motion** - Animations fluides
- **PWA** - Installation mobile

### Backend
- **Supabase** - PostgreSQL + Edge Functions
- **Row Level Security** - Protection données
- **Real-time** - Synchronisation live

### IA & Intégrations
- **OpenAI GPT-4** - Coach conversationnel
- **Hume AI** - Détection émotions
- **Suno API** - Génération musicale
- **Stripe** - Paiements B2B

## 📦 Installation

```bash
# Cloner le repo
git clone <YOUR_GIT_URL>
cd wellspring-of-care

# Installer les dépendances
npm install

# Configurer les variables d'environnement
# Éditer avec vos clés Supabase
# VITE_SUPABASE_URL et VITE_SUPABASE_ANON_KEY

# Lancer en dev
npm run dev
```

## 🔧 Configuration

### Variables d'environnement

Le projet utilise Supabase et nécessite :
- `VITE_SUPABASE_URL` - URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` - Clé anonyme publique

### Secrets Supabase (Edge Functions)

Configurez dans Supabase Dashboard > Settings > Edge Functions :
- `OPENAI_API_KEY` - Pour le coach IA
- `HUME_API_KEY` - Pour la détection émotionnelle
- `SUNO_API_KEY` - Pour la génération musicale
- `STRIPE_SECRET_KEY` - Pour les paiements B2B

## 📖 Documentation

- [Guide Technique](docs/TECHNICAL_DOCS.md) - Architecture et stack
- [Guide Déploiement](docs/DEPLOYMENT.md) - Instructions de déploiement
- [Guide Utilisateur](docs/USER_GUIDE.md) - Utilisation de la plateforme
- [Sécurité](SECURITY.md) - Politique de sécurité
- [Complétion Projet](PROJECT_COMPLETION.md) - État du projet

## 🏗️ Structure du Projet

```
wellspring-of-care/
├── src/
│   ├── components/      # Composants React réutilisables
│   ├── hooks/          # Hooks customs (38+)
│   ├── pages/          # Pages de l'app (45+)
│   ├── contexts/       # Contexts React
│   ├── lib/            # Utilitaires
│   ├── utils/          # Helpers
│   └── integrations/   # Intégrations Supabase
├── supabase/
│   ├── functions/      # Edge Functions (23)
│   ├── migrations/     # Migrations DB
│   └── config.toml     # Configuration Supabase
├── public/             # Assets statiques + PWA
├── docs/              # Documentation complète
└── tests/             # Tests Playwright E2E
```

## 🎨 Design System

### Palette de Couleurs (HSL)
- **Primary**: Blue vibrant (210 100% 50%)
- **Secondary**: Teal apaisant (180 50% 45%)
- **Accent**: Purple énergisant (280 70% 60%)
- **Calm**: Green calme (160 40% 50%)

### Composants UI
- Buttons, Cards, Dialogs, Forms
- Navigation, Tabs, Menus
- Charts, Stats, Progress
- Animations & Transitions fluides

## 📱 Progressive Web App

L'app est installable sur mobile et desktop :
- ✅ Mode standalone
- ✅ Offline fallback
- ✅ Service Worker actif
- ✅ Cache intelligent
- ✅ Icônes adaptatives

**Installation** :
- Mobile : "Ajouter à l'écran d'accueil"
- Desktop : Bouton "Installer" dans la barre d'URL

## 🔒 Sécurité

- **RLS** sur toutes les tables sensibles (156+ policies)
- **2FA/TOTP** disponible pour tous les utilisateurs
- **HTTPS** only en production
- **Rate limiting** automatique via fonctions SQL
- **Audit logs** complets pour traçabilité
- **RGPD** compliant (export, suppression, consentement)

## 🧪 Tests

```bash
# Tests E2E Playwright
npm run test:e2e

# Linter ESLint
npm run lint

# Type checking
npm run type-check
```

## 🚀 Déploiement

### Développement Local
```bash
npm run dev
# Ouvre http://localhost:5173
```

### Build Production
```bash
npm run build
# Génère ./dist pour déploiement
```

### Déploiement Automatique
- Via [Lovable](https://lovable.dev/projects/be449196-dad9-4601-9456-d2614feca181)
- Click "Share → Publish"
- Custom domain disponible dans Settings > Domains

### Déploiement Manuel
```bash
# Après npm run build
# Upload dist/ vers votre hébergeur
# Netlify, Vercel, ou serveur statique
```

## 📈 Métriques Projet

| Catégorie | Nombre |
|-----------|--------|
| **Database** ||
| Tables créées | 87 |
| Fonctions DB | 29 |
| RLS Policies | 156+ |
| Indexes | 24 |
| **Backend** ||
| Edge Functions | 23 |
| **Frontend** ||
| Pages | 45+ |
| Components | 120+ |
| Hooks customs | 38 |
| **Features** ||
| Modules thérapeutiques | 15 |

## 📈 Roadmap

### V1.1 (Q1 2026)
- [ ] Push notifications mobiles
- [ ] Multi-langue (EN, ES)
- [ ] Tests A/B design
- [ ] Apple Health / Google Fit

### V1.2 (Q2 2026)
- [ ] App mobile native (React Native)
- [ ] Chatbot vocal
- [ ] Thérapie de groupe vidéo
- [ ] API publique documentée

### V2.0 (Q3 2026)
- [ ] IA prédictive avancée
- [ ] VR/AR natif (Quest, Vision Pro)
- [ ] Télémédecine intégrée
- [ ] White-label B2B2C

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

### Guidelines
- Code en TypeScript strict
- Tests pour nouvelles fonctionnalités
- Documentation à jour
- UI/UX accessible (WCAG 2.1 AA)

## 📄 Licence

Ce projet est sous licence propriétaire. Tous droits réservés.

Pour toute utilisation commerciale ou redistribution, contactez l'équipe.

## 👥 Équipe

- **Product Lead**: À définir
- **Tech Lead**: À définir
- **UX Designer**: À définir
- **Développement**: Lovable AI + Équipe Wellspring of Care

## 📞 Contact & Support

- **Email**: contact@wellspringofcare.com
- **Discord**: [Lien communauté] (à venir)
- **Twitter**: [@WellspringCare](https://twitter.com/WellspringCare)
- **Documentation**: [docs.wellspringofcare.com](https://docs.wellspringofcare.com)

## 🙏 Remerciements

Un grand merci à :
- **Supabase** pour l'infrastructure backend
- **OpenAI** pour l'IA conversationnelle
- **Hume AI** pour la détection émotionnelle
- **Suno** pour la génération musicale
- **shadcn/ui** pour les composants accessibles
- **Lovable** pour l'environnement de développement
- La **communauté open source** pour l'inspiration

## 🔗 Liens Utiles

- [Projet Lovable](https://lovable.dev/projects/be449196-dad9-4601-9456-d2614feca181)
- [Documentation Technique](docs/TECHNICAL_DOCS.md)
- [Guide Déploiement](docs/DEPLOYMENT.md)
- [Politique de Sécurité](SECURITY.md)
- [État du Projet](PROJECT_COMPLETION.md)

---

**Version**: 1.0.0  
**Status**: Production Ready ✅  
**Dernière mise à jour**: 1 Octobre 2025

*"Ensemble, prenons soin de notre bien-être mental."* 💙
