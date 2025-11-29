# 📧 Configuration Email - Gmail avec Nodemailer

## ✅ Ce qui a été fait

- ✅ Fonction `send-order.ts` créée avec Nodemailer
- ✅ Intégration dans `CheckoutForm.tsx`
- ✅ Headers CORS ajoutés
- ✅ Gestion d'erreurs améliorée
- ✅ Code poussé sur GitHub

## 🔧 Configuration requise dans Netlify

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
2. Sélectionnez votre site **rayane-shop31**
3. Allez dans **Site settings** > **Environment variables**
4. Cliquez sur **Add a variable**

#### Ajoutez ces 2 variables :

**Variable 1 :**
- **Key:** `EMAIL_USER`
- **Value:** `yacinemed2020@gmail.com`
- Cochez "Contains secret values" (optionnel mais recommandé)

**Variable 2 :**
- **Key:** `EMAIL_PASS`
- **Value:** `[Le mot de passe d'application de 16 caractères que vous avez copié]`
- **IMPORTANT:** Cochez "Contains secret values"

5. Cliquez sur **Create variable** pour chaque variable

### Étape 3 : Redéployer le site

1. Dans Netlify, allez dans **Deploys**
2. Cliquez sur **Trigger deploy** > **Clear cache and deploy site**
3. Attendez la fin du déploiement (2-3 minutes)

## 🧪 Test

1. Allez sur votre site déployé
2. Remplissez le formulaire de commande
3. Soumettez la commande
4. Vérifiez que vous recevez l'email à `yacinemed2020@gmail.com`

## 🔍 Vérification des logs

Si ça ne fonctionne pas :

1. Dans Netlify : **Functions** > **send-order** > **Logs**
2. Essayez de soumettre une commande
3. Regardez les logs pour voir l'erreur exacte

## ❌ Erreurs courantes

### "Configuration email manquante"
- Les variables `EMAIL_USER` et `EMAIL_PASS` ne sont pas configurées dans Netlify
- Solution : Ajoutez-les et redéployez

### "Invalid login"
- Le mot de passe d'application est incorrect
- Solution : Créez un nouveau mot de passe d'application

### "Less secure app access"
- Vous utilisez votre mot de passe normal au lieu d'un mot de passe d'application
- Solution : Utilisez un mot de passe d'application (voir Étape 1)

## 📝 Structure

```
netlify/functions/
  └── send-order.ts    # Fonction d'envoi email avec Nodemailer

src/components/
  └── CheckoutForm.tsx  # Formulaire qui appelle la fonction
```

## ✅ Checklist finale

- [ ] Validation en deux étapes activée sur Gmail
- [ ] Mot de passe d'application créé
- [ ] Variable `EMAIL_USER` ajoutée dans Netlify
- [ ] Variable `EMAIL_PASS` ajoutée dans Netlify
- [ ] Site redéployé sur Netlify
- [ ] Test de commande effectué
- [ ] Email reçu à `yacinemed2020@gmail.com`

---

**Besoin d'aide ?** Vérifiez les logs Netlify Functions pour plus de détails.

