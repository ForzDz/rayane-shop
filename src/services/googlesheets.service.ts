// ============================================
// FICHIER : src/services/googlesheets.service.ts
// Service pour envoyer les commandes vers Google Sheets
// via Make.com, formaté pour l'import ZRExpress
// ============================================

import type { CommandeData, ZRExpressResponse } from '@/types/zrexpress.types';

export interface GoogleSheetPayload {
  "Nom complet": string;
  "Téléphone 1": string;
  "Téléphone 2": string;
  "Produit": string;
  "Quantité": number;
  "SKU": string;
  "Type de stock": string;
  "Adresse": string;
  "Wilaya": string;
  "Commune": string;
  "Prix total de la commande": number;
  "Note": string;
  "ID": string;
  "Stopdesk": string;
  "Nom StopDesk": string;
}

class GoogleSheetsService {
  // On réutilise la même variable d'environnement pour le webhook
  private readonly MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || '';
  
  /**
   * Envoie la commande formatée pour Google Sheets
   */
  async envoyerCommande(commande: CommandeData): Promise<ZRExpressResponse> {
    try {
      if (!this.MAKE_WEBHOOK_URL || this.MAKE_WEBHOOK_URL.includes('VOTRE_URL')) {
        throw new Error('URL Webhook non configurée');
      }

      const payload = this.formaterPourGoogleSheets(commande);

      const response = await fetch(this.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      return {
        success: true,
        data: { message: 'Commande envoyée vers Google Sheets' },
        statusCode: response.status
      };

    } catch (error) {
      console.error('Erreur Google Sheets Service:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        statusCode: 500
      };
    }
  }

  /**
   * Formate les données pour correspondre EXACTEMENT aux colonnes Excel ZRExpress
   */
  private formaterPourGoogleSheets(commande: CommandeData): GoogleSheetPayload {
    // Nettoyage du code wilaya (ex: "16- Alger" -> "Alger")
    // Note: L'import ZRExpress semble accepter le nom de la wilaya
    // Si la wilaya contient un tiret, on prend la partie après, sinon tout
    const cleanWilaya = commande.wilaya.includes('-') 
      ? commande.wilaya.split('-')[1].trim() 
      : commande.wilaya;

    const isStopDesk = commande.deliveryType === 'stop_desk';

    return {
      "Nom complet": commande.nomClient,
      "Téléphone 1": commande.telephone,
      "Téléphone 2": "", // Facultatif
      "Produit": commande.produit,
      "Quantité": commande.quantite,
      "SKU": "", // Facultatif
      "Type de stock": "", // Facultatif
      "Adresse": isStopDesk ? "" : commande.adresse, // Vide si Stopdesk selon le modèle ? Ou adresse du bureau ? Le modèle dit "Adresse" facultatif.
      "Wilaya": cleanWilaya,
      "Commune": commande.commune,
      "Prix total de la commande": commande.totalPrice,
      "Note": isStopDesk ? "Livraison au bureau (StopDesk)" : "Livraison à domicile",
      "ID": "", // Facultatif
      "Stopdesk": isStopDesk ? "OUI" : "NON",
      "Nom StopDesk": isStopDesk ? commande.adresse : "" // On met le nom du bureau/adresse dans Nom StopDesk si c'est activé
    };
  }
}

export const googleSheetsService = new GoogleSheetsService();
