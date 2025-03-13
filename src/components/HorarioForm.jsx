import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api"

const HorarioForm = () => {
    let { _id } = useParams();

    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [instalacion, setInstalacion] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const ruta = useLocation();

    const estado = () => {
        if (ruta.pathname.includes('add')) return 'add';
        if (ruta.pathname.includes('del')) return 'del';
        if (ruta.pathname.includes('edit')) return 'edit';
    }

    const manejaForm = async(event) => {
        event.preventDefault();
        try {
            const response = await api.post('/horario', { _id, horaInicio, horaFin, instalacion });
            console.log(response);
            navigate('/horarios')
        } catch (error) {
            setError('No se puede completar la petición');
            console.log(err);
        }
    }

    const deleteForm = async(event) => {
        event.preventDefault();
        try {
            const response = await api.delete('/horario/'+ _id, { _id, horaInicio, horaFin, instalacion });
            console.log(response);
            navigate('/horarios')
        } catch (err) {
            setError('No se puede completar la petición');
            console.log(err);
        }
    }

    const manejaAtras = async(event) => {
        event.preventDefault();
        navigate(-1);
    }

    useEffect(() => {
        const peticion = async () => {
            console.log("---===================-----")
            console.log(_id)
                try {
                    const response = await api.get('/horario/'+_id);
                    console.log(response);
                    setHoraInicio(response.data.hora_inicio);
                    setHoraFin(response.data.hora_fin);
                    setInstalacion(response.data.instalacion);                    
                } catch (err) {
                    setError('No se puede completar la operación');
                    console.log(err);
                }
        };
        peticion();
    }, [])

    return(
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>ID:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="ID de Horario"
                    aria-label="Identificador del horario"                    
                    disabled
                    value={_id}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Hora de inicio:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Hora de inicio del Horario"
                    aria-label="Hora de inicio del horario"                    
                    disabled={estado()=='del'?true:false}
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Hora de fin:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Hora de fin del Horario"
                    aria-label="Hora de fin del horario"                    
                    disabled={estado()=='del'?true:false}
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Instalacion:</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="Instalacion del Horario"
                    aria-label="Instalacion del horario"                    
                    disabled={estado()=='del'?true:false}
                    value={instalacion}
                    onChange={(e) => setInstalacion(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                {
                    {
                        'add': <Button className="btn-success" onClick={manejaForm}>Alta</Button>,
                        'edit': <Button className="btn-success" onClick={manejaForm}>Actualizar</Button>,
                        'del': <Button as={Link} className="btn-danger" onClick={deleteForm} >Borrar</Button>
                    } [estado()]
                }
                <Button as={Link} onClick={manejaAtras} >
                    Cancelar
                </Button>
            </Form.Group>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </Form>
    )
}

export default HorarioForm