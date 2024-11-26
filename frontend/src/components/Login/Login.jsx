import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import '../../index.css';

const Login = () => {
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();
        const data = {
            username: username,
            password: password
        };

        fetch(`${import.meta.env.VITE_API_URL}/login`, { // Usamos VITE_API_URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if(result.token){
                localStorage.setItem('token', result.token);
                navigate('/home');
            }
        })
        .catch(error => {
            console.log(error)
        });
    }

    return(
        <div>
            <form>
                <label>Usuario:</label>
                <input onChange={(event)=>{setUsername(event.target.value)}} type='text'></input>
                <label>Contraseña:</label>
                <input onChange={(event)=>{setPassword(event.target.value)}} type='password'></input>
                <button onClick={handleLogin}>Iniciar Sesión</button>
            </form>
        </div>
    );
}

export default Login;