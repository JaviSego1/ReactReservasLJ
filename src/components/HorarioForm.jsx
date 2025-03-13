import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const HorarioForm = () => {
    let { _id } = useParams();

    const [hora_inicio, setHoraInicio] = useState('');
    const [hora_fin, setHoraFin] = useState('');
    const [instalacion, setInstalacion] = useState('');
    const [instalaciones, setInstalaciones] = useState([]);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const ruta = useLocation();

    const estado = () => {
        if (ruta.pathname.includes("add")) return "add";
        if (ruta.pathname.includes("del")) return "del";
        if (ruta.pathname.includes("edit")) return "edit";
    };

    useEffect(() => {
        const fetchInstalaciones = async () => {
            try {
                const response = await api.get("/instalacion");
                setInstalaciones(response.data);
            } catch (err) {
                setError("Error al cargar las instalaciones");
                console.error(err);
            }
        };
        fetchInstalaciones();
    }, []);

    useEffect(() => {
        if (estado() !== "add") {
            const fetchHorario = async () => {
                try {
                    const response = await api.get(`/horario/${_id}`);
                    const data = response.data;
                    setHoraInicio(new Date(data.hora_inicio.$date).toISOString().substring(11, 16));
                    setHoraFin(new Date(data.hora_fin.$date).toISOString().substring(11, 16));
                    setInstalacion(data.instalacion._id?.$oid || data.instalacion._id);
                } catch (err) {
                    setError("Error al cargar el horario");
                }
            };
            fetchHorario();
        }
    }, [_id]);

    const manejaForm = async (event) => {
        event.preventDefault();
        try {
            const payload = {
                hora_inicio: new Date(`1970-01-01T${hora_inicio}:00.000Z`).toISOString(),
                hora_fin: new Date(`1970-01-01T${hora_fin}Z`).toISOString(),
                instalacion,
            };

            if (estado() === "add") {
                await api.post("/horario", payload);
            } else {
                await api.put(`/horario/${_id}`, payload);
            }
            navigate("/horario");
        } catch (err) {
            setError("No se pudo completar la solicitud");
        }
    };

    const deleteForm = async (event) => {
        event.preventDefault();
        try {
            await api.delete(`/horario/${_id}`);
            navigate("/horario");
        } catch (err) {
            setError("No se pudo completar la eliminación");
        }
    };

    const manejaAtras = () => {
        navigate(-1);
    };

    return (
        <Form onSubmit={estado() === "del" ? deleteForm : manejaForm}>
            {error && <p className="text-danger">{error}</p>}
            <Form.Group className="mb-3">
                <Form.Label>ID:</Form.Label>
                <Form.Control type="text" value={_id || "Nuevo"} disabled />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Hora Inicio:</Form.Label>
                <Form.Control
                    type="time"
                    value={hora_inicio}
                    onChange={(e) => setHoraInicio(e.target.value)}
                    disabled={estado() === "del"}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Hora Fin:</Form.Label>
                <Form.Control
                    type="time"
                    value={hora_fin}
                    onChange={(e) => setHoraFin(e.target.value)}
                    disabled={estado() === "del"}
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label>Instalación:</Form.Label>
                <Form.Control
                    as="select"
                    value={instalacion}
                    onChange={(e) => setInstalacion(e.target.value)}
                    disabled={estado() === "del"}
                >
                    <option value="">Selecciona una instalación</option>
                    {instalaciones.map((inst) => (
                        <option key={inst._id?.$oid || inst._id} value={inst._id?.$oid || inst._id}>
                            {inst.nombre}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <Form.Group className="mb-3">
                {estado() !== "del" ? (
                    <Button type="submit" className="btn-success">
                        {estado() === "add" ? "Crear" : "Actualizar"}
                    </Button>
                ) : (
                    <Button onClick={deleteForm} className="btn-danger">
                        Eliminar
                    </Button>
                )}

                <Button variant="secondary" onClick={manejaAtras} className="ms-2">
                    Cancelar
                </Button>
            </Form.Group>
        </Form>
    );
};

export default HorarioForm;
