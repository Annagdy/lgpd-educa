const express = require('express');
const contentController = require('../controllers/contentController');
const authenticateToken = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/modules', contentController.listModules);
router.get('/modules/:id', contentController.getModuleById);
router.post('/modules/:id/complete', authenticateToken, contentController.completeModule);
router.get('/modules/:id/quiz', authenticateToken, contentController.getModuleQuiz);
router.post('/modules/:id/quiz/realizar', authenticateToken, contentController.realizarModuleQuiz);
router.get('/glossary', contentController.listGlossaryTerms);
router.get('/quiz', authenticateToken, contentController.getQuiz);
router.post('/quiz/realizar', authenticateToken, contentController.realizarQuiz);
router.get('/profile', authenticateToken, contentController.getProfile);
router.get('/ranking', authenticateToken, contentController.getRanking);

module.exports = router;
