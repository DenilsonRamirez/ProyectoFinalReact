import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

    fetch(`${import.meta.env.VITE_API_URL}/login`, {
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
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Inicio de Sesión</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-3">
            <Input
              label="Username"
              placeholder="Usuario"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              label="Password"
              placeholder="Contraseña"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <Button onClick={handleLogin} className="w-full">
              Iniciar Sesión
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default Login;