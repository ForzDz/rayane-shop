# 🚀 Guide Complet - Configuration Netlify pour les Commandes

Ce guide vous explique **étape par étape** comment configurer votre site sur Netlify pour que les commandes fonctionnent et que vous receviez les emails.

## ✅ Vérification Préalable

Avant de commencer, vérifiez que :
- ✅ Votre code est sur GitHub/GitLab/Bitbucket
- ✅ Votre site est déjà déployé sur Netlify (ou vous avez un compte Netlify)
- ✅ Vous avez un compte Gmail

## 📋 Étape 1 : Créer un Mot de Passe d'Application Gmail

⚠️ **IMPORTANT** : Vous ne pouvez PAS utiliser votre mot de passe Gmail normal. Il faut créer un "mot de passe d'application".

### 1.1 Activer la Validation en Deux Étapes

1. Allez sur [myaccount.google.com](https://myaccount.google.com)
2. Cliquez sur **Sécurité** dans le menu de gauche
3. Cherchez **Validation en deux étapes**
4. Si elle n'est pas activée, activez-la maintenant (c'est obligatoire)
   - Suivez les instructions à l'écran
   - Vous aurez besoin de votre téléphone

### 1.2 Créer le Mot de Passe d'Application

1. Toujours dans **Sécurité**, allez dans **Mots de passe d'application**
   - Si vous ne voyez pas cette option, activez d'abord la validation en deux étapes
2. En bas de la page, cliquez sur **Sélectionner une application**
3. Choisissez **Mail**
4. Sélectionnez **Autre (nom personnalisé)**
5. Tapez : **Rayan Shop Netlify**
6. Cliquez sur **Générer**
7. **COPIEZ LE MOT DE PASSE** (16 caractères sans espaces)
   - ⚠️ **ATTENTION** : Vous ne pourrez plus voir ce mot de passe après ! Copiez-le dans un endroit sûr.

📝 **Exemple de mot de passe d'application** : `abcd efgh ijkl mnop` (16 caractères)

---

## 📋 Étape 2 : Configurer les Variables d'Environnement dans Netlify

### 2.1 Accéder aux Variables d'Environnement

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Connectez-vous à votre compte
3. Cliquez sur votre site (par exemple **rayane-shop31**)
4. Dans le menu de gauche, cliquez sur **Site settings**
5. Dans le sous-menu, cliquez sur **Environment variables**

### 2.2 Ajouter la Première Variable (EMAIL_USER)

1. Cliquez sur le bouton **Add a variable** (ou **Add variable**)
2. Remplissez les champs :
   - **Key** (Clé) : `EMAIL_USER`
   - **Value** (Valeur) : `yacinemed2020@gmail.com`
   - **Scopes** : Laissez par défaut (ou sélectionnez "All scopes")
   - Cochez **"Contains secret values"** (recommandé)
3. Cliquez sur **Create variable**

✅ **Vérification** : Vous devriez voir `EMAIL_USER` dans la liste

### 2.3 Ajouter la Deuxième Variable (EMAIL_PASS)

1. Cliquez à nouveau sur **Add a variable**
2. Remplissez les champs :
   - **Key** (Clé) : `EMAIL_PASS`
   - **Value** (Valeur) : **Collez ici le mot de passe d'application de 16 caractères** que vous avez copié à l'étape 1.2
   - **Scopes** : Laissez par défaut
   - ⚠️ **IMPORTANT** : Cochez **"Contains secret values"** (pour cacher le mot de passe)
3. Cliquez sur **Create variable**

✅ **Vérification** : Vous devriez voir les deux variables :
- `EMAIL_USER` = `yacinemed2020@gmail.com` (masqué)
- `EMAIL_PASS` = `************` (masqué)

---

## 📋 Étape 3 : Redéployer le Site

Une fois les variables ajoutées, il faut redéployer le site pour qu'elles soient prises en compte.

### Option A : Déclencher un Déploiement Manuel

1. Dans Netlify, allez dans l'onglet **Deploys** (en haut)
2. Cliquez sur **Trigger deploy**
3. Choisissez **Clear cache and deploy site**
4. Attendez 2-3 minutes que le déploiement se termine
5. Vous verrez un message "Published" quand c'est terminé

### Option B : Faire un Petit Changement dans le Code

Si votre site est connecté à GitHub :
1. Faites un petit changement dans un fichier (par exemple ajoutez un espace)
2. Committez et poussez sur GitHub
3. Netlify déploiera automatiquement

---

## 📋 Étape 4 : Vérifier la Configuration

### 4.1 Vérifier que la Fonction Netlify est Détectée

1. Dans Netlify, allez dans **Functions** (menu de gauche)
2. Vous devriez voir **send-order** dans la liste
3. Cliquez dessus pour voir les détails

### 4.2 Vérifier les Logs

1. Toujours dans **Functions** > **send-order**
2. Cliquez sur l'onglet **Logs**
3. Les logs apparaîtront quand quelqu'un passera une commande

---

## 🧪 Étape 5 : Tester le Système

