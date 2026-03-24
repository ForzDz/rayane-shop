# Rapport technique – Rayane Shop (Rayan shop)

## 1. Frontend

### Framework
- **Vite 5** + **React 18** (build et dev server).
- **TypeScript** (tsconfig avec `paths` `@/*` → `./src/*`).
- **React Router DOM v6** pour le routage (/, /contact, /merci, *).

### Système CSS
- **Tailwind CSS 3** avec `tailwindcss-animate`, `@tailwindcss/typography`.
- Variables CSS (HSL) dans `src/index.css` pour le design system (couleurs, radius, ombres).
- Pas de CSS Modules ; tout passe par Tailwind et classes utilitaires.
- Fichier de config : `tailwind.config.ts`, `postcss.config.js`.

### Bibliothèques UI
- **shadcn/ui** (composants basés sur **Radix UI**) : Button, Input, Label, Select, Dialog, Toast, Tabs, Card, etc. (`src/components/ui/`).
- **Radix UI** : Accordion, Alert Dialog, Avatar, Checkbox, Dialog, Dropdown, Popover, Select, Tabs, Toast, Tooltip, etc.
- **Lucide React** pour les icônes.
- **class-variance-authority (cva)** + **clsx** + **tailwind-merge** pour les variantes de composants et le merge de classes (`src/lib/utils.ts`).
- **Sonner** pour les toasts additionnels.
- **Motion** (ex-Framer Motion) pour les animations.
- **GSAP** + **Locomotive Scroll** (hooks dans `useGSAP.tsx`).
- **Embla Carousel** pour les carrousels.
- **Recharts** pour les graphiques.
- **react-hook-form** + **@hookform/resolvers** + **Zod** pour la validation de formulaires.

### Structure du projet (frontend)

```
src/
├── App.tsx                 # Routes, providers (Query, Router, Toaster)
├── main.tsx
├── index.css               # Tailwind + variables design system
├── components/
│   ├── ui/                  # shadcn (Button, Input, Card, etc.)
│   ├── CheckoutForm.tsx     # Formulaire commande (Google Sheets)
│   ├── Contact form         # Via FormField + page Contact
│   ├── Header.tsx, Footer.tsx
│   ├── WhatsAppButton.tsx, OrderNowButton.tsx
│   ├── CustomerReviews.tsx, TestimonialsDemo.tsx
│   └── ...
├── pages/
│   ├── Home.tsx             # Produit principal + CheckoutForm
│   ├── Contact.tsx
│   ├── ThankYou.tsx (merci)
│   └── NotFound.tsx
├── services/
│   ├── googlesheets.service.ts   # Envoi commandes → Make.com webhook
│   └── zrexpress.service.ts      # Alternative ZRExpress (retry, validation)
├── data/
│   ├── products.ts          # Catalogue statique
│   ├── communes.ts          # Wilayas/communes Algérie
│   └── deliveryRates.ts     # Tarifs livraison par wilaya
├── types/
│   ├── product.ts
│   └── zrexpress.types.ts
├── hooks/                   # useToast, useForm, use-mobile, useGSAP
└── lib/utils.ts
```

---

## 2. Dépendances (package.json)

### Principales

