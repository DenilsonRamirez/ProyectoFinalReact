// controllers/reportController.js
const connection = require('../models/db');

// Obtener estadísticas generales
const getStats = (req, res) => {
    const query = `
        SELECT 
            COUNT(*) as totalTests,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as passedTests,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as failedTests,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendingTests
        FROM tests
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }

        const stats = results[0];
        stats.successRate = ((stats.passedTests / stats.totalTests) * 100).toFixed(2) + '%';
        
        res.json(stats);
    });
};

// Obtener progreso mensual
const getMonthlyProgress = (req, res) => {
    const query = `
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') as month,
            SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completadas,
            SUM(CASE WHEN status = 'failed' THEN 1 ELSE 0 END) as fallidas,
            SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pendientes
        FROM tests
        GROUP BY DATE_FORMAT(created_at, '%Y-%m')
        ORDER BY month DESC
        LIMIT 6
    `;
    
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
};

module.exports = {
    getStats,
    getMonthlyProgress
};