# Guide : Intégration Google Sheets pour ZRExpress

Voici les étapes à suivre pour configurer Make.com afin de recevoir les commandes dans un Google Sheet formaté pour l'import ZRExpress.

## 1. Préparer le Google Sheet

Créez un nouveau Google Sheet avec exactement ces colonnes en première ligne (copiez-collez pour éviter les erreurs) :

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Nom complet | Téléphone 1 | Téléphone 2 | Produit | Quantité | SKU | Type de stock | Adresse | Wilaya | Commune | Prix total de la commande | Note | ID | Stopdesk | Nom StopDesk |

## 2. Configurer Make.com

1.  Allez sur votre scénario Make.com existant (ou créez-en un nouveau).
2.  Assurez-vous que le premier module est un **Webhooks** > **Custom Webhook**.
3.  Gardez la même URL de webhook que vous avez déjà (`https://hook.eu1.make.com/...`). Si vous changez d'URL, mettez à jour le fichier `.env` de votre projet (`VITE_MAKE_WEBHOOK_URL`).
4.  Cliquez sur le module Webhook et choisissez **"Redetermine data structure"**.
5.  **Action requise :** Allez sur votre site, remplissez le formulaire de commande et validez.
    *   Cela enverra un test à Make.com avec le nouveau format de données.
    *   Le module Webhook devrait afficher "Successfully determined".

## 3. Connecter Google Sheets dans Make.com

1.  Ajoutez ou mettez à jour le module suivant le Webhook. Choisissez **Google Sheets** > **Add a Row**.
2.  Connectez votre compte Google.
3.  Sélectionnez le fichier (Spreadsheet) que vous avez créé à l'étape 1.
4.  Sélectionnez la feuille (Sheet Name, ex: Sheet1).
5.  Maintenant, **mappez les champs** reçus du Webhook vers les colonnes du Sheet :
    *   Colonne **Nom complet** -> `Nom complet` (du Webhook)
    *   Colonne **Téléphone 1** -> `Téléphone 1`
    *   Colonne **Téléphone 2** -> `Téléphone 2`
    *   Colonne **Produit** -> `Produit`
    *   ... et ainsi de suite pour toutes les colonnes.

## 4. Sauvegarder et Activer

1.  Sauvegardez le scénario.
2.  Activez-le (**ON**).

## 5. Exporter pour ZRExpress (Quand vous voulez expédier)

1.  Ouvrez votre Google Sheet.
2.  Fichier > Télécharger > Microsoft Excel (.xlsx).
3.  Allez sur ZRExpress > Import.
4.  Chargez le fichier Excel.
5.  Les colonnes devraient correspondre automatiquement.

félicitations ! Vous avez maintenant un système automatisé qui crée un fichier Excel prêt pour ZRExpress.
