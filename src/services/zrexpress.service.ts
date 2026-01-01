// ============================================
// FICHIER : src/services/zrexpress.service.ts
// Service amélioré pour gérer les appels API ZRExpress
// Avec retry automatique, validation et gestion d'erreurs
// ============================================

import type { 
  CommandeData, 
  ZRExpressResponse, 
  ZRExpressPayload,
  RetryOptions,
  ValidationResult,
  ZRExpressLog
} from '@/types/zrexpress.types';

/**
 * Service ZRExpress - Gestion complète de l'intégration API
 * 
 * Fonctionnalités :
 * ✅ Envoi de commandes via Make.com (recommandé pour site statique)
 * ✅ Système de retry automatique avec backoff exponentiel
 * ✅ Validation des données avant envoi
 * ✅ Gestion d'erreurs détaillée (français/arabe)
 * ✅ Logging structuré pour débogage
 * ✅ Timeout configurable
 */
class ZRExpressService {
  // Configuration
  private readonly MAKE_WEBHOOK_URL = import.meta.env.VITE_MAKE_WEBHOOK_URL || 
    'https://hook.eu1.make.com/4ke5ajtsh13o93kksp5gyo6qt5qimqjj';
  
  private readonly TIMEOUT = parseInt(import.meta.env.VITE_ZREXPRESS_TIMEOUT || '10000');
  
  private readonly DEFAULT_RETRY_OPTIONS: RetryOptions = {
    maxRetries: 3,
    initialDelay: 1000, // 1 seconde
    maxDelay: 5000, // 5 secondes max
    backoffMultiplier: 2 // Double à chaque tentative
  };

  // Logs internes pour débogage
  private logs: ZRExpressLog[] = [];

  /**
   * ============================================
   * MÉTHODE PRINCIPALE : Envoi avec Retry
   * ============================================
   */
  async envoyerCommandeAvecRetry(
    commande: CommandeData, 
    options?: Partial<RetryOptions>
  ): Promise<ZRExpressResponse> {
    const retryOptions = { ...this.DEFAULT_RETRY_OPTIONS, ...options };
    let lastError: Error | null = null;

    // Validation avant d'essayer
    const validation = this.validerCommande(commande);
    if (!validation.isValid) {
      this.log('error', 'Validation échouée', { errors: validation.errors });
      return {
        success: false,
        error: `Données invalides: ${validation.errors.join(', ')}`,
        statusCode: 400
      };
    }

    // Tentatives avec retry
    for (let attempt = 1; attempt <= retryOptions.maxRetries; attempt++) {
      try {
        this.log('info', `Tentative ${attempt}/${retryOptions.maxRetries}`, { commande });
        
        const response = await this.envoyerCommandeViaMake(commande);
        
        if (response.success) {
          this.log('success', 'Commande envoyée avec succès', { response });
          return response;
        }

        // Si échec mais pas d'exception, on continue les tentatives
        lastError = new Error(response.error || 'Échec inconnu');
        this.log('warning', `Tentative ${attempt} échouée`, { error: response.error });

      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Erreur inconnue');
        this.log('error', `Erreur tentative ${attempt}`, { error: lastError.message });
      }

      // Attendre avant la prochaine tentative (sauf si c'est la dernière)
      if (attempt < retryOptions.maxRetries) {
        const delay = Math.min(
          retryOptions.initialDelay * Math.pow(retryOptions.backoffMultiplier, attempt - 1),
          retryOptions.maxDelay
        );
        this.log('info', `Attente de ${delay}ms avant nouvelle tentative`);
        await this.sleep(delay);
      }
    }

    // Toutes les tentatives ont échoué
    const errorMessage = lastError?.message || 'Échec après plusieurs tentatives';
    this.log('error', 'Échec final après tous les retry', { error: errorMessage });
    
    return {
      success: false,
      error: errorMessage,
      statusCode: 500
    };
  }

