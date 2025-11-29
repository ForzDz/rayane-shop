import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const handler = async (event) => {
    // Only allow POST requests
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ error: 'Method not allowed' }),
        };
    }

    try {
        const data = JSON.parse(event.body);

        const {
            fullName,
            phone,
            wilaya,
            commune,
            deliveryType,
            productName,
            productPrice,
            deliveryPrice,
            totalPrice
        } = data;

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
              <p style="margin: 8px 0;"><strong>Téléphone:</strong> ${phone}</p>
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

        await sgMail.send(msg);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send email', details: error.message }),
        };
    }
};
