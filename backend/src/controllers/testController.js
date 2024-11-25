// controllers/testController.js
const connection = require('../models/db');

// Obtener todas las pruebas
const getAllTests = (req, res) => {
    const query = 'SELECT * FROM tests';
    
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
};

// Crear prueba
const createTest = (req, res) => {
    const { name, project_id, user_id, status = 'pending' } = req.body;
    const query = 'INSERT INTO tests (name, status, created_at, project_id, user_id) VALUES (?, ?, NOW(), ?, ?)';
    
    connection.query(query, [name, status, project_id, user_id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ id: result.insertId, message: 'Test created successfully' });
    });
};

// Actualizar prueba
const updateTest = (req, res) => {
    const { id } = req.params;
    const { name, status, user_id } = req.body;
    const query = 'UPDATE tests SET name = ?, status = ?, user_id = ? WHERE id = ?';
    
    connection.query(query, [name, status, user_id, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ message: 'Test updated successfully' });
    });
};

// Eliminar prueba
const deleteTest = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM tests WHERE id = ?';
    
    connection.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ message: 'Test deleted successfully' });
    });
};

module.exports = {
    getAllTests,
    createTest,
    updateTest,
    deleteTest
};