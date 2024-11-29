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
    const query = 'INSERT INTO tests (name, status, created_at, updated_at, project_id, user_id) VALUES (?, ?, NOW(), NOW(), ?, ?)';
    
    connection.query(query, [name, status, project_id, user_id], (err, result) => {
        if (err) {
            console.error('Error creating test:', err);
            res.status(500).json({ 
                message: 'An error occurred while creating the test', 
                error: err.message 
            });
            return;
        }
        res.status(201).json({ id: result.insertId, message: 'Test created successfully' });
    });
};

// Actualizar prueba
const updateTest = (req, res) => {
    const { id } = req.params;
    const { name, project_id, status, user_id } = req.body;
    const query = 'UPDATE tests SET name = ?, status = ?, updated_at = NOW(), project_id = ?, user_id = ? WHERE id = ?';
    
    connection.query(query, [name, status, project_id, user_id, id], (err, result) => {
        if (err) {
            console.error('Error updating test:', err);
            res.status(500).json({ 
                message: 'An error occurred while updating the test', 
                error: err.message 
            });
            return;
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Test not found' });
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