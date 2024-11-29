import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { X, PlusCircle, Pencil, Trash2 } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../../utils/api';

const ProjectManagement = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [monthlyData, setMonthlyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    
    name: '',
    created_at: '',
    updated_at: '',
    status: ''
  });

  // Cargar proyectos al montar el componente
  useEffect(() => {
    loadProjects();

    const fetchMonthlyProgress = async () => {
      try {
        const response = await api.getMonthlyProgress();
        
        const formattedData = response.map(item => ({
          name: formatMonthName(item.month),
          completedTasks: item.completadas,
          openTasks: item.pendientes + item.fallidas 
        })).reverse(); 

        setMonthlyData(formattedData);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching monthly progress:', error);
        setIsLoading(false);
      }
    };

    fetchMonthlyProgress();
  }, []);

  const formatMonthName = (monthString) => {
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    
    const [year, month] = monthString.split('-');
    const monthIndex = parseInt(month) - 1;
    
    return months[monthIndex];
  };

  // Función auxiliar para formatear fechas para mostrar
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };  

  // Función auxiliar para formatear fechas para enviar al servidor
  const formatDateForServer = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toISOString();
  };

  const loadProjects = async () => {
    try {
      const data = await api.getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleCreateProject = async () => {
    try {
      const formattedData = {
        ...formData,
        created_at: formatDateForServer(formData.created_at),
        updated_at: formatDateForServer(formData.updated_at)
      };
      await api.createProject(formattedData);
      await loadProjects();
      resetForm();
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async () => {
    if (!selectedProject) return;
    try {
      const formattedData = {
        ...formData,
        created_at: formatDateForServer(formData.created_at),
        updated_at: formatDateForServer(formData.updated_at)
      };
      await api.updateProject(selectedProject.id, formattedData);
      await loadProjects();
      resetForm();
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await api.deleteProject(id);
        await loadProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setFormData({
      name: project.name,
      created_at: formatDateForDisplay(project.created_at),
      updated_at: formatDateForDisplay(project.updated_at),
      status: project.status.toLowerCase().replace(' ', '-')
    });
    setIsFormVisible(true);
  };

  const resetForm = () => {
    setSelectedProject(null);
    setFormData({
      name: '',
      created_at: '',
      updated_at: '',
      status: ''
    });
    setIsFormVisible(false);
  };

  const showNewProjectForm = () => {
    resetForm();
    setIsFormVisible(true);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>Cargando...</CardContent>
      </Card>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Gestión de Proyectos</h2>
        <Button 
          className="flex items-center gap-2" 
          onClick={showNewProjectForm}
        >
          <PlusCircle className="h-4 w-4" />
          Nuevo Proyecto
        </Button>
      </div>

      {/* Tabla de Proyectos */}
      <Card>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map((project) => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">{project.name}</TableCell>
                  <TableCell>{formatDateForDisplay(project.created_at)}</TableCell>
                  <TableCell>{formatDateForDisplay(project.updated_at)}</TableCell>
                  <TableCell>
                    <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${project.status === 'Completado' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                      {project.status}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(project)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Panel de Proyectos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {isFormVisible && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>
                {selectedProject ? 'Editar Proyecto' : 'Nuevo Proyecto'}
              </CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsFormVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Nombre del Proyecto</label>
                <Input 
                  placeholder="Nombre del proyecto" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Inicio</label>
                <Input 
                  type="date"
                  value={formData.created_at}
                  onChange={(e) => setFormData({...formData, created_at: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Fecha de Fin</label>
                <Input 
                  type="date"
                  value={formData.updated_at}
                  onChange={(e) => setFormData({...formData, updated_at: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Estado</label>
                <Select 
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en-progreso">En Progreso</SelectItem>
                    <SelectItem value="completado">Completado</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                className="w-full"
                onClick={selectedProject ? handleUpdateProject : handleCreateProject}
              >
                {selectedProject ? 'Actualizar Proyecto' : 'Guardar Proyecto'}
              </Button>
            </CardContent>
          </Card>
        )}

        <Card className={`${isFormVisible ? 'md:col-span-1' : 'md:col-span-2'}`}>
          <CardHeader>
            <CardTitle>Métricas del Proyecto</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="w-full h-64">
              <ResponsiveContainer width="101%" height="105%">
                <AreaChart data={monthlyData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Area 
                    type="monotone" 
                    dataKey="completedTasks" 
                    stroke="#10b981" 
                    fill="#10b981" 
                    name="Tareas Completadas" 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="openTasks" 
                    stroke="#ef4444" 
                    fill="#ef4444" 
                    name="Tareas Pendientes" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProjectManagement;