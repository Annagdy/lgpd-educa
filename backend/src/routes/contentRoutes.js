const express = require('express');
const contentController = require('../controllers/contentController');

const router = express.Router();

router.get('/modules', contentController.listModules);
router.get('/modules/:id', contentController.getModuleById);
router.get('/glossary', contentController.listGlossaryTerms);

module.exports = router;
