const sgMail = require('@sendgrid/mail');

// CORS headers
const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
};

exports.handler = async (event) => {
    // Handle CORS preflight
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: '',
        };
    }

    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        // Check if API key is set
        if (!process.env.SENDGRID_API_KEY) {
            console.error('SENDGRID_API_KEY is not set');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ error: 'Server configuration error', details: 'SENDGRID_API_KEY not configured' }),
            };
        }

        console.log('SENDGRID_API_KEY is set:', process.env.SENDGRID_API_KEY ? 'Yes' : 'No');

        // Set API key
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);

        const data = JSON.parse(event.body);

        // Support both formats (old and new)
        const fullName = data.fullName || data.nom;
        const phone = data.phone || data.telephone;
        const wilaya = data.wilaya;
        const commune = data.commune;
        const deliveryType = data.deliveryType;
        const productName = data.productName || (data.produits && data.produits[0]?.name) || 'Produit';
        const productPrice = data.productPrice || (data.produits && data.produits[0]?.price) || 0;
        const deliveryPrice = data.deliveryPrice || 0;
        const totalPrice = data.totalPrice || data.total || (productPrice + deliveryPrice);

        // Email to the shop owner
        const msg = {
            to: 'yacinemed2020@gmail.com',
            from: 'yacinemed2020@gmail.com', // Must be verified in SendGrid
            subject: '🛍️ Nouvelle commande - Rayan shop',
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h2 style="color: #2563eb; margin-bottom: 20px;">📦 Nouvelle Commande Reçue</h2>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #334155; margin-top: 0;">👤 Informations Client</h3>
              <p style="margin: 8px 0;"><strong>Nom complet:</strong> ${fullName}</p>
              <p style="margin: 8px 0;"><strong>Téléphone:</strong> <a href="tel:${phone}">${phone}</a></p>
              <p style="margin: 8px 0;"><strong>Wilaya:</strong> ${wilaya}</p>
              <p style="margin: 8px 0;"><strong>Commune:</strong> ${commune}</p>
              <p style="margin: 8px 0;"><strong>Mode de livraison:</strong> ${deliveryType === 'domicile' ? '🏠 À domicile' : '📦 Stop Desk'}</p>
            </div>

            <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #334155; margin-top: 0;">🛒 Détails de la Commande</h3>
              <p style="margin: 8px 0;"><strong>Produit:</strong> ${productName}</p>
              <p style="margin: 8px 0;"><strong>Prix produit:</strong> ${productPrice} DA</p>
              <p style="margin: 8px 0;"><strong>Prix livraison:</strong> ${deliveryPrice} DA</p>
              <p style="margin: 16px 0 0 0; font-size: 18px; color: #2563eb;"><strong>💰 Total:</strong> ${totalPrice} DA</p>
            </div>

            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; border-left: 4px solid #f59e0b;">
              <p style="margin: 0; color: #92400e;">⚡ <strong>Action requise:</strong> Contactez le client au ${phone} pour confirmer la commande.</p>
            </div>
          </div>
          
          <p style="text-align: center; color: #64748b; font-size: 12px; margin-top: 20px;">
            Rayan shop - Système de gestion des commandes
          </p>
        </div>
      `,
        };

        console.log('Attempting to send email to:', msg.to);
        const result = await sgMail.send(msg);
        console.log('Email sent successfully:', result);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
        console.error('Error stack:', error.stack);
        
        // More detailed error information
        let errorMessage = error.message || 'Unknown error';
        let errorDetails = '';
        
        if (error.response) {
            // SendGrid API error
            errorDetails = JSON.stringify(error.response.body || error.response);
            errorMessage = `SendGrid API error: ${errorMessage}`;
            console.error('SendGrid response:', error.response.body);
        }
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to send email', 
                details: errorMessage,
                fullError: errorDetails || error.toString()
            }),
        };
    }
};

