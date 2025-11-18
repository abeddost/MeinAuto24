const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const offerController = require('../controllers/offerController');
const upload = require('../middleware/upload');

// Validation rules
const offerValidation = [
    body('brand').notEmpty().withMessage('Marke ist erforderlich'),
    body('model').notEmpty().withMessage('Modell ist erforderlich'),
    body('year').notEmpty().withMessage('Jahr ist erforderlich'),
    body('doors').notEmpty().withMessage('Anzahl der Türen ist erforderlich'),
    body('fuelType').notEmpty().withMessage('Kraftstoffart ist erforderlich'),
    body('transmission').notEmpty().withMessage('Getriebeart ist erforderlich'),
    body('condition').notEmpty().withMessage('Zustand ist erforderlich'),
    body('mileage').notEmpty().withMessage('Kilometerstand ist erforderlich'),
    body('salutation').notEmpty().withMessage('Anrede ist erforderlich'),
    body('firstName').notEmpty().withMessage('Vorname ist erforderlich'),
    body('lastName').notEmpty().withMessage('Nachname ist erforderlich'),
    body('email').isEmail().withMessage('Gültige E-Mail ist erforderlich'),
    body('phone').notEmpty().withMessage('Telefonnummer ist erforderlich'),
    body('postalCode').matches(/^[0-9]{5}$/).withMessage('Gültige Postleitzahl ist erforderlich'),
    body('desiredPrice').isFloat({ min: 0 }).withMessage('Gültiger Preis ist erforderlich'),
    body('privacy').equals('on').withMessage('Datenschutzerklärung muss akzeptiert werden')
];

// Submit offer endpoint
router.post('/submit-offer', 
    upload.array('images', 5), 
    offerValidation,
    offerController.submitOffer
);

// Health check
router.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server ist erreichbar' });
});

module.exports = router;

