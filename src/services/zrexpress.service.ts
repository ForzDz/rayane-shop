// ============================================
// FICHIER : src/services/zrexpress.service.ts
// Service pour gérer les appels API ZRExpress
// ============================================

interface CommandeData {
  nomClient: string;
  telephone: string;
  adresse: string;
  wilaya: string;
  commune: string;
  produit: string;
  quantite: number;
  prix: number;
  deliveryType: string;
  deliveryPrice: number;
  totalPrice: number;
}

interface ZRExpressResponse {
  success: boolean;
  data?: any;
  error?: string;
}

class ZRExpressService {
  // OPTION 1 : Via Make.com (Recommandé - Simple pour site statique)
  // URL construite à partir de l'ID fourni. 
  // NOTE IMPORTANTE : Si cela ne marche pas, vérifiez que vous avez bien choisi "Custom Webhook" sur Make et non "Mailhook".
  private readonly MAKE_WEBHOOK_URL = 'https://hook.eu1.make.com/gmu4t6c3kj5x7qaqjrcc2ar6j21rmmns'; 
  
  // OPTION 2 : Via votre propre API Backend
  private readonly BACKEND_API_URL = 'https://votre-backend.com/api/zrexpress'; 

  // OPTION 3: Directement via API ZRExpress (Seulement si vous avez le token et que c'est sécurisé/public)
  // Note: Appeler directement l'API ZRExpress depuis le navigateur expose votre Token API.
  // Il est fortement recommandé d'utiliser une fonction Netlify ou Make.com (Option 1).
  
  /**
   * Envoie une commande via Make.com (Solution simple sans backend)
   */
  async envoyerCommandeViaMake(commande: CommandeData): Promise<ZRExpressResponse> {
    try {
      // Validation basique
      if (this.MAKE_WEBHOOK_URL.includes('VOTRE_URL')) {
         console.warn("⚠️ Attention: L'URL Webhook Make.com n'est pas configurée.");
      }

      const response = await fetch(this.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...commande,
          dateCommande: new Date().toISOString(),
          reference: `CMD-${Date.now()}`,
          source: 'rayane-shop'
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return { success: true, data };
      
    } catch (error) {
      console.error('❌ Erreur Make.com:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }

  /**
   * Envoie une commande via votre backend personnalisé
   */
  async envoyerCommandeViaBackend(commande: CommandeData): Promise<ZRExpressResponse> {
    try {
      const response = await fetch(`${this.BACKEND_API_URL}/creer-commande`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(commande)
      });

      if (!response.ok) {
        throw new Error(`Erreur HTTP: ${response.status}`);
      }

      const data = await response.json();
      return data;
      
    } catch (error) {
      console.error('❌ Erreur Backend:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Erreur inconnue' 
      };
    }
  }
}

export const zrExpressService = new ZRExpressService();
export type { CommandeData, ZRExpressResponse };
