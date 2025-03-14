// DeleteHorarioForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const DeleteHorarioForm = () => {
  const [horarioId, setHorarioId] = useState('');
  const [horarioDetails, setHorarioDetails] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('access_token'); // Asumiendo que guardas el token aquí

  const fetchHorario = async () => {
    try {
      const response = await axios.get(`/api/horario/${horarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setHorarioDetails(JSON.parse(response.data));
      setError('');
    } catch (err) {
      setError('Horario no encontrado');
      setHorarioDetails(null);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/horario/${horarioId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      alert('Horario eliminado correctamente');
      navigate('/horarios');
    } catch (err) {
      setError('Error al eliminar el horario');
    }
  };

  return (
    <div className="container">
      <h2>Eliminar Horario</h2>
      <div className="mb-3">
        <label>ID del Horario:</label>
        <input
          type="text"
          className="form-control"
          value={horarioId}
          onChange={(e) => setHorarioId(e.target.value)}
        />
        <button onClick={fetchHorario} className="btn btn-secondary mt-2">
          Buscar Horario
        </button>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {horarioDetails && (
        <div className="card mt-3">
          <div className="card-body">
            <h5 className="card-title">Detalles del Horario</h5>
            <p>Hora inicio: {new Date(horarioDetails.hora_inicio).toLocaleTimeString()}</p>
            <p>Hora fin: {new Date(horarioDetails.hora_fin).toLocaleTimeString()}</p>
            <p>Instalación: {horarioDetails.instalacion.nombre}</p>
            <button 
              onClick={handleDelete}
              className="btn btn-danger"
            >
              Confirmar Eliminación
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteHorarioForm;