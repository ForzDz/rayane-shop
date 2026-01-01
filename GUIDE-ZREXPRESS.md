# Guide Complet d'Intégration ZRExpress

> **Documentation officielle pour l'intégration de l'API ZRExpress avec Rayane Shop**

---

## 📋 Table des Matières

1. [Installation et Configuration](#installation-et-configuration)
2. [Récupération des Credentials ZRExpress](#récupération-des-credentials)
3. [Configuration Make.com](#configuration-makecom)
4. [Tests et Validation](#tests-et-validation)
5. [Débogage et Troubleshooting](#débogage-et-troubleshooting)
6. [Architecture et Flux de Données](#architecture-et-flux-de-données)
7. [FAQ](#faq)

---

## 🚀 Installation et Configuration

### Étape 1 : Variables d'Environnement

Ouvrez le fichier `.env` à la racine du projet et ajoutez vos credentials ZRExpress :

```env
# ZRExpress API Configuration
VITE_ZREXPRESS_TENANT_ID=votre_tenant_id_ici
VITE_ZREXPRESS_API_KEY=votre_api_key_ici
VITE_ZREXPRESS_BEARER_TOKEN=votre_bearer_token_ici
VITE_MAKE_WEBHOOK_URL=https://hook.eu1.make.com/4ke5ajtsh13o93kksp5gyo6qt5qimqjj
VITE_ZREXPRESS_TIMEOUT=10000
```

### Étape 2 : Configuration Netlify (Production)

1. Allez sur votre dashboard Netlify
2. Sélectionnez votre site
3. Accédez à **Site settings** → **Environment variables**
4. Ajoutez les mêmes variables que dans `.env` :
   - `VITE_ZREXPRESS_TENANT_ID`
   - `VITE_ZREXPRESS_API_KEY`
   - `VITE_ZREXPRESS_BEARER_TOKEN`
   - `VITE_MAKE_WEBHOOK_URL`
   - `VITE_ZREXPRESS_TIMEOUT`

5. Redéployez votre site

---

## 🔑 Récupération des Credentials

### Où trouver vos identifiants ZRExpress ?

1. **Connectez-vous à votre compte ZRExpress** : [https://zrexpress.app](https://zrexpress.app)

2. **Accédez aux Paramètres API** :
   - Dashboard → Paramètres → API
   - Ou visitez : [https://api.zrexpress.app/docs](https://api.zrexpress.app/docs)

3. **Récupérez les credentials suivants** :
   - **Tenant ID** : Identifiant unique de votre compte
   - **API Key** : Clé d'authentification (X-Api-Key)
   - **Bearer Token** : Token d'autorisation

4. **Permissions requises** :
   - ✅ `SupplierParcelsManagerRole`
   - ✅ `SupplierAdminRole`

> ⚠️ **IMPORTANT** : Ne partagez JAMAIS ces credentials publiquement. Ils donnent un accès complet à votre compte ZRExpress.

---

## 🔧 Configuration Make.com

### Pourquoi Make.com ?

Make.com agit comme un **proxy sécurisé** entre votre site web et l'API ZRExpress. Cela permet de :
- ✅ Ne pas exposer vos clés API dans le navigateur
- ✅ Transformer les données au bon format
- ✅ Gérer les erreurs et logs centralisés
- ✅ Ajouter des notifications (email, Slack, etc.)

### Configuration du Scénario Make.com

#### 1. Créer un nouveau Scénario

1. Connectez-vous à [Make.com](https://make.com)
2. Créez un nouveau scénario
3. Nommez-le : **"Rayane Shop → ZRExpress"**

#### 2. Configurer le Webhook (Trigger)

1. **Ajoutez le module** : `Webhooks` → `Custom Webhook`
2. **Créez un nouveau webhook** :
   - Nom : `Rayane Shop Orders`
   - Copiez l'URL générée (ex: `https://hook.eu1.make.com/...`)
3. **Collez cette URL** dans votre `.env` comme `VITE_MAKE_WEBHOOK_URL`

#### 3. Ajouter le Module HTTP

1. **Ajoutez le module** : `HTTP` → `Make a Request`
2. **Configuration** :

```
URL: https://api.zrexpress.app/api/v1/products
Method: POST

Headers:
  - X-Tenant: {{VOTRE_TENANT_ID}}
  - X-Api-Key: {{VOTRE_API_KEY}}
  - Authorization: Bearer {{VOTRE_BEARER_TOKEN}}
  - Content-Type: application/json
  - Accept: application/json

Body Type: Raw
Request Content:
{
  "customerName": "{{1.customerName}}",
  "customerPhone": "{{1.customerPhone}}",
  "deliveryAddress": "{{1.deliveryAddress}}",
  "wilaya": "{{1.wilaya}}",
  "commune": "{{1.commune}}",
  "productName": "{{1.productName}}",
  "quantity": {{1.quantity}},
  "unitPrice": {{1.unitPrice}},
  "subtotal": {{1.subtotal}},
  "deliveryFee": {{1.deliveryFee}},
  "totalAmount": {{1.totalAmount}},
  "deliveryType": "{{1.deliveryType}}",
  "reference": "{{1.reference}}",
  "source": "{{1.source}}",
  "createdAt": "{{1.createdAt}}"
}
```

#### 4. Tester le Scénario

1. Cliquez sur **"Run once"**
2. Passez une commande de test sur votre site
3. Vérifiez que Make.com reçoit les données
4. Vérifiez que ZRExpress crée la commande

#### 5. Activer le Scénario

Une fois testé avec succès, **activez le scénario** (bouton ON/OFF en bas à gauche).

### Ajouts Optionnels

#### Ajouter des Notifications Email

1. Après le module HTTP, ajoutez : `Email` → `Send an Email`
2. Configurez :
   - **To** : votre email
   - **Subject** : `Nouvelle commande ZRExpress - {{1.reference}}`
   - **Content** : Détails de la commande

#### Ajouter Google Sheets

1. Ajoutez : `Google Sheets` → `Add a Row`
2. Sélectionnez votre spreadsheet
3. Mappez les champs pour un suivi centralisé

---

## ✅ Tests et Validation

### Test 1 : Connexion API (Développement)

```bash
# 1. Démarrer le serveur local
npm run dev

# 2. Ouvrir la console navigateur (F12)
# 3. Dans la console, exécuter :
testZRExpressConnection()

# Résultat attendu :
# ✅ Connexion ZRExpress réussie
```

### Test 2 : Commande Test Locale

1. **Accédez à** : `http://localhost:5173`
2. **Remplissez le formulaire** avec des données de test :
   - Nom : `Test Client`
   - Téléphone : `0556123456`
   - Wilaya : `31-Oran`
   - Commune : `Bir el Djir`
   - Adresse : `123 Rue Test`
   - Quantité : `1`

3. **Cliquez sur** "اطلب الآن"

4. **Vérifications** :
   - ✅ Aucune erreur dans la console
   - ✅ Redirection vers `/merci`
   - ✅ Logs dans la console : `✅ [ZRExpress] Commande envoyée avec succès`

5. **Vérifiez Make.com** :
   - Accédez à l'historique de votre scénario
   - Vérifiez que le webhook a reçu les données
   - Vérifiez que la requête HTTP a réussi (200 OK)

6. **Vérifiez ZRExpress Dashboard** :
   - Connectez-vous à ZRExpress
   - Vérifiez qu'une nouvelle commande apparaît
   - Vérifiez les détails (nom, téléphone, adresse, etc.)

### Test 3 : Gestion d'Erreur Réseau

1. **Ouvrez DevTools** (F12) → **Network**
2. **Activez** "Offline mode"
3. **Soumettez une commande**

**Résultat attendu** :
- ❌ Message d'erreur en arabe : "خطأ في الاتصال. تحقق من اتصالك بالإنترنت."
- ✅ Commande sauvegardée dans Netlify Forms (backup)
- ✅ Logs de retry dans la console : `⚠️ [ZRExpress] Tentative 1 échouée`

### Test 4 : Production (Netlify)

1. **Commit et push** :
```bash
git add .
git commit -m "feat: ZRExpress integration avec retry"
git push origin main
```

2. **Attendez le déploiement** Netlify (2-3 min)

3. **Vérifiez** :
   - Build réussi dans Netlify Dashboard
   - Variables d'environnement configurées

4. **Testez en production** :
   - Passez une commande réelle de test
   - Vérifiez dans ZRExpress

---

## 🐛 Débogage et Troubleshooting

### Problème 1 : "URL Webhook Make.com non configurée"

**Erreur** : `URL Webhook Make.com non configurée dans .env`

**Solution** :
1. Vérifiez que `VITE_MAKE_WEBHOOK_URL` est défini dans `.env`
2. Redémarrez le serveur de développement : `npm run dev`
3. Si en production, vérifiez les variables Netlify

### Problème 2 : "Timeout: La requête a pris trop de temps"

**Erreur** : Message de timeout après 10 secondes

**Solutions** :
1. Vérifiez votre connexion internet
2. Augmentez le timeout dans `.env` :
   ```env
   VITE_ZREXPRESS_TIMEOUT=20000
   ```
3. Vérifiez que Make.com est actif et répond

### Problème 3 : Données invalides

**Erreur** : `Données invalides: [liste d'erreurs]`

**Vérifications** :
- ✅ Numéro de téléphone au format `05/06/07` + 8 chiffres
- ✅ Nom client minimum 2 caractères
- ✅ Adresse minimum 5 caractères (sauf stop desk)
- ✅ Wilaya et commune sélectionnées

### Problème 4 : Make.com ne reçoit pas les données

**Solutions** :
1. **Vérifiez le webhook Make.com** :
   - Le scénario est actif (ON)
   - L'URL webhook est correcte dans `.env`

2. **Testez le webhook manuellement** :
```bash
curl -X POST https://hook.eu1.make.com/VOTRE_WEBHOOK_ID \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

3. **Vérifiez les logs Make.com** :
   - History → Voir les exécutions récentes
   - Erreurs affichées en rouge

### Problème 5 : ZRExpress ne crée pas la commande

**Solutions** :
1. **Vérifiez les credentials** dans Make.com :
   - Tenant ID correct
   - API Key correcte
   - Bearer Token valide

2. **Vérifiez les permissions** ZRExpress :
   - SupplierParcelsManagerRole
   - SupplierAdminRole

3. **Vérifiez le format des données** :
   - Numéro de téléphone algérien valide
   - Wilaya existe dans ZRExpress
   - Montants en DZD (positifs)

### Accéder aux Logs Détaillés

En développement (console navigateur) :
```javascript
// Voir tous les logs ZRExpress
zrExpressService.getLogs()

// Vider les logs
zrExpressService.clearLogs()
```

---

## 📊 Architecture et Flux de Données

### Flux Complet d'une Commande

```
┌─────────────────┐
│  Client remplit │
│  le formulaire  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ CheckoutForm    │ ← Validation des champs
│ (validation)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ handleSubmit()  │
└────────┬────────┘
         │
         ├─────────────────────┐
         │                     │
         ▼                     ▼
┌─────────────────┐   ┌─────────────────┐
│ Netlify Forms   │   │ ZRExpress       │
│ (backup)        │   │ Service         │
└─────────────────┘   └────────┬────────┘
                               │
                               ▼
                      ┌─────────────────┐
                      │ envoyerCommande │
                      │ AvecRetry()     │
                      └────────┬────────┘
                               │
                 ┌─────────────┼─────────────┐
                 │             │             │
              Essai 1       Essai 2       Essai 3
                 │             │             │
                 ▼             ▼             ▼
            ┌─────────────────────────────────┐
            │     Make.com Webhook            │
            └────────┬────────────────────────┘
                     │
                     ▼
            ┌─────────────────┐
            │ Transformation  │ ← Formatage données
            │ des données     │
            └────────┬────────┘
                     │
                     ▼
   ┌──────────────────────────────────────┐
   │  POST api.zrexpress.app/api/v1/products
   │  Headers:
   │    - X-Tenant
   │    - X-Api-Key
   │    - Authorization: Bearer
   └────────┬─────────────────────────────┘
            │
            ▼
   ┌─────────────────┐
   │ API ZRExpress   │ → Crée la commande
   │ (traitement)    │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Réponse 200 OK  │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │  Make.com       │ → Retourne résultat
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ ZRExpress       │ → success: true
   │ Service         │
   └────────┬────────┘
            │
            ▼
   ┌─────────────────┐
   │ Redirection     │
   │ vers /merci     │
   └─────────────────┘
```

### Format des Données Échangées

#### 1. Données du Formulaire → Service

```typescript
{
  nomClient: "Ahmed Benali",
  telephone: "0556123456",
  adresse: "Rue de la Liberté, Bir el Djir",
  wilaya: "31-Oran",
  commune: "Bir el Djir",
  produit: "Anti-Cellulite Cream",
  quantite: 2,
  prix: 2500,
  deliveryType: "domicile",
  deliveryPrice: 500,
  totalPrice: 5500
}
```

#### 2. Service → Make.com

```json
{
  "customerName": "Ahmed Benali",
  "customerPhone": "0556123456",
  "deliveryAddress": "Rue de la Liberté, Bir el Djir",
  "wilaya": "Oran",
  "commune": "Bir el Djir",
  "productName": "Anti-Cellulite Cream",
  "quantity": 2,
  "unitPrice": 2500,
  "subtotal": 5000,
  "deliveryFee": 500,
  "totalAmount": 5500,
  "deliveryType": "home",
  "reference": "CMD-1703698765432",
  "source": "rayane-shop",
  "createdAt": "2024-12-27T18:06:05.432Z"
}
```

#### 3. Make.com → ZRExpress API

```json
POST https://api.zrexpress.app/api/v1/products

Headers:
X-Tenant: votre_tenant_id
X-Api-Key: votre_api_key
Authorization: Bearer votre_bearer_token
Content-Type: application/json
Accept: application/json

Body: [même structure que ci-dessus]
```

---

## ❓ FAQ

### Q1 : Puis-je appeler l'API ZRExpress directement depuis le navigateur ?

**Non, pas recommandé.** Cela exposerait vos clés API dans le code source visible par tous. Utilisez toujours Make.com comme proxy ou créez des Netlify Functions.

### Q2 : Combien de tentatives de retry sont effectuées ?

**3 tentatives** par défaut avec délai exponentiel :
- Tentative 1 : Immédiate
- Tentative 2 : Après 1 seconde
- Tentative 3 : Après 2 secondes

Vous pouvez modifier cela dans le service.

### Q3 : Que se passe-t-il si ZRExpress est hors ligne ?

1. Le service fait 3 tentatives
2. Si toutes échouent, l'utilisateur voit un message d'erreur
3. **IMPORTANT** : La commande est quand même sauvegardée dans Netlify Forms
4. Vous pouvez récupérer les commandes échouées et les créer manuellement

### Q4 : Les commandes sont-elles toujours sauvegardées dans Netlify Forms ?

**Oui !** Netlify Forms agit comme **backup de sécurité**. Même si ZRExpress échoue, vous avez toujours accès aux commandes via :
- Dashboard Netlify → Forms → order-form

### Q5 : Comment voir les logs des commandes envoyées ?

En **développement** (console navigateur) :
```javascript
zrExpressService.getLogs()
```

En **production** :
- Logs Make.com (History)
- Dashboard ZRExpress
- Dashboard Netlify Forms

### Q6 : Puis-je personnaliser les messages d'erreur ?

**Oui !** Modifiez la méthode `getErrorMessage()` dans `zrexpress.service.ts` :

```typescript
getErrorMessage(error: string): { fr: string; ar: string } {
  // Ajoutez vos messages personnalisés ici
}
```

### Q7 : Combien coûte Make.com ?

Make.com offre un **plan gratuit** avec :
- 1 000 opérations/mois
- Scénarios actifs illimités

Pour plus, voir : [https://www.make.com/en/pricing](https://www.make.com/en/pricing)

### Q8 : Puis-je tester sans vraies credentials ZRExpress ?

**Oui, partiellement.** Vous pouvez :
1. Tester Make.com webhook uniquement
2. Utiliser des credentials de test si ZRExpress les fournit
3. Contacter ZRExpress pour un environnement de staging

### Q9 : Comment désactiver temporairement ZRExpress ?

Dans `CheckoutForm.tsx`, commentez l'appel ZRExpress :

```typescript
// const response = await zrExpressService.envoyerCommandeAvecRetry(commandeData);
```

Les commandes seront toujours sauvegardées dans Netlify Forms.

### Q10 : Où trouver de l'aide supplémentaire ?

- **Documentation ZRExpress** : [https://api.zrexpress.app/docs](https://api.zrexpress.app/docs)
- **Support ZRExpress** : Contactez leur équipe support
- **Make.com Help** : [https://www.make.com/en/help](https://www.make.com/en/help)

---

## 📞 Support

Pour toute question ou problème :

1. **Vérifiez d'abord** ce guide et la section Troubleshooting
2. **Consultez les logs** (console navigateur + Make.com)
3. **Testez la connexion** avec `testZRExpressConnection()`
4. **Contactez le support ZRExpress** si problème API

---

**Dernière mise à jour** : 27 décembre 2024  
**Version** : 1.0.0
