import { Routes, Route, Navigate } from 'react-router-dom';
import Login from "../Login/Login.jsx";
import Home from "../Home/Home.jsx";
import Casos from "../Casos/Casos.jsx";
import Proyectos from "../Proyectos/Proyectos.jsx";
import Reportes from "../Reportes/Reportes.jsx";


function parseJwt(token) {
    if (!token) return null;
    
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

// Verificar si existe el token y si es válido
const checkTokenValidity = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const decoded = parseJwt(token);
        return decoded ? decoded.exp * 1000 > Date.now() : false;
    }
    return false;
};

const Main = () => {
    const tokenExistAndStillValid = checkTokenValidity();

    return (
        <Routes>
            <Route 
                path="/" 
                element={tokenExistAndStillValid ? <Navigate to="/home" /> : <Login />} 
            />
            <Route 
                path="/home" 
                element={tokenExistAndStillValid ? <Home /> : <Navigate to="/" />} 
            />
            <Route 
                path="/Casos" 
                element={tokenExistAndStillValid ? <Casos /> : <Navigate to="/" />} 
            />
            <Route 
                path="/Proyectos" 
                element={tokenExistAndStillValid ? <Proyectos /> : <Navigate to="/" />} 
            />
            <Route 
                path="/Reportes" 
                element={tokenExistAndStillValid ? <Reportes /> : <Navigate to="/" />} 
            />                        
        </Routes>
    );
}

export default Main;