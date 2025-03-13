import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const HorarioForm = () => {
    let { _id } = useParams();

    const [hora_inicio, setHoraInicio] = useState('');
    const [hora_fin, setHoraFin] = useState('');
    const [instalacion, setInstalacion] = useState('');
    const [instalaciones, setInstalaciones] = useState([]);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const ruta = useLocation();

    const estado = () => {
        if (ruta.pathname.includes('add')) return 'add';
        if (ruta.pathname.includes('del')) return 'del';
        if (ruta.pathname.includes('edit')) return 'edit';
    };

    const manejaForm = async (event) => {
        event.preventDefault();
        try {
            const response = estado() === 'add'
                ? await api.post('/horario', { hora_inicio, hora_fin, instalacion })
                : await api.put(`/horario/${_id}`, { hora_inicio, hora_fin, instalacion });

            console.log(response);
            navigate('/horario');
        } catch (err) {
            setError('No se puede completar la petición');
            console.log(err);
        }
    };

    const deleteForm = async (event) => {
        event.preventDefault();
        try {
            const response = await api.delete(`/horario/${_id}`);
            console.log(response);
            navigate('/horario');
        } catch (err) {
            setError('No se puede completar la petición');
            console.log(err);
        }
    };

    const manejaAtras = (event) => {
        event.preventDefault();
        navigate(-1);
    };

    useEffect(() => {
        const fetchInstalaciones = async () => {
            try {
                const response = await api.get('/instalacion');
                setInstalaciones(response.data);
            } catch (err) {
                setError('Error cargando instalaciones');
                console.log(err);
            }
        };
        fetchInstalaciones();
    }, []);

    useEffect(() => {
        if (estado() === 'edit' || estado() === 'del') {
            const obtenerHorario = async () => {
                try {
                    const response = await api.get(`/horario/${_id}`);
                    const horaInicioBackend = response.data.hora_inicio;
                    const horaFinBackend = response.data.hora_fin;

                    const horaInicioFormateada = typeof horaInicioBackend === 'object' 
                        ? horaInicioBackend.$date 
                        : horaInicioBackend;
                    const horaFinFormateada = typeof horaFinBackend === 'object' 
                        ? horaFinBackend.$date 
                        : horaFinBackend;

                    setHoraInicio(new Date(horaInicioFormateada).toISOString().slice(11, 16)); 
                    setHoraFin(new Date(horaFinFormateada).toISOString().slice(11, 16)); 
                    setInstalacion(response.data.instalacion._id.$oid || response.data.instalacion._id);
                } catch (err) {
                    setError('No se puede completar la operación');
                    console.error(err);
                }
            };
            obtenerHorario();
        }
    }, [_id, estado()]);

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>ID:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="ID del Horario"
                    disabled
                    value={_id}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Hora Inicio:</Form.Label>
                <Form.Control
                    type="time"
                    value={hora_inicio}
                    disabled={estado() === 'del'}
                    onChange={(e) => setHoraInicio(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Hora Fin:</Form.Label>
                <Form.Control
                    type="time"
                    value={hora_fin}
                    disabled={estado() === 'del'}
                    onChange={(e) => setHoraFin(e.target.value)}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Instalación:</Form.Label>
                <Form.Select
                    value={instalacion}
                    disabled={estado() === 'del'}
                    onChange={(e) => setInstalacion(e.target.value)}
                >
                    <option value="">Selecciona una instalación</option>
                    {instalaciones.map(inst => {
                        const instId = inst._id?.$oid || inst._id;
                        return (
                            <option key={instId} value={instId}>
                                {inst.nombre}
                            </option>
                        );
                    })}
                </Form.Select>

            </Form.Group>

            <Form.Group className="mb-3">
                {
                    {
                        'add': <Button className="btn-success" onClick={manejaForm}>Crear</Button>,
                        'edit': <Button className="btn-success" onClick={manejaForm}>Actualizar</Button>,
                        'del': <Button className="btn-danger" onClick={deleteForm}>Eliminar</Button>
                    }[estado()]
                }
                <Button as={Link} onClick={manejaAtras}>Cancelar</Button>
            </Form.Group>

            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form>
    );
};

export default HorarioForm;
