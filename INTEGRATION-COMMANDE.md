# 📦 Intégration du Système de Commande avec Envoi d'Email

## ✅ Ce qui a été fait

### 1. **Formulaire de Commande (CheckoutForm.tsx)**
- ✅ Formulaire complet avec validation
- ✅ Champs : Nom, Téléphone, Wilaya, Commune
- ✅ Sélection du type de livraison (Domicile / Stop Desk)
- ✅ Calcul automatique du prix de livraison
- ✅ Calcul du total (produit + livraison)
- ✅ Envoi des données à Netlify Forms (backup)
- ✅ Envoi des données à la fonction Netlify pour l'email
- ✅ Messages d'erreur en français/arabe
- ✅ Code dupliqué nettoyé
- ✅ Gestion des erreurs améliorée

### 2. **Fonction Netlify (send-order.ts)**
- ✅ Fonction d'envoi d'email avec Nodemailer
- ✅ Configuration Gmail prête
- ✅ Email HTML professionnel avec tous les détails
- ✅ Headers CORS configurés
- ✅ Gestion d'erreurs complète
- ✅ Formatage des prix amélioré (avec séparateurs de milliers)
- ✅ Validation des variables d'environnement

### 3. **Données Wilayas/Communes**
- ✅ 58 wilayas complètes avec toutes leurs communes
- ✅ Fichier `src/data/communes.ts` à jour
- ✅ Intégration dans le formulaire

## 🔧 Comment ça fonctionne

### Flux de commande

1. **Le client remplit le formulaire** sur la page d'accueil
   - Sélectionne sa wilaya
   - Sélectionne sa commune
   - Choisit le type de livraison
   - Voit le prix total calculé automatiquement

2. **Soumission du formulaire**
   - Les données sont envoyées à **Netlify Forms** (backup dans le dashboard)
   - Les données sont envoyées à la fonction **`/.netlify/functions/send-order`**
   - La fonction Netlify envoie un email à `yacinemed2020@gmail.com`

3. **Réception de l'email**
   - Vous recevez un email HTML professionnel avec :
     - Informations client (Nom, Téléphone, Adresse)
     - Détails de la commande (Produit, Prix, Quantité)
     - Prix de livraison
     - Total à payer
     - Appel à l'action pour contacter le client

### Structure des fichiers

```
rayane-shop/
├── netlify/
│   ├── functions/
│   │   └── send-order.ts          # Fonction d'envoi email
│   └── netlify.toml               # Configuration Netlify
├── src/
│   ├── components/
│   │   └── CheckoutForm.tsx       # Formulaire de commande
│   └── data/
│       ├── communes.ts            # 58 wilayas + communes
│       └── deliveryRates.ts       # Tarifs de livraison
└── CONFIGURATION-EMAIL.md         # Guide de configuration
```

## 🚀 Configuration requise sur Netlify

### Étape 1 : Créer un mot de passe d'application Gmail

1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Cliquez sur **Sécurité**
3. Activez la **Validation en deux étapes** (si pas déjà activée)
4. Allez dans **Mots de passe d'application**
5. Sélectionnez **Mail** et **Autre (nom personnalisé)**
6. Entrez "Rayan Shop Netlify"
7. Cliquez sur **Générer**
8. **Copiez le mot de passe** (16 caractères) - vous ne pourrez plus le voir !

### Étape 2 : Ajouter les variables d'environnement dans Netlify

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Sélectionnez votre site
3. Allez dans **Site settings** > **Environment variables**
4. Cliquez sur **Add a variable**

#### Ajoutez ces 2 variables :

**Variable 1 :**
- **Key:** `EMAIL_USER`
- **Value:** `yacinemed2020@gmail.com`
- Cochez "Contains secret values" (recommandé)

**Variable 2 :**
- **Key:** `EMAIL_PASS`
- **Value:** `[Le mot de passe d'application de 16 caractères]`
- **IMPORTANT:** Cochez "Contains secret values"

5. Cliquez sur **Create variable** pour chaque variable

### Étape 3 : Redéployer le site

1. Dans Netlify, allez dans **Deploys**
2. Cliquez sur **Trigger deploy** > **Clear cache and deploy site**
3. Attendez la fin du déploiement (2-3 minutes)

