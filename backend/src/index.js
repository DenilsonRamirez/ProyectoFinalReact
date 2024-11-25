const express = require('express')
const app = express() 
const port = 3000 
const routes = require('./api/endPoints')
const cors = require('cors');

app.use(express.json());

app.use(express.urlencoded({extended: true}));

app.use(cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true
}));
/* DEBUG
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});
*/
app.options('*', cors());

app.use('/', routes);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Middleware para rutas no encontradas
app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found'
    });
});


app.listen(port, () => { 
    console.log(`Example app listening on port ${port}`)
})