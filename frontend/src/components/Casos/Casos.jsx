import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlusCircle, Edit2, Trash2, X } from 'lucide-react';
import { ResponsiveContainer } from 'recharts';
import { api } from '../../utils/api';

const Casos = () => {
  const [testCases, setTestCases] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [currentTest, setCurrentTest] = useState({
    name: '',
    status: 'pending',
    project_id: '', 
    user_id: '',
    id: null 
  });

  // Cargar casos de prueba
  useEffect(() => {
    fetchTestCases();
  }, []);

  const fetchTestCases = async () => {
    try {
      const tests = await api.getTests();
      setTestCases(tests);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching tests:', error);
      setIsLoading(false);
    }
  };

  // Función auxiliar para formatear fechas para mostrar
  const formatDateForDisplay = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }; 

  // Crear o actualizar caso de prueba
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const projectId = currentTest.project_id ? Number(currentTest.project_id) : 0;
      const userId = currentTest.user_id ? Number(currentTest.user_id) : 0;

      if (isEditing) {
        await api.updateTest(currentTest.id, {
          name: currentTest.name,
          status: currentTest.status,
          project_id: projectId,
          user_id: userId
        });
      } else {
        await api.createTest({
          name: currentTest.name,
          status: currentTest.status,
          project_id: projectId,
          user_id: userId
        });
      }
      
      // Recargar la lista
      await fetchTestCases();
      
      // Limpiar formulario y ocultar
      resetForm();
    } catch (error) {
      console.error('Error saving test:', error);
    }
  };

  // Resetear formulario
  const resetForm = () => {
    setCurrentTest({
      name: '',
      status: 'pending',
      project_id: '',
      user_id: '',
      id: null
    });
    setIsEditing(false);
    setIsFormVisible(false);
  };

  // Editar caso de prueba
  const handleEdit = (testCase) => {
    setCurrentTest({
      id: testCase.id,
      name: testCase.name,
      status: testCase.status,
      user_id: testCase.user_id,
      project_id: testCase.project_id
    });
    setIsEditing(true);
    setIsFormVisible(true);
  };

  // Eliminar caso de prueba
  const handleDelete = async (id) => {
    if (window.confirm('¿Está seguro de eliminar este caso de prueba?')) {
      try {
        await api.deleteTest(id);
        await fetchTestCases();
      } catch (error) {
        console.error('Error deleting test:', error);
      }
    }
  };

  // Manejar cambios en el formulario
  const handleChange = (field, value) => {
    setCurrentTest(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Mostrar formulario para nuevo caso
  const showNewTestForm = () => {
    resetForm();
    setIsFormVisible(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      'completed': 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'pending': 'bg-yellow-100 text-yellow-800',
      'failed': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  return (
    <ResponsiveContainer width="150%" height="115%">
      <div className="p-6 space-y-6">        
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Gestión de Casos de Prueba</h2>
          <Button 
            className="flex items-center gap-2"
            onClick={showNewTestForm}
          >
            <PlusCircle className="h-4 w-4" />
            Nuevo Caso
          </Button>
        </div>

        {/* Formulario de caso de prueba */}
        {isFormVisible && (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>{isEditing ? 'Editar Caso de Prueba' : 'Nuevo Caso de Prueba'}</CardTitle>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsFormVisible(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nombre del Caso</label>
                    <Input 
                      placeholder="Ingrese el nombre del caso"
                      value={currentTest.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estado</label>
                    <Select 
                      value={currentTest.status}
                      onValueChange={(value) => handleChange('status', value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione estado" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pendiente</SelectItem>
                        <SelectItem value="in-progress">En Progreso</SelectItem>
                        <SelectItem value="completed">Completado</SelectItem>
                        <SelectItem value="failed">Fallido</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">ID de Proyecto</label>
                    <Input 
                      placeholder="ID del proyecto"
                      value={currentTest.project_id}
                      onChange={(e) => handleChange('project_id', e.target.value)}
                      type="number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Asignar a (ID)</label>
                    <Input 
                      placeholder="ID del usuario"
                      value={currentTest.user_id}
                      onChange={(e) => handleChange('user_id', e.target.value)}
                      type="number"
                      required
                    />
                  </div>
                </div>

                <Button type="submit" className="w-full mt-4">
                  {isEditing ? 'Actualizar' : 'Guardar'} Caso de Prueba
                </Button>
              </form>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Creado el</TableHead>
                  <TableHead>Modificado el</TableHead>
                  <TableHead>Proyecto</TableHead>
                  <TableHead>Asignado a</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {testCases.map((testCase) => (
                  <TableRow key={testCase.id}>
                    <TableCell className="font-medium">{testCase.name}</TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(testCase.status)}`}>
                        {testCase.status}
                      </div>
                    </TableCell>
                    <TableCell>{formatDateForDisplay(testCase.created_at)}</TableCell>
                    <TableCell>{formatDateForDisplay(testCase.updated_at)}</TableCell>
                    <TableCell>{testCase.project_id}</TableCell>
                    <TableCell>{testCase.user_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleEdit(testCase)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => handleDelete(testCase.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ResponsiveContainer>
  );
};

export default Casos;