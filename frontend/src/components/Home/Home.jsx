import React, { useEffect, useState } from 'react';
import { api } from '../../utils/api'; 
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, CheckCircle2, Clock, XCircle } from "lucide-react";

const Home = () => {
  const [metrics, setMetrics] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const proyectos = await api.getProjects(); // Tu función para obtener proyectos
        const monthlyData = processProyectos(proyectos);
        setMetrics(monthlyData);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processProyectos = (proyectos) => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyStats = {};

    proyectos.forEach(proyecto => {
      const fecha = new Date(proyecto.created_at);
      const monthKey = monthNames[fecha.getMonth()];
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          mes: monthKey,
          completados: 0,
          fallidos: 0,
          pendientes: 0
        };
      }

      if (proyecto.status  === 'completado') {
        monthlyStats[monthKey].completados++;
      } else if (proyecto.status  === 'fallido') {
        monthlyStats[monthKey].fallidos++;
      } else {
        monthlyStats[monthKey].pendientes++;
      }
    });

    // Convertir a array y ordenar por mes
    return Object.values(monthlyStats).sort((a, b) => 
      monthNames.indexOf(a.mes) - monthNames.indexOf(b.mes)
    );
  };

  const calculateTotalTests = () => {
    if (!metrics.length) return 0;
    const lastMonth = metrics[metrics.length - 1];
    return lastMonth.completados + lastMonth.fallidos + lastMonth.pendientes;
  };

  const calculateSuccessRate = () => {
    if (!metrics.length) return '0.0';
    const lastMonth = metrics[metrics.length - 1];
    const total = lastMonth.completados + lastMonth.fallidos;
    if (total === 0) return '0.0';
    return ((lastMonth.completados / total) * 100).toFixed(1);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="space-y-4 p-4">
      <h2 className="text-2xl font-bold mb-4">Dashboard de Calidad</h2>
      
      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pruebas</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateTotalTests()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{calculateSuccessRate()}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Progreso</CardTitle>
            <Clock className="h-4 w-4 text-blue-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.length ? metrics[metrics.length - 1].pendientes : 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fallidas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500"/>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {metrics.length ? metrics[metrics.length - 1].fallidos : 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfica de tendencias */}
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Tendencias de Pruebas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="101%" height="105%">
              <LineChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="mes" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="completados" stroke="#10b981" name="Completadas" />
                <Line type="monotone" dataKey="fallidos" stroke="#ef4444" name="Fallidas" />
                <Line type="monotone" dataKey="pendientes" stroke="#3b82f6" name="Pendientes" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;