  /**
   * ============================================
   * Envoi via Make.com (Recommandé)
   * ============================================
   */
  async envoyerCommandeViaMake(commande: CommandeData): Promise<ZRExpressResponse> {
    try {
      // Vérification de la configuration
      if (this.MAKE_WEBHOOK_URL.includes('VOTRE_URL')) {
        this.log('error', 'URL Make.com non configurée');
        throw new Error('URL Webhook Make.com non configurée dans .env');
      }

      // Formater les données pour ZRExpress
      const payload = this.formaterPourZRExpress(commande);

      // Envoi avec timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.TIMEOUT);

      const response = await fetch(this.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Erreur HTTP ${response.status}: ${response.statusText}`);
      }

      // Parse de la réponse
      let data;
      try {
        data = await response.json();
      } catch {
        // Si pas de JSON, on considère que c'est un succès
        data = { message: 'OK' };
      }

      return { 
        success: true, 
        data,
        statusCode: response.status
      };

    } catch (error) {
      // Gestion des erreurs spécifiques
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            success: false,
            error: 'Timeout: La requête a pris trop de temps',
            statusCode: 408
          };
        }

        // Erreur réseau
        if (error.message.includes('fetch')) {
          return {
            success: false,
            error: 'Erreur de connexion. Vérifiez votre connexion internet.',
            statusCode: 0
          };
        }
      }

      return {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur inconnue',
        statusCode: 500
      };
    }
  }

  /**
   * ============================================
   * Validation des données
   * ============================================
   */
  validerCommande(commande: CommandeData): ValidationResult {
    const errors: string[] = [];

    // Nom client
    if (!commande.nomClient || commande.nomClient.trim().length < 2) {
      errors.push('Le nom du client est requis (min 2 caractères)');
    }

    // Téléphone (format algérien)
    const phoneRegex = /^(05|06|07)[0-9]{8}$/;
    if (!commande.telephone || !phoneRegex.test(commande.telephone)) {
      errors.push('Le numéro de téléphone doit être au format algérien (05/06/07 + 8 chiffres)');
    }

    // Adresse (sauf si stop desk)
    if (commande.deliveryType !== 'stop_desk' && (!commande.adresse || commande.adresse.trim().length < 5)) {
      errors.push('L\'adresse est requise (min 5 caractères)');
    }

    // Wilaya
    if (!commande.wilaya || commande.wilaya.trim() === '') {
      errors.push('La wilaya est requise');
    }

    // Commune (sauf si stop desk)
    if (commande.deliveryType !== 'stop_desk' && (!commande.commune || commande.commune.trim() === '')) {
      errors.push('La commune est requise');
    }

    // Produit
    if (!commande.produit || commande.produit.trim() === '') {
      errors.push('Le nom du produit est requis');
    }

    // Quantité
    if (!commande.quantite || commande.quantite < 1) {
      errors.push('La quantité doit être au moins 1');
    }

    // Prix
    if (!commande.prix || commande.prix <= 0) {
      errors.push('Le prix doit être supérieur à 0');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * ============================================
   * Formatage pour l'API ZRExpress
   * ============================================
   */
  formaterPourZRExpress(commande: CommandeData): ZRExpressPayload {
    // Nettoyer le code wilaya (enlever le préfixe numérique)
    const cleanWilaya = commande.wilaya.replace(/^\d+-/, '');

    return {
      // Informations client
      customerName: commande.nomClient,
      customerPhone: commande.telephone,
      
      // Adresse de livraison
      deliveryAddress: commande.adresse,
      wilaya: cleanWilaya,
      commune: commande.commune,
      
      // Informations produit
      productName: commande.produit,
      quantity: commande.quantite,
      unitPrice: commande.prix,
      
      // Montants
      subtotal: commande.prix * commande.quantite,
      deliveryFee: commande.deliveryPrice,
      totalAmount: commande.totalPrice,
      
      // Type de livraison
      deliveryType: commande.deliveryType === 'stop_desk' ? 'office' : 'home',
      
      // Métadonnées
      reference: `CMD-${Date.now()}`,
      source: 'rayane-shop',
      createdAt: new Date().toISOString()
    };
  }

  /**
   * ============================================
   * Test de connexion à l'API
   * ============================================
   */
  async testerConnexion(): Promise<boolean> {
    try {
      this.log('info', 'Test de connexion à Make.com webhook');
      
      const response = await fetch(this.MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ test: true, timestamp: Date.now() })
      });

      const success = response.ok;
      this.log(success ? 'success' : 'error', 
        success ? 'Connexion réussie' : 'Connexion échouée', 
        { status: response.status }
      );

      return success;
    } catch (error) {
      this.log('error', 'Erreur de connexion', { error });
      return false;
    }
  }

  /**
   * ============================================
   * Récupérer les logs (débogage)
   * ============================================
   */
  getLogs(): ZRExpressLog[] {
    return [...this.logs];
  }

  /**
   * Vider les logs
   */
  clearLogs(): void {
    this.logs = [];
  }

  /**
   * ============================================
   * Utilitaires internes
   * ============================================
   */
  
  private log(
    level: 'info' | 'warning' | 'error' | 'success', 
    message: string, 
    data?: any
  ): void {
    const logEntry: ZRExpressLog = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data
    };

    this.logs.push(logEntry);

    // Console log pour développement
    const emoji = {
      info: 'ℹ️',
      warning: '⚠️',
      error: '❌',
      success: '✅'
    };

    console.log(`${emoji[level]} [ZRExpress] ${message}`, data || '');
    
    // Garder seulement les 50 derniers logs en mémoire
    if (this.logs.length > 50) {
      this.logs = this.logs.slice(-50);
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * ============================================
   * Messages d'erreur bilingues
   * ============================================
   */
  getErrorMessage(error: string): { fr: string; ar: string } {
    const messages: Record<string, { fr: string; ar: string }> = {
      timeout: {
        fr: 'La requête a pris trop de temps. Veuillez réessayer.',
        ar: 'استغرق الطلب وقتًا طويلاً. يرجى المحاولة مرة أخرى.'
      },
      network: {
        fr: 'Erreur de connexion. Vérifiez votre connexion internet.',
        ar: 'خطأ في الاتصال. تحقق من اتصالك بالإنترنت.'
      },
      validation: {
        fr: 'Certaines informations sont incorrectes. Vérifiez le formulaire.',
        ar: 'بعض المعلومات غير صحيحة. تحقق من النموذج.'
      },
      server: {
        fr: 'Erreur serveur. Veuillez réessayer dans quelques instants.',
        ar: 'خطأ في الخادم. يرجى المحاولة بعد لحظات.'
      },
      unknown: {
        fr: 'Une erreur est survenue. Veuillez réessayer.',
        ar: 'حدث خطأ. يرجى المحاولة مرة أخرى.'
      }
    };

    // Déterminer le type d'erreur
    if (error.includes('Timeout') || error.includes('timeout')) {
      return messages.timeout;
    }
    if (error.includes('connexion') || error.includes('fetch') || error.includes('network')) {
      return messages.network;
    }
    if (error.includes('invalide') || error.includes('Validation')) {
      return messages.validation;
    }
    if (error.includes('HTTP') || error.includes('500')) {
      return messages.server;
    }

    return messages.unknown;
  }
}

// Export singleton
export const zrExpressService = new ZRExpressService();

// Export du type pour utilisation dans d'autres fichiers
export type { CommandeData, ZRExpressResponse };

// Fonction globale de test (développement uniquement)
if (import.meta.env.DEV) {
  (window as any).testZRExpressConnection = async () => {
    const result = await zrExpressService.testerConnexion();
    console.log(result ? '✅ Connexion ZRExpress réussie' : '❌ Connexion ZRExpress échouée');
    return result;
  };
}
