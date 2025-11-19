const { Resend } = require('resend');
const fs = require('fs');
const path = require('path');

// Initialize Resend with API key
const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
    console.error('❌ KRITISCHER FEHLER: RESEND_API_KEY ist nicht gesetzt!');
    throw new Error('RESEND_API_KEY environment variable is required. Please set it in your .env file.');
}
console.log('🔑 Resend API Key geladen:', `${apiKey.substring(0, 10)}...`);
const resend = new Resend(apiKey);

// Send confirmation email to customer
const sendCustomerConfirmation = async (offerData) => {
    try {
        console.log('📧 Starte Versand der Bestätigungs-E-Mail an:', offerData.email);
        
        const { data, error } = await resend.emails.send({
            from: 'MeinAutoPreis24 <meinautopreis24@resend.dev>',
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
        });

        if (error) {
            console.error('❌ Fehler beim Senden der Bestätigungs-E-Mail:', JSON.stringify(error, null, 2));
            console.error('❌ Error details:', error);
            return;
        }

        console.log('✅ Bestätigungs-E-Mail erfolgreich gesendet an:', offerData.email);
        console.log('✅ Resend Response:', data);
    } catch (error) {
        console.error('❌ Exception beim Senden der Bestätigungs-E-Mail:', error);
        console.error('❌ Error stack:', error.stack);
    }
};

// Helper function to read file and convert to base64
const readFileAsBase64 = (filePath) => {
    try {
        const fileBuffer = fs.readFileSync(filePath);
        return fileBuffer.toString('base64');
    } catch (error) {
        console.error(`❌ Fehler beim Lesen der Datei ${filePath}:`, error.message);
        return null;
    }
};

// Send notification email to admin
const sendAdminNotification = async (offerData) => {
    try {
        console.log('📧 Starte Versand der Admin-Benachrichtigung an: hfautohaus@gmail.com');
        
        // Prepare attachments from uploaded images (now compressed by client)
        const attachments = [];
        if (offerData.images && offerData.images.length > 0) {
            console.log(`📎 Verarbeite ${offerData.images.length} Bild(er) für E-Mail-Anhang...`);
            for (let i = 0; i < offerData.images.length; i++) {
                const image = offerData.images[i];
                const filePath = image.path;
                
                console.log(`📷 Verarbeite Bild ${i + 1}: ${filePath}`);
                
                if (fs.existsSync(filePath)) {
                    const stats = fs.statSync(filePath);
                    const fileSizeInKB = (stats.size / 1024).toFixed(2);
                    console.log(`   Größe: ${fileSizeInKB} KB`);
                    
                    const fileContent = readFileAsBase64(filePath);
                    if (fileContent) {
                        const ext = path.extname(image.originalname || image.filename).toLowerCase();
                        const filename = image.originalname || `image_${i + 1}${ext}`;
                        
                        attachments.push({
                            filename: filename,
                            content: fileContent
                        });
                        console.log(`✅ Bild ${i + 1} als Anhang hinzugefügt: ${filename} (${fileSizeInKB} KB)`);
                    } else {
                        console.warn(`⚠️ Konnte Bild ${i + 1} nicht lesen: ${filePath}`);
                    }
                } else {
                    console.warn(`⚠️ Datei nicht gefunden: ${filePath}`);
                }
            }
        } else {
            console.log('ℹ️ Keine Bilder zum Anhängen vorhanden');
        }

        const { data, error } = await resend.emails.send({
            from: 'MeinAutoPreis24 <meinautopreis24@resend.dev>',
            to: 'hfautohaus@gmail.com',
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
                    
                    <p><strong>Anzahl Bilder:</strong> ${offerData.images.length} ${attachments.length > 0 ? '(als Anhang beigefügt)' : ''}</p>
                    <p><strong>Eingegangen am:</strong> ${new Date(offerData.submittedAt).toLocaleString('de-DE')}</p>
                </div>
            `,
            attachments: attachments.length > 0 ? attachments : undefined
        });

        if (error) {
            console.error('❌ Fehler beim Senden der Admin-Benachrichtigung:', JSON.stringify(error, null, 2));
            console.error('❌ Error details:', error);
            return;
        }

        console.log(`✅ Admin-Benachrichtigung erfolgreich gesendet mit ${attachments.length} Bild(ern) als Anhang`);
        console.log('✅ Resend Response:', data);
    } catch (error) {
        console.error('❌ Exception beim Senden der Admin-Benachrichtigung:', error);
        console.error('❌ Error stack:', error.stack);
    }
};

module.exports = {
    sendCustomerConfirmation,
    sendAdminNotification
};

