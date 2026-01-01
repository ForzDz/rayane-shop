// ============================================
// FICHIER : src/types/zrexpress.types.ts
// Types TypeScript pour l'API ZRExpress
// ============================================

/**
 * Configuration de l'API ZRExpress
 */
export interface ZRExpressConfig {
  apiUrl: string;
  tenantId: string;
  apiKey: string;
  bearerToken: string;
  timeout?: number;
  maxRetries?: number;
}

/**
 * Données de commande provenant du formulaire
 */
export interface CommandeData {
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

/**
 * Format de payload pour l'API ZRExpress
 * Basé sur la documentation officielle : POST /api/v1/products
 */
export interface ZRExpressPayload {
  // Informations client
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  
  // Adresse de livraison
  deliveryAddress: string;
  wilaya: string;
  commune: string;
  postalCode?: string;
  
  // Informations produit
  productName: string;
  productDescription?: string;
  quantity: number;
  unitPrice: number;
  
  // Montants
  subtotal: number;
  deliveryFee: number;
  totalAmount: number;
  
  // Type de livraison
  deliveryType: 'home' | 'office' | 'stop_desk';
  
  // Métadonnées
  reference: string;
  source: string;
  notes?: string;
  createdAt: string;
}

/**
 * Réponse de l'API ZRExpress
 */
export interface ZRExpressResponse {
  success: boolean;
  data?: {
    orderId?: string;
    trackingNumber?: string;
    status?: string;
    message?: string;
    [key: string]: any;
  };
  error?: string;
  statusCode?: number;
}

/**
 * Statut de livraison ZRExpress
 */
export enum ZRExpressStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  PROCESSING = 'processing',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned',
}

/**
 * Options de retry
 */
export interface RetryOptions {
  maxRetries: number;
  initialDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
}

/**
 * Erreur ZRExpress avec détails
 */
export interface ZRExpressError {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

/**
 * Résultat de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Log d'événement
 */
export interface ZRExpressLog {
  timestamp: string;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  data?: any;
}
