# ⚡ Configuration Rapide - Netlify (5 minutes)

## 🎯 Objectif
Configurer votre site pour recevoir les emails de commande sur Netlify.

---

## 📝 Étape 1 : Créer un Mot de Passe Gmail (2 min)

1. Allez sur https://myaccount.google.com
2. **Sécurité** > **Validation en deux étapes** (activez si pas fait)
3. **Mots de passe d'application** > **Générer**
   - Application : **Mail**
   - Nom : **Rayan Shop Netlify**
4. **COPIEZ** le mot de passe (16 caractères) ⚠️

---

## 🔧 Étape 2 : Ajouter les Variables dans Netlify (2 min)

1. Allez sur https://app.netlify.com
2. Votre site > **Site settings** > **Environment variables**
3. Ajoutez 2 variables :

| Clé | Valeur |
|-----|--------|
| `EMAIL_USER` | `yacinemed2020@gmail.com` |
| `EMAIL_PASS` | `[Votre mot de passe de 16 caractères]` |

✅ Cochez **"Contains secret values"** pour les deux

---

## 🚀 Étape 3 : Redéployer (1 min)

1. **Deploys** > **Trigger deploy** > **Clear cache and deploy site**
2. Attendez 2-3 minutes

---

## ✅ Étape 4 : Tester

1. Allez sur votre site
2. Remplissez le formulaire de commande
3. Vérifiez l'email dans `yacinemed2020@gmail.com`

---

## ❌ Problème ?

**Email pas reçu ?**
- Vérifiez le dossier **Spam**
- Vérifiez les logs : Netlify > Functions > send-order > Logs

**Erreur "Invalid login" ?**
- Créez un nouveau mot de passe d'application
- Mettez à jour `EMAIL_PASS` dans Netlify
- Redéployez

---

📖 **Guide détaillé** : Voir `GUIDE-NETLIFY-COMPLET.md`

