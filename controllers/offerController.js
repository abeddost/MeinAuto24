const { validationResult } = require('express-validator');
const emailService = require('../utils/emailService');

const submitOffer = async (req, res) => {
    try {
        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: 'Validierungsfehler',
                errors: errors.array()
            });
        }

        // Extract form data
        const offerData = {
            // Car details
            brand: req.body.brand,
            model: req.body.model,
            year: req.body.year,
            doors: req.body.doors,
            bodyType: req.body.bodyType || 'Nicht angegeben',
            
            // Technical details
            fuelType: req.body.fuelType,
            transmission: req.body.transmission,
            condition: req.body.condition,
            mileage: req.body.mileage,
            power: req.body.power || 'Nicht angegeben',
            damages: req.body.damages || 'Keine',
            
            // Additional info
            vin: req.body.vin || 'Nicht angegeben',
            
            // Contact information
            salutation: req.body.salutation,
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            phone: req.body.phone,
            postalCode: req.body.postalCode,
            desiredPrice: parseFloat(req.body.desiredPrice),
            
            // Images
            images: req.files ? req.files.map(file => file.filename) : [],
            
            // Timestamp
            submittedAt: new Date().toISOString()
        };

        // Log the offer (in production, save to database)
        console.log('📝 Neues Angebot erhalten:', {
            customer: `${offerData.firstName} ${offerData.lastName}`,
            car: `${offerData.brand} ${offerData.model} (${offerData.year})`,
            price: `${offerData.desiredPrice} €`
        });

        // Send confirmation email to customer
        await emailService.sendCustomerConfirmation(offerData);

        // Send notification email to admin
        await emailService.sendAdminNotification(offerData);

        // Return success response
        res.json({
            success: true,
            message: 'Vielen Dank! Ihr Angebot wurde erfolgreich übermittelt. Wir werden uns in Kürze bei Ihnen melden.',
            offerId: Date.now().toString()
        });

    } catch (error) {
        console.error('❌ Fehler beim Verarbeiten des Angebots:', error);
        res.status(500).json({
            success: false,
            message: 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.'
        });
    }
};

module.exports = {
    submitOffer
};

