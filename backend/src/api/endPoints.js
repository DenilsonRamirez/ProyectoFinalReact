const express = require('express');
const router = express.Router();

// Importar controladores existentes
const { ping } = require('../controllers/pingController');
const { login } = require('../controllers/loginController');
// Nuevos controladores
const { 
    getAllProjects,
    createProject,
    updateProject,
    deleteProject 
} = require('../controllers/projectController');

const { 
    getAllTests,
    createTest,
    updateTest,
    deleteTest 
} = require('../controllers/testController');

const {
    getStats,
    getMonthlyProgress
} = require('../controllers/reportController');

// Middleware de autenticación
const { verifyToken } = require('../middleware/auth');

// Rutas existentes
router.get('/ping', ping);
router.post('/login', login);

// Rutas de Proyectos (protegidas)
router.get('/projects', verifyToken, getAllProjects);
router.post('/projects', verifyToken, createProject);
router.put('/projects/:id', verifyToken, updateProject);
router.delete('/projects/:id', verifyToken, deleteProject);

// Rutas de Pruebas (protegidas)
router.get('/tests', verifyToken, getAllTests);
router.post('/tests', verifyToken, createTest);
router.put('/tests/:id', verifyToken, updateTest);
router.delete('/tests/:id', verifyToken, deleteTest);

// Rutas de Reportes (protegidas)
router.get('/stats', verifyToken, getStats);
router.get('/monthly-progress', verifyToken, getMonthlyProgress);

module.exports = router;