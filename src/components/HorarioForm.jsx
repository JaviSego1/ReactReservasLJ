import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const HorarioForm = () => {
    let { _id } = useParams();

    const [horaInicio, setHoraInicio] = useState('');
    const [horaFin, setHoraFin] = useState('');
    const [instalaciones, setInstalaciones] = useState([]);
    const [instalacionSeleccionada, setInstalacionSeleccionada] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const ruta = useLocation();

    const estado = ruta.pathname.includes("add")
        ? "add"
        : ruta.pathname.includes("del")
        ? "del"
        : "edit";

    useEffect(() => {
        const obtenerInstalaciones = async () => {
            try {
                const response = await api.get("/instalacion");
                const corregidoOid = response.data.map(item => ({
                    ...item,
                    _id: item._id.$oid,
                }));
                setInstalaciones(corregidoOid);
            } catch (err) {
                console.error("Error al obtener instalaciones:", err);
            }
        };
        obtenerInstalaciones();
    }, []);

    useEffect(() => {
        if ((estado === "edit" || estado === "del") && _id) {
            const obtenerHorario = async () => {
                try {
                    const response = await api.get(`/horario/${_id}`);
                    const { hora_inicio, hora_fin, instalacion } = response.data;
    
                    if (!hora_inicio || !hora_fin) {
                        throw new Error("Datos de horario incompletos");
                    }
    
                    const horaInicioFormateada = String(hora_inicio).slice(11, 16);
                    const horaFinFormateada = String(hora_fin).slice(11, 16);
    
                    setHoraInicio(horaInicioFormateada); 
                    setHoraFin(horaFinFormateada); 
                    setInstalacionSeleccionada(instalacion?._id?.$oid || "");
                } catch (err) {
                    setError("No se puede completar la operación");
                    console.error("Error al obtener el horario:", err);
                }
            };
            obtenerHorario();
        }
    }, [_id, ruta.pathname]);
    

    const manejaForm = async (event) => {
        event.preventDefault();
        try {
            const fechaActual = new Date().toISOString().split("T")[0];
            const horaInicioISO = `${fechaActual}T${horaInicio}:00.000Z`;
            const horaFinISO = `${fechaActual}T${horaFin}:00.000Z`;

            const data = {
                horaInicio: horaInicioISO,
                horaFin: horaFinISO,
                instalacion: instalacionSeleccionada,
            };

            console.log("Datos enviados:", data);

            if (estado === "add") {
                await api.post("/horario", data);
            } else if (estado === "edit") {
                await api.put(`/horario/${_id}`, data);
            }
            navigate("/horarios");
        } catch (err) {
            setError("No se puede completar la petición");
            console.error("Error en la petición:", err);
        }
    };

    const deleteForm = async (event) => {
        event.preventDefault();
        try {
            await api.delete(`/horario/${_id}`);
            navigate("/horarios");
        } catch (err) {
            setError("No se puede completar la petición");
            console.error(err);
        }
    };

    const manejaAtras = () => navigate(-1);

    return (
        <Form>
            <Form.Group className="mb-3">
                <Form.Label>ID:</Form.Label>
                <Form.Control type="text" disabled value={_id} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Hora de inicio:</Form.Label>
                <Form.Control
                    type="time"
                    disabled={estado === "del"}
                    value={horaInicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Hora de fin:</Form.Label>
                <Form.Control
                    type="time"
                    disabled={estado === "del"}
                    value={horaFin}
                    onChange={(e) => setHoraFin(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Instalación:</Form.Label>
                <Form.Select
                    value={instalacionSeleccionada}
                    onChange={(e) => setInstalacionSeleccionada(e.target.value)}
                    disabled={estado === "del"}
                >
                    <option value="">Selecciona una instalación</option>
                    {instalaciones.map(instalacion => (
                        <option key={instalacion._id} value={instalacion._id}>
                            {instalacion.nombre}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
                {estado === "add" && <Button variant="success" onClick={manejaForm}>Alta</Button>}
                {estado === "edit" && <Button variant="success" onClick={manejaForm}>Actualizar</Button>}
                {estado === "del" && <Button variant="danger" onClick={deleteForm}>Borrar</Button>}
                <Button variant="secondary" onClick={manejaAtras} className="ms-2">Cancelar</Button>
            </Form.Group>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </Form>
    );
};

export default HorarioForm;