### 5.1 Test avec de Vraies Données

1. Allez sur votre site déployé (votre URL Netlify)
2. Remplissez le formulaire de commande avec :
   - Nom : Votre nom de test
   - Téléphone : Votre numéro (pour recevoir l'appel de confirmation)
   - Wilaya : Choisissez une wilaya
   - Commune : Choisissez une commune
   - Type de livraison : Domicile ou Stop Desk
3. Cliquez sur **"اطلب الآن"** (Commander maintenant)
4. Vous devriez voir un message de confirmation

### 5.2 Vérifier l'Email

1. Allez dans votre boîte Gmail : [mail.google.com](https://mail.google.com)
2. Connectez-vous avec `yacinemed2020@gmail.com`
3. Vérifiez votre boîte de réception
4. Cherchez un email avec le sujet : **"🛍️ Nouvelle Commande de [Nom]"**
5. Si vous ne le voyez pas, vérifiez aussi le dossier **Spam/Courrier indésirable**

### 5.3 Vérifier les Logs Netlify

Si l'email n'arrive pas :
1. Retournez dans Netlify > **Functions** > **send-order** > **Logs**
2. Regardez les dernières lignes
3. Cherchez des erreurs en rouge

---

## 🔍 Dépannage

### ❌ Erreur : "Configuration email manquante"

**Cause** : Les variables d'environnement ne sont pas configurées ou le site n'a pas été redéployé.

**Solution** :
1. Vérifiez que `EMAIL_USER` et `EMAIL_PASS` sont bien dans Netlify > Environment variables
2. Redéployez le site (Étape 3)

---

### ❌ Erreur : "Invalid login" ou "Authentication failed"

**Cause** : Le mot de passe d'application est incorrect.

**Solution** :
1. Créez un nouveau mot de passe d'application (Étape 1.2)
2. Mettez à jour la variable `EMAIL_PASS` dans Netlify avec le nouveau mot de passe
3. Redéployez le site

---

### ❌ Erreur : "Less secure app access"

**Cause** : Vous utilisez votre mot de passe Gmail normal au lieu d'un mot de passe d'application.

**Solution** :
1. Utilisez un mot de passe d'application (Étape 1.2)
2. Pas votre mot de passe Gmail habituel !

---

### ❌ L'email n'arrive pas

**Vérifications à faire** :
1. ✅ Vérifiez le dossier **Spam** dans Gmail
2. ✅ Vérifiez les logs Netlify Functions pour voir s'il y a une erreur
3. ✅ Vérifiez que les variables d'environnement sont bien configurées
4. ✅ Vérifiez que le site a été redéployé après l'ajout des variables

**Si rien ne fonctionne** :
1. Allez dans Netlify > **Functions** > **send-order** > **Logs**
2. Faites une nouvelle commande de test
3. Regardez les logs en temps réel
4. Copiez l'erreur exacte et cherchez-la sur Google

---

### ❌ Le formulaire ne se soumet pas

**Vérifications** :
1. Ouvrez les outils de développement (F12)
2. Allez dans l'onglet **Console**
3. Regardez s'il y a des erreurs en rouge
4. Vérifiez que tous les champs sont bien remplis

---

## 📊 Vérifier que Tout Fonctionne

### Checklist Finale

- [ ] Validation en deux étapes activée sur Gmail
- [ ] Mot de passe d'application Gmail créé (16 caractères)
- [ ] Variable `EMAIL_USER` ajoutée dans Netlify
- [ ] Variable `EMAIL_PASS` ajoutée dans Netlify (avec le mot de passe d'application)
- [ ] Site redéployé sur Netlify
- [ ] Fonction `send-order` visible dans Netlify > Functions
- [ ] Test de commande effectué
- [ ] Email reçu dans la boîte `yacinemed2020@gmail.com`
- [ ] Commande visible dans Netlify > Forms

---

## 🎉 Résultat Attendu

Quand tout fonctionne correctement :

1. **Le client** remplit le formulaire et clique sur "Commander"
2. **Le client** voit un message : "تم تأكيد الطلب!" (Commande confirmée !)
3. **Vous** recevez un email avec tous les détails de la commande
4. **Vous** pouvez contacter le client pour confirmer

---

## 📞 Besoin d'Aide ?

### Ressources Utiles

- 📖 [Documentation Netlify Functions](https://docs.netlify.com/functions/overview/)
- 📧 [Documentation Nodemailer](https://nodemailer.com/about/)
- 🔐 [Aide Google - Mots de passe d'application](https://support.google.com/accounts/answer/185833)

### Vérifier les Logs

1. Netlify > Functions > send-order > Logs
2. Regardez les erreurs en rouge
3. Les logs vous indiquent exactement ce qui ne va pas

---

## ✅ Configuration Réussie !

Si vous avez suivi toutes les étapes et que vous recevez bien les emails, **félicitations !** 🎉

Votre système de commande est maintenant opérationnel sur Netlify.

---

**Dernière mise à jour** : Configuration vérifiée et optimisée pour Netlify

