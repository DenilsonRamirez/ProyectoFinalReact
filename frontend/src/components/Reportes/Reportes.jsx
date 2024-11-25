import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { api } from '../../utils/api';

const ReportingModule = () => {
  const [testData, setTestData] = useState([]);
  const [projectData, setProjectData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tests, projects] = await Promise.all([
          api.getTests(),
          api.getProjects()
        ]);

        // Procesar datos de pruebas por mes
        const processedTestData = processTestsByMonth(tests);
        setTestData(processedTestData);

        // Procesar datos de proyectos
        const processedProjectData = processProjectData(projects, tests);
        setProjectData(processedProjectData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const processTestsByMonth = (tests) => {
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyData = {};

    tests.forEach(test => {
      const date = new Date(test.created_at);
      const monthKey = monthNames[date.getMonth()];

      if (!monthlyData[monthKey]) {
        monthlyData[monthKey] = {
          name: monthKey,
          completedTests: 0,
          failedTests: 0
        };
      }

      if (test.status === 'completed') {
        monthlyData[monthKey].completedTests++;
      } else if (test.status === 'failed') {
        monthlyData[monthKey].failedTests++;
      }
    });

    // Convertir a array y ordenar por mes
    return Object.values(monthlyData).sort((a, b) => 
      monthNames.indexOf(a.name) - monthNames.indexOf(b.name)
    );
  };

  const processProjectData = (projects, tests) => {
    return projects.map(project => {
      const projectTests = tests.filter(test => test.project_id === project.id);
      const totalTests = projectTests.length;
      
      if (totalTests === 0) return {
        name: project.name,
        successRate: 0
      };

      const completedTests = projectTests.filter(test => test.status === 'completed').length;
      const successRate = Math.round((completedTests / totalTests) * 100);

      return {
        name: project.name,
        successRate
      };
    });
  };

  const COLORS = ['#10b981', '#ef4444'];

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold">Reportes</h2>

      {/* Reporte de Pruebas */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte de Pruebas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={testData}>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Legend />
                <Bar dataKey="completedTests" fill="#10b981" name="Pruebas Completadas" />
                <Bar dataKey="failedTests" fill="#ef4444" name="Pruebas Fallidas" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Reporte de Proyectos */}
      <Card>
        <CardHeader>
          <CardTitle>Reporte de Proyectos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gráfica de Barras */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={projectData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="successRate" fill="#10b981" name="Tasa de Éxito" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Gráfica de Pastel */}
            <div className="h-80 w-full">
              <ResponsiveContainer width="105%" height="105%">
                <PieChart>
                  <Pie data={projectData} dataKey="successRate" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
                    {projectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportingModule;