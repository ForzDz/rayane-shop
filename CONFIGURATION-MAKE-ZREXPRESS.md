# Configuration Make.com pour ZRExpress

> **Guide détaillé pour configurer le scénario Make.com qui connecte Rayane Shop à ZRExpress**

---

## 📋 Vue d'Ensemble

Make.com agit comme un **pont sécurisé** entre votre site web et l'API ZRExpress :

```
Site Web → Make.com Webhook → API ZRExpress
```

**Avantages** :
- ✅ Pas d'exposition des clés API dans le navigateur
- ✅ Transformation automatique des données
- ✅ Logs centralisés et historique
- ✅ Possibilité d'ajouter des notifications
- ✅ Gestion avancée des erreurs

---

## 🚀 Étape par Étape

### ÉTAPE 1 : Créer un Compte Make.com

1. Allez sur [https://www.make.com](https://www.make.com)
2. Créez un compte gratuit (1000 opérations/mois gratuites)
3. Confirmez votre email

---

### ÉTAPE 2 : Créer un Nouveau Scénario

1. **Cliquez sur** "Create a new scenario"
2. **Nommez le scénario** : `Rayane Shop → ZRExpress`
3. Vous arrivez sur l'éditeur visuel

---

### ÉTAPE 3 : Configurer le Webhook (Module 1)

#### 3.1 Ajouter le module Webhook

1. **Cliquez sur le bouton "+"** au centre
2. **Recherchez** : `Webhooks`
3. **Sélectionnez** : `Webhooks` → `Custom Webhook`

#### 3.2 Créer le webhook

1. **Cliquez sur** "Add"
2. **Nommez-le** : `Rayane Shop Orders`
3. **Cliquez sur** "Save"
4. **Copiez l'URL générée** (ressemble à `https://hook.eu1.make.com/...`)

#### 3.3 Configurer dans votre site

1. **Ouvrez** votre fichier `.env`
2. **Collez l'URL** :
   ```env
   VITE_MAKE_WEBHOOK_URL=https://hook.eu1.make.com/VOTRE_ID_ICI
   ```
3. **Redémarrez** le serveur dev : `npm run dev`

#### 3.4 Tester la réception

1. **Dans Make.com**, cliquez sur "Run once"
2. **Sur votre site**, passez une commande de test
3. **Retournez sur Make.com** → Vous devriez voir les données reçues
4. **Cliquez sur "OK"** pour confirmer la structure

---

### ÉTAPE 4 : Ajouter le Module HTTP (Module 2)

#### 4.1 Ajouter le module

1. **Cliquez sur le "+"** après le webhook
2. **Recherchez** : `HTTP`
3. **Sélectionnez** : `HTTP` → `Make a Request`

#### 4.2 Configuration Générale

| Paramètre | Valeur |
|-----------|--------|
| **URL** | `https://api.zrexpress.app/api/v1/products` |
| **Method** | `POST` |

#### 4.3 Configuration des Headers

Cliquez sur "Show advanced settings" et ajoutez ces headers :

| Header | Valeur |
|--------|--------|
| `X-Tenant` | `VOTRE_TENANT_ID` |
| `X-Api-Key` | `VOTRE_API_KEY` |
| `Authorization` | `Bearer VOTRE_BEARER_TOKEN` |
| `Content-Type` | `application/json` |
| `Accept` | `application/json` |

> ⚠️ **Remplacez** `VOTRE_TENANT_ID`, `VOTRE_API_KEY`, et `VOTRE_BEARER_TOKEN` par vos vrais identifiants ZRExpress.

#### 4.4 Configuration du Body

**Body type** : `Raw`

**Request content** :

```json
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

#### 4.5 Mapping Automatique (Plus Simple)

Au lieu de copier-coller le JSON ci-dessus, vous pouvez utiliser le **mapping automatique** :

1. Cliquez sur chaque champ dans l'éditeur Make.com
2. Sélectionnez la valeur correspondante depuis le module Webhook (Module 1)

**Exemple** :
- `customerName` → Cliquez → Sélectionnez `1. customerName`
- `quantity` → Cliquez → Sélectionnez `1. quantity`
- etc.

---

### ÉTAPE 5 : Options Avancées (Optionnel)

#### 5.1 Gestion d'Erreur

1. **Cliquez sur le module HTTP**
2. **Advanced settings** → **Error handling**
3. **Sélectionnez** : "Resume" pour continuer même en cas d'erreur

#### 5.2 Timeout

1. **Timeout** : `40` (secondes)
2. Cela permet à l'API ZRExpress de répondre même si elle est lente

---

### ÉTAPE 6 : Ajouter des Modules Optionnels

#### Option A : Notification Email

**Pourquoi ?** Recevoir un email à chaque nouvelle commande

1. **Ajoutez le module** : `Email` → `Send an Email`
2. **Configuration** :
   - **To** : `votre-email@example.com`
   - **Subject** : `Nouvelle commande - {{1.reference}}`
   - **Content** :
   ```
   Nouvelle commande reçue !
   
   Client : {{1.customerName}}
   Téléphone : {{1.customerPhone}}
   Produit : {{1.productName}} x {{1.quantity}}
   Total : {{1.totalAmount}} DA
   
   Wilaya : {{1.wilaya}}
   Commune : {{1.commune}}
   Adresse : {{1.deliveryAddress}}
   
   Référence : {{1.reference}}
   ```

#### Option B : Google Sheets

**Pourquoi ?** Centraliser toutes vos commandes dans un spreadsheet

1. **Créez un Google Sheet** avec ces colonnes :
   - Date | Référence | Client | Téléphone | Produit | Quantité | Total | Wilaya | Commune | Adresse

2. **Ajoutez le module** : `Google Sheets` → `Add a Row`

3. **Connectez votre compte Google**

4. **Sélectionnez votre spreadsheet**

5. **Mappez les colonnes** :
   - Date → `{{1.createdAt}}`
   - Référence → `{{1.reference}}`
   - Client → `{{1.customerName}}`
   - etc.

#### Option C : Slack Notification

**Pourquoi ?** Notifier votre équipe instantanément

1. **Ajoutez le module** : `Slack` → `Create a Message`
2. **Connectez votre Slack**
3. **Sélectionnez le canal** (ex: `#commandes`)
4. **Message** :
   ```
   🆕 Nouvelle commande !
   👤 {{1.customerName}} - 📱 {{1.customerPhone}}
   📦 {{1.productName}} x {{1.quantity}}
   💰 {{1.totalAmount}} DA
   📍 {{1.wilaya}} - {{1.commune}}
   ```

---

### ÉTAPE 7 : Tester le Scénario

#### 7.1 Test Initial

1. **Cliquez sur "Run once"** (bouton en bas à gauche)
2. **Sur votre site**, passez une commande de test :
   - Nom : `Test Client`
   - Téléphone : `0556123456`
   - Produit : N'importe lequel
   - Wilaya : `31-Oran`

3. **Retournez sur Make.com** → Vous devriez voir :
   - Module 1 (Webhook) : ✅ Données reçues
   - Module 2 (HTTP) : ✅ Requête envoyée (200 OK)

4. **Vérifiez ZRExpress Dashboard** :
   - Une nouvelle commande devrait apparaître
   - Vérifiez tous les détails

#### 7.2 Test d'Erreur

Testez avec des données invalides pour voir comment le scénario gère les erreurs :

1. **Modifiez temporairement** l'API Key dans Make.com (mettez une fausse valeur)
2. **Passez une commande de test**
3. **Vérifiez les logs Make.com** :
   - Module HTTP devrait afficher une erreur (401 Unauthorized)

4. **Remettez la vraie API Key**

---

### ÉTAPE 8 : Activer le Scénario

#### 8.1 Activer

1. **Cliquez sur le switch** en bas à gauche (OFF → ON)
2. Le scénario est maintenant **actif** et s'exécutera automatiquement

#### 8.2 Planification (Scheduling)

Par défaut, le webhook est **instantané** (chaque commande déclenche le scénario).

Vous pouvez aussi configurer :
- **Intervalle** : Exécuter toutes les X minutes
- Mais pour les commandes, **instantané est recommandé**

---

## 📊 Monitoring et Logs

### Voir l'Historique des Exécutions

1. **Allez dans** "History" (menu de gauche)
2. Vous voyez toutes les exécutions :
   - ✅ Succès (vert)
   - ❌ Échecs (rouge)
   - ⏸️ Warnings (orange)

3. **Cliquez sur une exécution** pour voir les détails :
   - Données reçues du webhook
   - Requête envoyée à ZRExpress
   - Réponse de ZRExpress

### Alertes Email

Make.com peut vous envoyer un email en cas d'erreur :

1. **Settings** → **Notifications**
2. **Activez** "Send me an email when scenario encounters an error"

---

## 🔧 Configuration Avancée

### Variables et Constantes

Pour éviter de dupliquer vos credentials dans chaque scénario :

1. **Créez des variables** :
   - Settings → Variables
   - Ajoutez : `ZREXPRESS_TENANT_ID`, `ZREXPRESS_API_KEY`, etc.

2. **Utilisez-les** dans les modules :
   - Au lieu de taper la valeur, sélectionnez `{{variables.ZREXPRESS_TENANT_ID}}`

### Filtres

Ajouter une condition avant d'envoyer à ZRExpress :

1. **Cliquez sur la ligne** entre les deux modules
2. **Ajoutez un filtre** :
   - Exemple : `{{1.totalAmount}} > 1000` (seulement si > 1000 DA)

### Data Stores

Sauvegarder les commandes dans Make.com :

1. **Créez un Data Store** : "Data Store" → "Add Data Store"
2. **Ajoutez le module** : "Data Stores" → "Add a Record"
3. Sauvegardez toutes les commandes pour analyse future

---

## 🐛 Dépannage

### Problème : "Webhook doesn't receive data"

**Solutions** :
1. Vérifiez que `VITE_MAKE_WEBHOOK_URL` dans `.env` est correct
2. Redémarrez le serveur dev : `npm run dev`
3. Vérifiez la console navigateur pour les erreurs
4. Testez le webhook manuellement :
   ```bash
   curl -X POST https://hook.eu1.make.com/VOTRE_ID \
     -H "Content-Type: application/json" \
     -d '{"test": true}'
   ```

### Problème : "HTTP Module returns 401 Unauthorized"

**Solutions** :
1. Vérifiez vos credentials ZRExpress :
   - Tenant ID correct ?
   - API Key correcte ?
   - Bearer Token valide ?
2. Vérifiez le format du header Authorization : `Bearer VOTRE_TOKEN`

### Problème : "HTTP Module returns 400 Bad Request"

**Solutions** :
1. Vérifiez le format du body (doit être du JSON valide)
2. Vérifiez que tous les champs requis sont présents
3. Vérifiez les types de données (quantity et prix doivent être des nombres, pas des strings)

### Problème : "Scenario uses too many operations"

**Solution** :
- Plan gratuit : 1000 opérations/mois
- 1 commande = 1 opération (webhook) + 1 opération (HTTP) = 2 opérations
- Avec le plan gratuit : ~500 commandes/mois maximum
- Pour plus : Upgrade vers un plan payant

---

## 📈 Optimisations

### Réduire les Opérations

1. **Combinez les modules** : Au lieu de plusieurs modules email, utilisez un seul
2. **Utilisez des filtres** : Pour ne traiter que certaines commandes

### Améliorer les Performances

1. **Utilisez le cache** : Pour les données répétitives (ex: tarifs de livraison)
2. **Parallélisez** : Envoyez à ZRExpress ET à Google Sheets en parallèle (pas en série)

---

## 📝 Checklist de Configuration

- [ ] Compte Make.com créé
- [ ] Scénario créé et nommé
- [ ] Module Webhook configuré
- [ ] URL webhook copiée dans `.env`
- [ ] Module HTTP ajouté
- [ ] URL API ZRExpress correcte
- [ ] Headers configurés (X-Tenant, X-Api-Key, Authorization)
- [ ] Body JSON configuré avec mapping
- [ ] Test réussi avec commande factice
- [ ] Commande apparaît dans ZRExpress dashboard
- [ ] Scénario activé (ON)
- [ ] Notifications email activées (optionnel)
- [ ] Modules optionnels ajoutés (Email, Sheets, Slack)

---

## 🎓 Ressources Supplémentaires

- **Make.com Academy** : [https://www.make.com/en/academy](https://www.make.com/en/academy)
- **Make.com Documentation** : [https://www.make.com/en/help](https://www.make.com/en/help)
- **Webhooks Guide** : [https://www.make.com/en/help/tools/webhooks](https://www.make.com/en/help/tools/webhooks)
- **HTTP Module Guide** : [https://www.make.com/en/help/tools/http](https://www.make.com/en/help/tools/http)

---

**Dernière mise à jour** : 27 décembre 2024  
**Version** : 1.0.0