## 🧪 Tester le système

### Test local (développement)

1. Installez les dépendances :
   ```bash
   npm install
   ```

2. Créez un fichier `.env.local` à la racine :
   ```
   EMAIL_USER=yacinemed2020@gmail.com
   EMAIL_PASS=votre_mot_de_passe_application
   ```

3. Démarrez le serveur de développement :
   ```bash
   npm run dev
   ```

4. Testez le formulaire sur `http://localhost:5173`

### Test en production

1. Allez sur votre site déployé sur Netlify
2. Remplissez le formulaire de commande avec des données de test
3. Soumettez la commande
4. Vérifiez que vous recevez l'email à `yacinemed2020@gmail.com`
5. Vérifiez aussi dans le dashboard Netlify > Forms que la soumission apparaît

## 📧 Exemple d'email reçu

L'email que vous recevrez ressemblera à ceci :

```
📦 Nouvelle Commande !

👤 Informations Client
Nom: Ahmed Benali
Téléphone: 0555123456
Adresse: Hydra, 16-Alger
Livraison: 🏠 À Domicile

🛒 Détails de la commande
Produit                    Prix
Secret Lift (x1)           5,990 DA
Livraison                  400 DA
──────────────────────────────
Total                      6,390 DA

⚡ Action requise: Contactez le client au 0555123456 pour confirmer la commande.
```

## 🔍 Dépannage

### Les emails ne sont pas envoyés

1. **Vérifiez les logs Netlify Functions**
   - Dashboard Netlify > Functions > send-order > Logs
   - Recherchez les erreurs

2. **Vérifiez les variables d'environnement**
   - Elles doivent être présentes dans Netlify
   - Le site doit être redéployé après leur ajout

3. **Erreurs courantes :**

   - **"Configuration email manquante"**
     - Les variables `EMAIL_USER` et `EMAIL_PASS` ne sont pas configurées
     - Solution : Ajoutez-les dans Netlify et redéployez

   - **"Invalid login"**
     - Le mot de passe d'application est incorrect
     - Solution : Créez un nouveau mot de passe d'application

   - **"Less secure app access"**
     - Vous utilisez votre mot de passe normal au lieu d'un mot de passe d'application
     - Solution : Utilisez un mot de passe d'application (voir Étape 1)

### Le formulaire ne se soumet pas

1. **Vérifiez la console du navigateur**
   - Ouvrez les outils de développement (F12)
   - Regardez l'onglet Console pour les erreurs

2. **Vérifiez que tous les champs sont remplis**
   - Le formulaire a des champs obligatoires

3. **Vérifiez la connexion réseau**
   - La fonction Netlify nécessite une connexion internet

## 📊 Monitoring

### Netlify Forms
- Dashboard Netlify > Forms
- Voir toutes les soumissions de commandes
- Exporter en CSV

### Netlify Functions
- Dashboard Netlify > Functions > send-order
- Voir les logs d'exécution
- Voir les métriques (temps d'exécution, erreurs)

### Gmail
- Vérifiez votre boîte de réception
- Vérifiez aussi le dossier spam

## ✅ Checklist finale

- [x] Formulaire de commande créé et intégré
- [x] Fonction Netlify créée pour l'envoi d'email
- [x] Code nettoyé et optimisé
- [x] Gestion d'erreurs implémentée
- [ ] Validation en deux étapes activée sur Gmail
- [ ] Mot de passe d'application Gmail créé
- [ ] Variable `EMAIL_USER` ajoutée dans Netlify
- [ ] Variable `EMAIL_PASS` ajoutée dans Netlify
- [ ] Site redéployé sur Netlify
- [ ] Test de commande effectué
- [ ] Email reçu à `yacinemed2020@gmail.com`

## 🎉 Résultat

Une fois tout configuré, à chaque commande :

1. ✅ Le client voit un message de confirmation
2. ✅ Les données sont sauvegardées dans Netlify Forms
3. ✅ Vous recevez un email avec tous les détails
4. ✅ Vous pouvez contacter le client pour confirmer

---

**Besoin d'aide ?** Vérifiez les logs Netlify Functions pour plus de détails.

