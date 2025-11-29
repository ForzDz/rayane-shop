import type { Handler } from "@netlify/functions";
import nodemailer from "nodemailer";

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

const handler: Handler = async (event) => {
  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: corsHeaders,
      body: '',
    };
  }

  if (event.httpMethod !== "POST") {
    return { 
      statusCode: 405, 
      headers: corsHeaders,
      body: JSON.stringify({ error: "Method Not Allowed" })
    };
  }

  try {
    const data = JSON.parse(event.body || "{}");
    const { nom, telephone, wilaya, commune, produits, total, deliveryType, deliveryPrice } = data;

    // Vérifier les variables d'environnement
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error("EMAIL_USER or EMAIL_PASS not configured");
      return {
        statusCode: 500,
        headers: corsHeaders,
        body: JSON.stringify({ 
          message: "Configuration email manquante",
          error: "EMAIL_USER or EMAIL_PASS not configured"
        }),
      };
    }

    // Configuration du transporteur (Gmail)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Votre email (variable d'env)
        pass: process.env.EMAIL_PASS, // Votre mot de passe d'application (variable d'env)
      },
    });

    // Contenu de l'email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "yacinemed2020@gmail.com", // Votre adresse de réception
      subject: `🛍️ Nouvelle Commande de ${nom}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <h1 style="color: #2563eb; text-align: center;">📦 Nouvelle Commande !</h1>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin-top: 0; color: #1e293b;">👤 Informations Client</h3>
            <p><strong>Nom:</strong> ${nom}</p>
            <p><strong>Téléphone:</strong> <a href="tel:${telephone}">${telephone}</a></p>
            <p><strong>Adresse:</strong> ${commune}, ${wilaya}</p>
            <p><strong>Livraison:</strong> ${deliveryType === 'domicile' ? '🏠 À Domicile' : '📦 Stop Desk (Bureau)'}</p>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #1e293b;">🛒 Détails de la commande</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f1f5f9;">
                  <th style="padding: 10px; text-align: left; border-bottom: 1px solid #e2e8f0;">Produit</th>
                  <th style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">Prix</th>
                </tr>
              </thead>
              <tbody>
                ${produits.map((p: any) => `
                  <tr>
                    <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">${p.name} ${p.quantity ? `(x${p.quantity})` : ''}</td>
                    <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">${typeof p.price === 'number' ? p.price.toLocaleString() : p.price} DA</td>
                  </tr>
                `).join("")}
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #e2e8f0;">Livraison</td>
                  <td style="padding: 10px; text-align: right; border-bottom: 1px solid #e2e8f0;">${typeof deliveryPrice === 'number' ? deliveryPrice.toLocaleString() : deliveryPrice} DA</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style="font-weight: bold; background-color: #f8fafc;">
                  <td style="padding: 10px; border-top: 2px solid #2563eb;">Total</td>
                  <td style="padding: 10px; text-align: right; border-top: 2px solid #2563eb; color: #2563eb; font-size: 1.2em;">${typeof total === 'number' ? total.toLocaleString() : total} DA</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b; margin-top: 20px;">
            <p style="margin: 0; color: #92400e;">⚡ <strong>Action requise:</strong> Contactez le client au ${telephone} pour confirmer la commande.</p>
          </div>
          
          <div style="text-align: center; color: #64748b; font-size: 0.8em; margin-top: 30px;">
            <p>Cet email a été envoyé automatiquement depuis votre site Rayan Shop.</p>
          </div>
        </div>
      `,
    };

    console.log('Attempting to send email to:', mailOptions.to);
    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully');

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ message: "Email envoyé avec succès !" }),
    };
  } catch (error) {
    console.error("Erreur d'envoi:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : '');
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ 
        message: "Erreur lors de l'envoi de l'email",
        error: error instanceof Error ? error.message : String(error)
      }),
    };
  }
};

export { handler };

