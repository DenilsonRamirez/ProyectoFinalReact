// controllers/projectController.js
const connection = require('../models/db');

// Obtener todos los proyectos
const getAllProjects = (req, res) => {
    const query = 'SELECT * FROM projects';
    
    connection.query(query, (err, results) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json(results);
    });
};

// Crear proyecto
const createProject = (req, res) => {
    const { name, description } = req.body;
    const query = 'INSERT INTO projects (name, description, created_at, status) VALUES (?, ?, NOW(), "active")';
    
    connection.query(query, [name, description], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ id: result.insertId, message: 'Project created successfully' });
    });
};

// Actualizar proyecto
const updateProject = (req, res) => {
    const { id } = req.params;
    const { name, description, status } = req.body;
    const query = 'UPDATE projects SET name = ?, description = ?, status = ? WHERE id = ?';
    
    connection.query(query, [name, description, status, id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ message: 'Project updated successfully' });
    });
};

// Eliminar proyecto
const deleteProject = (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM projects WHERE id = ?';
    
    connection.query(query, [id], (err, result) => {
        if (err) {
            res.status(500).send(err);
            return;
        }
        res.json({ message: 'Project deleted successfully' });
    });
};

module.exports = {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject
};