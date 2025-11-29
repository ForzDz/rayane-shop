/**
 * Netlify Function - Send Email
 * Envoie un email à l'admin et une confirmation au client
 * 
 * Variables d'environnement requises:
 * - SENDGRID_API_KEY
 * - ADMIN_EMAIL
 * - FROM_EMAIL
 */

const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
  // Headers CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Gérer les requêtes OPTIONS (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Vérifier la méthode
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parser les données du formulaire
    const data = JSON.parse(event.body);
    const { name, email, phone, subject, message } = data;

    // Validation des données
    if (!name || !email || !phone || !message) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Tous les champs sont requis' }),
      };
    }

    // Configuration SendGrid
    const apiKey = process.env.SENDGRID_API_KEY;
    const adminEmail = process.env.ADMIN_EMAIL;
    const fromEmail = process.env.FROM_EMAIL || 'noreply@boutiquedz.com';

    if (!apiKey || !adminEmail) {
      console.error('Variables d\'environnement manquantes');
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'Configuration email manquante' }),
      };
    }

    sgMail.setApiKey(apiKey);

    // Email pour l'admin
    const adminEmailContent = {
      to: adminEmail,
      from: fromEmail,
      subject: `Nouveau message de ${name} - ${subject || 'Contact'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Nouveau message reçu</h2>
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Nom:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Téléphone:</strong> ${phone}</p>
            ${subject ? `<p><strong>Sujet:</strong> ${subject}</p>` : ''}
          </div>
          <div style="background: white; padding: 20px; border-left: 4px solid #1e3a8a;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>
        </div>
      `,
    };

    // Email de confirmation au client
    const clientEmailContent = {
      to: email,
      from: fromEmail,
      subject: 'Confirmation de réception - Boutique DZ',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a8a;">Merci pour votre message !</h2>
          <p>Bonjour ${name},</p>
          <p>Nous avons bien reçu votre message et nous vous remercions de nous avoir contactés.</p>
          <p>Notre équipe vous répondra dans les plus brefs délais, généralement sous 24 heures.</p>
          
          <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Récapitulatif de votre message:</h3>
            <p style="white-space: pre-wrap; color: #4b5563;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Boutique DZ</strong><br>
              Alger, Algérie<br>
              Email: ${adminEmail}<br>
              Tél: +213 XXX XXX XXX
            </p>
          </div>
        </div>
      `,
    };

    // Envoyer les emails
    await sgMail.send(adminEmailContent);
    await sgMail.send(clientEmailContent);

    console.log('Emails envoyés avec succès:', { name, email });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ 
        success: true, 
        message: 'Emails envoyés avec succès' 
      }),
    };

  } catch (error) {
    console.error('Erreur lors de l\'envoi des emails:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Erreur lors de l\'envoi de l\'email',
        details: error.message 
      }),
    };
  }
};
