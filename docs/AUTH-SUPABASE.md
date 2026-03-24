# Authentification Supabase – Guide technique

## Vue d’ensemble

L’authentification est gérée par **Supabase Auth** : inscription (email + mot de passe), connexion et déconnexion. L’état (utilisateur courant) est centralisé dans un **AuthContext** et les pages protégées passent par un composant **ProtectedRoute**.

---

## Fichiers créés ou modifiés

### 1. `src/lib/supabaseClient.ts`

- **Rôle** : client Supabase unique pour toute l’app (navigateur).
- **Contenu** : `createClient(supabaseUrl, supabaseAnonKey)` avec `import.meta.env.VITE_SUPABASE_URL` et `import.meta.env.VITE_SUPABASE_ANON_KEY`.
- **Sécurité** : si une des deux variables manque, une erreur est levée au chargement. La clé anon est faite pour être utilisée côté client ; la protection des données se fait via les politiques RLS dans Supabase.

---

### 2. `src/context/AuthContext.tsx`

- **Rôle** : fournir l’état d’auth (utilisateur, session, chargement) et les actions (signUp, signIn, signOut) à toute l’app.
- **Comportement** :
  - Au montage, `supabase.auth.getSession()` initialise `user` et `session`.
  - `supabase.auth.onAuthStateChange()` met à jour `user`/`session` à chaque connexion/déconnexion/rafraîchissement de token.
  - `signUp(email, password)` appelle `supabase.auth.signUp()` et retourne `{ error }`.
  - `signIn(email, password)` appelle `supabase.auth.signInWithPassword()` et retourne `{ error }`.
  - `signOut()` appelle `supabase.auth.signOut()`.
- **Usage** : tout composant qui a besoin de l’auth utilise le hook `useAuth()` (il doit être sous `AuthProvider`).

---

### 3. `src/pages/Login.tsx`

- **Rôle** : page de connexion (email + mot de passe).
- **Validation** : `react-hook-form` + `zod` (email requis et valide, mot de passe requis).
- **Comportement** : à la soumission, `signIn(email, password)` ; en cas de succès, toast puis `navigate(from)` avec `from = location.state?.from?.pathname ?? "/account"` (redirection vers la page demandée ou `/account`).
- **Liens** : lien vers `/signup` pour créer un compte.

---

### 4. `src/pages/Signup.tsx`

- **Rôle** : page d’inscription (email + mot de passe + confirmation).
- **Validation** : `react-hook-form` + `zod` (email valide, mot de passe min 6 caractères, confirmation identique).
- **Comportement** : à la soumission, `signUp(email, password)` ; en cas de succès, toast puis redirection vers `/login`.
- **Note** : selon la config Supabase, un email de confirmation peut être envoyé ; dans ce cas l’utilisateur doit confirmer avant de se connecter.

---

### 5. `src/components/ProtectedRoute.tsx`

- **Rôle** : n’afficher les `children` que si l’utilisateur est connecté.
- **Comportement** :
  - Si `loading` (session en cours de chargement) : affichage d’un message « جاري التحميل... ».
  - Si pas de `user` : `<Navigate to="/login" state={{ from: location }} replace />` pour renvoyer vers la page de login en gardant la page d’origine (pour redirection après connexion).
  - Sinon : rendu des `children`.

---

### 6. `src/pages/Account.tsx`

- **Rôle** : tableau de bord utilisateur (page « Mon compte »).
- **Contenu** : affichage de l’email (`user?.email`), bouton « تسجيل الخروج » qui appelle `signOut()`.
- **Accès** : route `/account` enveloppée dans `ProtectedRoute` dans `App.tsx`.

---

### 7. `src/pages/Orders.tsx`

- **Rôle** : page « Mes commandes » (placeholder pour plus tard).
- **Accès** : route `/orders` protégée par `ProtectedRoute`.

---

### 8. `App.tsx` (modifications)

- **AuthProvider** : enveloppe toute l’app pour que `useAuth()` soit disponible partout.
- **Nouvelles routes** :
  - `/login` → `Login`
  - `/signup` → `Signup`
  - `/account` → `ProtectedRoute` → `Account`
  - `/orders` → `ProtectedRoute` → `Orders`

---

### 9. `src/components/Header.tsx` (modifications)

- **useAuth()** : récupère `user`, `loading`, `signOut`.
- **Si non connecté** : lien « تسجيل الدخول » vers `/login`.
- **Si connecté** : liens « حسابي » (`/account`) et « طلباتي » (`/orders`), puis bouton « خروج » qui appelle `signOut()`.

---

### 10. Variables d’environnement

- **Fichier** : `.env` (à la racine du projet). Ne pas committer les vraies clés si le repo est public.
- **Variables** :
  - `VITE_SUPABASE_URL` : URL du projet Supabase (ex. `https://xxx.supabase.co`).
  - `VITE_SUPABASE_ANON_KEY` : clé anonyme Supabase (côté client).
- **`.env.example`** : contient des placeholders pour ces deux variables ; à copier en `.env` et à remplir avec vos valeurs.

---

## Flux d’authentification

1. **Inscription** : l’utilisateur va sur `/signup`, remplit email + mot de passe + confirmation. Soumission → `signUp()` → redirection vers `/login` (et éventuellement email de confirmation Supabase).
2. **Connexion** : l’utilisateur va sur `/login` (ou est redirigé par `ProtectedRoute`). Il saisit email + mot de passe. Soumission → `signIn()` → mise à jour de l’état dans `AuthContext` → redirection vers `from` (ex. `/account`) ou `/account`.
3. **État global** : `AuthProvider` s’abonne à `onAuthStateChange`. À chaque changement (login, logout, refresh token), `user` et `session` sont mis à jour et tous les composants qui utilisent `useAuth()` se mettent à jour (Header, ProtectedRoute, etc.).
4. **Pages protégées** : accéder à `/account` ou `/orders` sans être connecté → redirection vers `/login` avec `state.from` → après connexion, redirection vers la page demandée.
5. **Déconnexion** : clic sur « خروج » dans le header (ou bouton dans Account) → `signOut()` → Supabase supprime la session → `onAuthStateChange` déclenche → `user` devient `null` → le header affiche à nouveau « تسجيل الدخول ».

---

## Dépendances

- `@supabase/supabase-js` : client Supabase (Auth utilisé ici).
- `react-hook-form` + `@hookform/resolvers` + `zod` : déjà présents dans le projet pour les formulaires Login/Signup.

Aucune autre dépendance n’a été ajoutée pour l’auth.
