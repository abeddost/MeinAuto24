const nodemailer = require('nodemailer');

// Create transporter (configure with your email service)
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
});

// Send confirmation email to customer
const sendCustomerConfirmation = async (offerData) => {
    try {
        const mailOptions = {
            from: `"MeinAutoPreis24" <${process.env.SMTP_USER}>`,
            to: offerData.email,
            subject: 'Ihr Angebot wurde erhalten - MeinAutoPreis24',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e40af;">Vielen Dank für Ihr Angebot, ${offerData.firstName}!</h2>
                    <p>Wir haben Ihre Anfrage erhalten und werden uns in Kürze bei Ihnen melden.</p>
                    
                    <h3 style="color: #1e293b;">Ihre Angaben:</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 8px 0;"><strong>Fahrzeug:</strong></td>
                            <td>${offerData.brand} ${offerData.model} (${offerData.year})</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 8px 0;"><strong>Kilometerstand:</strong></td>
                            <td>${offerData.mileage}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 8px 0;"><strong>Zustand:</strong></td>
                            <td>${offerData.condition}</td>
                        </tr>
                        <tr style="border-bottom: 1px solid #e2e8f0;">
                            <td style="padding: 8px 0;"><strong>Ihr Wunschpreis:</strong></td>
                            <td>${offerData.desiredPrice.toFixed(2)} €</td>
                        </tr>
                    </table>
                    
                    <p style="margin-top: 20px;">Unser Team wird Ihr Fahrzeug bewerten und Ihnen ein faires Angebot unterbreiten.</p>
                    
                    <p style="margin-top: 30px;">Mit freundlichen Grüßen,<br><strong>Ihr MeinAutoPreis24 Team</strong></p>
                    
                    <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
                    <div style="font-size: 12px; color: #64748b;">
                        <strong>HF Autohaus</strong><br>
                        Am Kuemmerling 41a<br>
                        55294 Bodenheim
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Bestätigungs-E-Mail gesendet an:', offerData.email);
    } catch (error) {
        console.error('❌ Fehler beim Senden der Bestätigungs-E-Mail:', error.message);
    }
};

// Send notification email to admin
const sendAdminNotification = async (offerData) => {
    try {
        const mailOptions = {
            from: `"MeinAutoPreis24" <${process.env.SMTP_USER}>`,
            to: process.env.ADMIN_EMAIL || process.env.SMTP_USER,
            subject: `🚗 Neues Angebot: ${offerData.brand} ${offerData.model}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #1e40af;">Neues Angebot erhalten</h2>
                    
                    <h3 style="color: #1e293b;">Kontaktinformationen:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 5px 0;"><strong>Name:</strong> ${offerData.salutation} ${offerData.firstName} ${offerData.lastName}</li>
                        <li style="padding: 5px 0;"><strong>E-Mail:</strong> ${offerData.email}</li>
                        <li style="padding: 5px 0;"><strong>Telefon:</strong> ${offerData.phone}</li>
                        <li style="padding: 5px 0;"><strong>PLZ:</strong> ${offerData.postalCode}</li>
                    </ul>
                    
                    <h3 style="color: #1e293b;">Fahrzeugdetails:</h3>
                    <ul style="list-style: none; padding: 0;">
                        <li style="padding: 5px 0;"><strong>Marke/Modell:</strong> ${offerData.brand} ${offerData.model}</li>
                        <li style="padding: 5px 0;"><strong>Baujahr:</strong> ${offerData.year}</li>
                        <li style="padding: 5px 0;"><strong>Türen:</strong> ${offerData.doors}</li>
                        <li style="padding: 5px 0;"><strong>Bauform:</strong> ${offerData.bodyType}</li>
                        <li style="padding: 5px 0;"><strong>Kraftstoff:</strong> ${offerData.fuelType}</li>
                        <li style="padding: 5px 0;"><strong>Getriebe:</strong> ${offerData.transmission}</li>
                        <li style="padding: 5px 0;"><strong>Zustand:</strong> ${offerData.condition}</li>
                        <li style="padding: 5px 0;"><strong>Kilometerstand:</strong> ${offerData.mileage}</li>
                        <li style="padding: 5px 0;"><strong>Leistung:</strong> ${offerData.power}</li>
                        <li style="padding: 5px 0;"><strong>FIN:</strong> ${offerData.vin}</li>
                        <li style="padding: 5px 0;"><strong>Schäden/Mängel:</strong> ${offerData.damages}</li>
                        <li style="padding: 5px 0;"><strong style="color: #f97316;">Wunschpreis:</strong> <strong style="color: #f97316;">${offerData.desiredPrice.toFixed(2)} €</strong></li>
                    </ul>
                    
                    <p><strong>Anzahl Bilder:</strong> ${offerData.images.length}</p>
                    <p><strong>Eingegangen am:</strong> ${new Date(offerData.submittedAt).toLocaleString('de-DE')}</p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Admin-Benachrichtigung gesendet');
    } catch (error) {
        console.error('❌ Fehler beim Senden der Admin-Benachrichtigung:', error.message);
    }
};

module.exports = {
    sendCustomerConfirmation,
    sendAdminNotification
};