| Package | Rôle |
|--------|------|
| **react**, **react-dom** | UI |
| **react-router-dom** | Routage SPA |
| **vite** | Build et dev server |
| **@vitejs/plugin-react-swc** | Compilation React (SWC) |
| **typescript** | Typage |
| **tailwindcss**, **autoprefixer**, **postcss** | CSS |
| **tailwindcss-animate**, **@tailwindcss/typography** | Animations et prose |
| **@radix-ui/*** | Primitives accessibles (shadcn) |
| **class-variance-authority**, **clsx**, **tailwind-merge** | Variantes et classes |
| **lucide-react** | Icônes |
| **@tanstack/react-query** | Cache et requêtes côté client |
| **react-hook-form**, **@hookform/resolvers**, **zod** | Formulaires et validation |
| **motion** | Animations |
| **gsap**, **locomotive-scroll** | Animations avancées et scroll |
| **embla-carousel-react** | Carrousels |
| **recharts** | Graphiques |
| **sonner** | Toasts |
| **date-fns**, **react-day-picker** | Dates |
| **canvas-confetti** | Effets visuels |
| **nodemailer** | Envoi d’emails (côté Netlify uniquement) |
| **@netlify/functions** | Types pour les serverless Netlify |

Les autres paquets (cmdk, vaul, input-otp, etc.) sont utilisés par des composants UI ou des écrans spécifiques.

---

## 3. Backend

- Il n’y a **pas** de backend applicatif classique (pas de serveur Express/Node dédié dans le repo).
- **Netlify Functions** (serverless) :
  - **Fichier** : `netlify/functions/send-order.ts`
  - **Rôle** : recevoir un POST avec les données de commande et envoyer un email via **Nodemailer** (Gmail).
  - **Variables utilisées** : `process.env.EMAIL_USER`, `process.env.EMAIL_PASS`.
  - **Important** : cette fonction **n’est pas appelée** par le frontend actuel. Le checkout envoie les commandes à **Google Sheets via Make.com** (voir section 4). La fonction Netlify est donc une option “email” non branchée au flux actuel.

Résumé : **backend limité aux Netlify Functions** (une seule fonction, non utilisée par le checkout).

---

## 4. Connexions API et variables d’environnement

### API et services externes

| Où | Quoi | Variable / détail |
|----|------|-------------------|
| **CheckoutForm** | Envoi commande | `googleSheetsService.envoyerCommande()` → `fetch(VITE_MAKE_WEBHOOK_URL)` |
| **googlesheets.service.ts** | POST webhook Make.com | `import.meta.env.VITE_MAKE_WEBHOOK_URL` |
| **zrexpress.service.ts** | Idem (alternative avec retry) | `import.meta.env.VITE_MAKE_WEBHOOK_URL`, `VITE_ZREXPRESS_TIMEOUT` |
| **CheckoutForm** | Netlify Forms (optionnel) | `fetch("/", { method: "POST", ... })` pour le formulaire `order-form` |
| **Contact** | Soumission formulaire | Code Netlify Forms commenté ; en pratique pas d’appel API actif |
| **netlify/functions/send-order.ts** | Envoi email | `process.env.EMAIL_USER`, `process.env.EMAIL_PASS` (côté serveur) |

### Fichiers concernés

- **`src/services/googlesheets.service.ts`** : lecture de `VITE_MAKE_WEBHOOK_URL`, `fetch(this.MAKE_WEBHOOK_URL, { method: 'POST', ... })`.
- **`src/services/zrexpress.service.ts`** : même URL + `VITE_ZREXPRESS_TIMEOUT`, plusieurs `fetch(this.MAKE_WEBHOOK_URL, ...)` (envoi + test connexion).
- **`src/components/CheckoutForm.tsx`** : `fetch("/", ...)` pour Netlify Forms, puis `googleSheetsService.envoyerCommande(...)`.
- **`src/pages/Contact.tsx`** : soumission formulaire simulée ; appel Netlify commenté.

### Variables d’environnement

- **Côté client (Vite)** : préfixe `VITE_` obligatoire. Déclaration dans `.env.example` :
  - `VITE_MAKE_WEBHOOK_URL` (webhook Make.com)
  - `VITE_ZREXPRESS_TENANT_ID`, `VITE_ZREXPRESS_API_KEY`, `VITE_ZREXPRESS_BEARER_TOKEN`
  - `VITE_ZREXPRESS_TIMEOUT`
- **Côté Netlify (functions)** : `EMAIL_USER`, `EMAIL_PASS` (non préfixés VITE).

Problème de sécurité important : **`VITE_MAKE_WEBHOOK_URL` est exposée dans le bundle client** (toute personne peut voir l’URL du webhook et l’appeler). De plus, dans **`zrexpress.service.ts`** une URL de fallback est **en dur** (ligne 29) : `'https://hook.eu1.make.com/4ke5ajtsh13o93kksp5gyo6qt5qimqjj'` — à supprimer et à ne garder que la variable d’environnement.

---

## 5. Base de données

- **Aucune base de données** n’est utilisée dans le projet.
- Les produits viennent de **`src/data/products.ts`** (tableau statique importé).
- Les commandes sont envoyées vers **Make.com** (webhook) puis, selon le scénario Make, probablement vers **Google Sheets** ou un autre outil ; rien n’est persisté dans une DB côté projet.
- Wilayas/communes : **`src/data/communes.ts`** (données statiques).
- Tarifs livraison : **`src/data/deliveryRates.ts`** (statique).

---

## 6. Authentification

- **Aucun système d’authentification** : pas de login, pas de JWT, pas d’OAuth.
- Pas de routes protégées ni de gestion de session utilisateur.
- Le site est un one-page shop avec formulaire de commande et page contact, sans espace client.

---

## 7. Sécurité

### Problèmes identifiés

1. **URL webhook exposée côté client**  
   `VITE_MAKE_WEBHOOK_URL` est incluse dans le bundle. N’importe qui peut ouvrir les outils de dev et envoyer des requêtes POST vers ce webhook.

2. **URL de fallback en dur**  
   Dans `src/services/zrexpress.service.ts` (ligne 29) : une URL Make.com est codée en dur. Elle doit être supprimée ; n’utiliser que la variable d’environnement (sans valeur par défaut sensible).

3. **CORS Netlify**  
   `netlify/functions/send-order.ts` utilise `'Access-Control-Allow-Origin': '*'`. En production, restreindre à l’origine du site.

4. **`.env`**  
   À ne jamais committer. Vérifier qu’il est bien dans `.gitignore` (le rapport part du principe qu’il l’est).

5. **Pas de rate limiting**  
   Les appels au webhook depuis le client peuvent être abusés ; un proxy côté backend (ex. Netlify Function) avec rate limiting serait préférable.

6. **Meta Pixel**  
   `index.html` contient un ID Facebook/Meta Pixel en dur (1526117252457426). Pas une fuite de secret backend, mais donnée publique ; à gérer selon la politique de confidentialité.

### Points positifs

- Validation des données commande dans `zrexpress.service.ts` (validerCommande).
- Gestion d’erreurs et retry côté service.
- Pas de mots de passe ou tokens sensibles stockés dans le frontend (hormis l’URL du webhook).

---

## 8. Hébergement

- **Netlify** :
  - `netlify.toml` : `build` → `npm run build`, `publish` → `dist`, `functions` → `netlify/functions`, `NODE_VERSION = "18"`.
  - Redirection SPA : `/*` → `/index.html` (200).
- Déploiement typique : push sur le repo connecté à Netlify, build Vite, déploiement du dossier `dist` + déploiement des functions.
- Pas de configuration Vercel ou autre hébergeur dans le repo.

---

## 9. SEO

- **Meta tags** (dans `index.html`) : `title`, `description`, `author`, `keywords`, `theme-color`, `viewport`.
- **Open Graph** : `og:title`, `og:description`, `og:type`, `og:image`, `og:site_name`.
- **Twitter** : `twitter:card`, `twitter:site`, `twitter:image`.
- **Langue** : `lang="ar"` et `dir="rtl"` sur `<html>`.
- **robots.txt** (dans `public/`) : autorise tous les user-agents (Google, Bing, Twitter, Facebook, *).
- **Sitemap** : **aucun** fichier `sitemap.xml` (ou équivalent) détecté.
- Pas de balisage JSON-LD ou schema.org visible dans les fichiers analysés.

Recommandation : ajouter un `sitemap.xml` (au moins `/`, `/contact`, `/merci`) et, si besoin, un peu de structured data pour le produit principal.

---

## 10. Pistes d’amélioration (Supabase, sécurité, API)

### 10.1 Supprimer le secret du client : proxy par une Netlify Function

Au lieu d’appeler Make.com depuis le navigateur, appeler une function qui lit l’URL en env (non exposée) et fait le POST.

Exemple **`netlify/functions/submit-order.ts`** :

```ts
import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "" };
  }
  const webhookUrl = process.env.MAKE_WEBHOOK_URL;
  if (!webhookUrl) {
    return { statusCode: 500, body: JSON.stringify({ error: "Server configuration error" }) };
  }
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: event.body,
    });
    const data = await res.json().catch(() => ({}));
    return { statusCode: res.status, body: JSON.stringify(data) };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: "Request failed" }) };
  }
};

export { handler };
```

Côté frontend : remplacer l’appel direct au webhook par un `fetch('/.netlify/functions/submit-order', { method: 'POST', body: JSON.stringify(payload) })`. Ne plus utiliser `VITE_MAKE_WEBHOOK_URL` dans le client.

### 10.2 Supprimer l’URL en dur dans zrexpress.service.ts

```ts
// Remplacer
private readonly MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || 
  'https://hook.eu1.make.com/...';

// Par (si on garde encore l’appel client temporairement)
private readonly MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || '';
```

Et à terme, ne plus appeler le webhook depuis le client (voir 10.1).

### 10.3 Supabase : backend, auth et base

- **Base de données** : stocker les commandes dans une table `orders` (client, produit, quantité, wilaya, commune, adresse, total, statut, `created_at`, etc.) pour historique et suivi.
- **Auth** : Supabase Auth (email/magic link ou OAuth) si vous ajoutez un espace “mes commandes” ou un back-office minimal.
- **API** : soit des Edge Functions Supabase qui appellent Make.com / Google Sheets, soit une Netlify Function qui écrit dans Supabase puis déclenche Make (ou l’inverse selon le flux souhaité).

Exemple minimal **Supabase + commandes** (côté client, avec RLS désactivé ou policy ouverte pour l’insertion “anonyme” des commandes) :

```ts
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

```ts
// Envoi commande (après soumission formulaire)
const { data, error } = await supabase
  .from('orders')
  .insert({
    nom_client: formData.firstName,
    telephone: formData.phone,
    adresse: formData.deliveryType === 'stop_desk' ? null : address,
    wilaya: formData.wilaya,
    commune: formData.commune,
    produit: product.name,
    quantite: quantity,
    total_price: totalPrice,
    delivery_type: formData.deliveryType,
    status: 'new',
  })
  .select('id')
  .single();
```

Les clés Supabase (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`) sont faites pour être publiques ; les secrets (service_role, webhook Make) restent côté serveur (Netlify / Supabase Edge Functions).

### 10.4 Variables d’environnement

- **Netlify** : définir `MAKE_WEBHOOK_URL`, `EMAIL_USER`, `EMAIL_PASS` dans l’interface (Environment variables), jamais dans le repo.
- **Build** : ne mettre en `VITE_*` que ce qui doit être exposé au client (ex. Supabase URL/anon key). Pas l’URL du webhook Make.

### 10.5 Sitemap

Ajouter par exemple **`public/sitemap.xml`** :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://votredomaine.com/</loc><changefreq>weekly</changefreq></url>
  <url><loc>https://votredomaine.com/contact</loc><changefreq>monthly</changefreq></url>
  <url><loc>https://votredomaine.com/merci</loc><changefreq>yearly</changefreq></url>
</urlset>
```

---

## Résumé

| Élément | État |
|--------|------|
| **Stack projet** | Vite 5, React 18, TypeScript, Tailwind, shadcn/ui, React Router, React Query, données statiques (products, communes, deliveryRates). |
| **Backend** | Netlify Functions uniquement (1 fonction email `send-order` non utilisée par le checkout actuel). |
| **Base de données** | Aucune ; produits et config en fichiers statiques ; commandes envoyées vers Make.com (webhook). |
| **Authentification** | Aucune. |
| **Niveau de sécurité** | Moyen : URL webhook exposée côté client, URL de fallback en dur, CORS large ; pas de fuite de mots de passe. |
| **Hébergement** | Netlify (SPA + functions). |
| **SEO** | Meta + OG + Twitter + robots.txt OK ; pas de sitemap. |

### Recommandations prioritaires

1. **Sécurité** : ne plus exposer l’URL du webhook au client ; passer par une Netlify Function (proxy) et supprimer l’URL en dur dans `zrexpress.service.ts`.
2. **Données** : introduire Supabase (ou autre) pour persister les commandes et, si besoin, un flux “commande → DB → Make/Sheets”.
3. **SEO** : ajouter un `sitemap.xml`.
4. **Fonction email** : soit brancher `send-order` au flux de commande (en plus de Make), soit la supprimer pour éviter la confusion.
5. **Contact** : réactiver la soumission Netlify Forms (ou une function) pour la page Contact si vous voulez recevoir les messages.

---

*Rapport généré pour le projet rayane-shop.*
