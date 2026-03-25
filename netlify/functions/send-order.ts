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
    const { orderId, nom, telephone, wilaya, commune, produits, total, deliveryType, deliveryPrice } = data;

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
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Subject format: 🛒 طلب جديد — RayanShop #ORDER_ID
    const subject = `🛒 طلب جديد — RayanShop #${orderId || 'N/A'}`;

    // Contenu de l'email (format professionnel en arabe)
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: "yacinemed2020@gmail.com", // Destination (Admin/Owner)
      subject: subject,
      html: `
        <div dir="rtl" style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 25px; border: 1px solid #e2e8f0; border-radius: 16px; background-color: #ffffff;">
          <div style="text-align: center; margin-bottom: 25px;">
            <h1 style="color: #0ea5e9; margin: 0; font-size: 24px;">📦 طلب جديد من المتجر!</h1>
            <p style="color: #64748b; margin-top: 5px;">رقم الطلب: <strong style="color: #0f172a;">#${orderId || 'غير معروف'}</strong></p>
          </div>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 12px; margin-bottom: 25px; border-right: 4px solid #0ea5e9;">
            <h3 style="margin-top: 0; color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px;">👤 معلومات الزبون</h3>
            <p style="margin: 8px 0;"><strong>الاسم:</strong> ${nom}</p>
            <p style="margin: 8px 0;"><strong>الهاتف:</strong> <a href="tel:${telephone}" style="color: #0ea5e9; text-decoration: none; font-weight: bold;">${telephone}</a></p>
            <p style="margin: 8px 0;"><strong>الولاية:</strong> ${wilaya}</p>
            <p style="margin: 8px 0;"><strong>العنوان:</strong> ${commune || ''}</p>
            <p style="margin: 8px 0;"><strong>طريقة التوصيل:</strong> ${deliveryType === 'domicile' ? '🏠 للمنزل' : '📦 مكتب ZR Express (المكتب)'}</p>
          </div>
          
          <div style="margin-bottom: 25px;">
            <h3 style="color: #0f172a; border-bottom: 1px solid #e2e8f0; padding-bottom: 10px; margin-bottom: 15px;">🛒 تفاصيل الطلبية</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f1f5f9;">
                  <th style="padding: 12px; text-align: right; border-bottom: 2px solid #e2e8f0;">المنتج</th>
                  <th style="padding: 12px; text-align: left; border-bottom: 2px solid #e2e8f0;">السعر</th>
                </tr>
              </thead>
              <tbody>
                ${produits.map((p: any) => `
                  <tr>
                    <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #334155;">${p.name} ${p.quantity ? `(x${p.quantity})` : ''}</td>
                    <td style="padding: 12px; text-align: left; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: bold;">${typeof p.price === 'number' ? p.price.toLocaleString("fr-DZ") : p.price} DA</td>
                  </tr>
                `).join("")}
                <tr>
                  <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; color: #64748b;">سعر التوصيل</td>
                  <td style="padding: 12px; text-align: left; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${typeof deliveryPrice === 'number' ? deliveryPrice.toLocaleString("fr-DZ") : deliveryPrice} DA</td>
                </tr>
              </tbody>
              <tfoot>
                <tr style="background-color: #f8fafc;">
                  <td style="padding: 15px; font-weight: bold; color: #0f172a; font-size: 18px;">المجموع الكلي</td>
                  <td style="padding: 15px; text-align: left; color: #0ea5e9; font-size: 22px; font-weight: 800;">${typeof total === 'number' ? total.toLocaleString("fr-DZ") : total} DA</td>
                </tr>
              </tfoot>
            </table>
          </div>
          
          <div style="background-color: #fffbeb; padding: 15px; border-radius: 12px; border-right: 4px solid #f59e0b; margin-top: 10px; text-align: center;">
            <p style="margin: 0; color: #92400e; font-size: 15px;">⚡ <strong>تنبيه:</strong> اتصل بالزبون على الرقم <strong style="font-size: 18px;">${telephone}</strong> لتأكيد الطلب الآن.</p>
          </div>
          
          <div style="text-align: center; color: #94a3b8; font-size: 12px; margin-top: 30px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
            <p>يتم إرسال هذا التنبيه تلقائياً عند كل طلب جديد من متجر Rayan Shop.</p>
          </div>
        </div>
      `,
    };

    console.log('Attempting to send email for order:', orderId);
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

