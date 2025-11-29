# Configuration Netlify - Formulaire et Email

Ce document explique comment configurer Netlify Forms et l'envoi d'emails pour votre site e-commerce.

## 📋 Prérequis

- Compte Netlify
- Compte SendGrid (gratuit jusqu'à 100 emails/jour)
- Site déployé sur Netlify

## 🚀 Configuration rapide

### 1. Activation de Netlify Forms

Netlify Forms est automatiquement activé grâce à :
- L'attribut `data-netlify="true"` dans le formulaire
- Le champ caché `<input type="hidden" name="form-name" value="contact" />`
- Le champ honeypot pour protection anti-spam

**Aucune configuration supplémentaire n'est nécessaire !**

### 2. Configuration de SendGrid

#### Étape 1 : Créer un compte SendGrid
1. Allez sur [sendgrid.com](https://sendgrid.com)
2. Créez un compte gratuit
3. Vérifiez votre email

#### Étape 2 : Créer une clé API
1. Allez dans **Settings > API Keys**
2. Cliquez sur **Create API Key**
3. Donnez un nom (ex: "Boutique DZ Contact Form")
4. Sélectionnez **Full Access** ou **Restricted Access** avec permissions d'envoi
5. Copiez la clé (vous ne pourrez plus la voir après)

#### Étape 3 : Vérifier un domaine ou email expéditeur
1. Allez dans **Settings > Sender Authentication**
2. Option A (Recommandé) : **Domain Authentication** - Vérifiez votre domaine
3. Option B (Simple) : **Single Sender Verification** - Vérifiez un email

### 3. Configuration des variables d'environnement Netlify

1. Allez sur votre dashboard Netlify
2. Sélectionnez votre site
3. Allez dans **Site settings > Environment variables**
4. Ajoutez les variables suivantes :

```
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxx
ADMIN_EMAIL=votre-email@boutiquedz.com
FROM_EMAIL=noreply@boutiquedz.com
```

**Important :** 
- `FROM_EMAIL` doit être un email vérifié dans SendGrid
- `ADMIN_EMAIL` est l'email qui recevra les messages clients

### 4. Installation de la dépendance SendGrid

Ajoutez dans votre `package.json` :

```json
{
  "dependencies": {
    "@sendgrid/mail": "^7.7.0"
  }
}
```

Ou installez via npm :
```bash
npm install @sendgrid/mail
```

### 5. Redéployer le site

Après avoir configuré les variables d'environnement :
1. Allez dans **Deploys**
2. Cliquez sur **Trigger deploy > Clear cache and deploy site**

## 🧪 Test du formulaire

### Test Netlify Forms (soumission simple)
1. Remplissez et soumettez le formulaire
2. Allez dans **Forms** dans votre dashboard Netlify
3. Vérifiez que la soumission apparaît

### Test de l'envoi d'email
1. Remplissez le formulaire avec un email valide
2. Soumettez le formulaire
3. Vérifiez :
   - Votre email admin (`ADMIN_EMAIL`) doit recevoir le message
   - L'email client doit recevoir la confirmation
   - Vérifiez les dossiers spam

## 🔍 Débogage

### Les emails ne sont pas envoyés

1. **Vérifiez les logs Netlify Functions**
   - Dashboard Netlify > Functions > send-email > Logs
   - Recherchez les erreurs

2. **Vérifiez les variables d'environnement**
   ```bash
   # Dans les logs, vous devriez voir "Configuration email manquante" si erreur
   ```

3. **Vérifiez SendGrid**
   - Dashboard SendGrid > Activity Feed
   - Vérifiez si les emails sont bloqués

4. **Erreurs courantes**
   - Clé API invalide ou expirée
   - Email expéditeur non vérifié
   - Quota SendGrid dépassé (100/jour en gratuit)
   - Variables d'environnement mal configurées

### Le formulaire ne se soumet pas

1. **Vérifiez la structure HTML**
   - Attribut `data-netlify="true"` présent
   - Champ caché `form-name` présent
   - Attribut `name="contact"` sur le `<form>`

2. **Vérifiez la console du navigateur**
   - Erreurs JavaScript
   - Erreurs de requête réseau

3. **Vérifiez le honeypot**
   - Le champ `bot-field` doit rester vide

## 📊 Monitoring

### Netlify Forms
- Dashboard Netlify > Forms
- Voir toutes les soumissions
- Exporter en CSV
- Configurer des notifications

### SendGrid
- Dashboard SendGrid > Activity
- Statistiques d'envoi
- Taux d'ouverture
- Bounces et spam reports

## 🔐 Sécurité

- ✅ Honeypot activé contre les bots
- ✅ Validation côté client et serveur
- ✅ CORS configuré
- ✅ Variables d'environnement sécurisées
- ✅ Rate limiting Netlify automatique

## 💰 Limites gratuites

### Netlify
- 100 soumissions/mois (gratuit)
- Upgrade vers Pro pour plus

### SendGrid
- 100 emails/jour (gratuit)
- Upgrade vers Essentials pour plus

## 📝 Structure des fichiers

```
/
├── netlify.toml                 # Configuration Netlify
├── netlify/
│   └── functions/
│       └── send-email.js        # Fonction d'envoi email
├── src/
│   ├── pages/
│   │   ├── Contact.tsx          # Page contact avec formulaire
│   │   └── ThankYou.tsx         # Page de confirmation
│   ├── hooks/
│   │   └── useForm.tsx          # Hook de gestion formulaire
│   └── components/
│       └── FormField.tsx        # Composant champ formulaire
└── README-NETLIFY.md            # Ce fichier
```

## ❓ Support

- [Documentation Netlify Forms](https://docs.netlify.com/forms/setup/)
- [Documentation SendGrid](https://docs.sendgrid.com/)
- [Support Netlify](https://answers.netlify.com/)

## ✅ Checklist finale

- [ ] Compte SendGrid créé et vérifié
- [ ] Clé API SendGrid créée
- [ ] Email/domaine expéditeur vérifié dans SendGrid
- [ ] Variables d'environnement configurées dans Netlify
- [ ] Dépendance `@sendgrid/mail` installée
- [ ] Site redéployé sur Netlify
- [ ] Formulaire testé (soumission)
- [ ] Emails testés (admin + client)
- [ ] Vérification dossier spam

---

**Besoin d'aide ?** Consultez les logs Netlify Functions pour plus de détails sur les erreurs.
