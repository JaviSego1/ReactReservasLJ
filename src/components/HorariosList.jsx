import { useEffect, useState } from "react";
import { Button, Container, Table, Form, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const HorariosList = () => {
    const [horarios, setHorarios] = useState([]);
    const [horariosFiltrados, setHorariosFiltrados] = useState([]);
    const [instalaciones, setInstalaciones] = useState([]);
    const [instalacionSeleccionada, setInstalacionSeleccionada] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState(null);
    const itemsPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const response = await api.get('/horario');
                const corregidoOid = response.data.map(item => ({
                    ...item,
                    _id: item._id.$oid,
                    hora_inicio: item.hora_inicio.$date ? new Date(item.hora_inicio.$date).toLocaleTimeString() : item.hora_inicio,
                    hora_fin: item.hora_fin.$date ? new Date(item.hora_fin.$date).toLocaleTimeString() : item.hora_fin,
                    instalacion: {
                        ...item.instalacion,
                        _id: item.instalacion._id?.$oid || item.instalacion._id
                    }
                }));

                setHorarios(corregidoOid);
                setHorariosFiltrados(corregidoOid);
            } catch (err) {
                console.error("Error al obtener horarios:", err);
                navigate('/login');
            }
        };
        fetchHorarios();
    }, [navigate]);

    useEffect(() => {
        const fetchInstalaciones = async () => {
            try {
                const response = await api.get('/instalacion');
                setInstalaciones(response.data);
            } catch (err) {
                console.error("Error al obtener instalaciones:", err);
            }
        };
        fetchInstalaciones();
    }, []);

    useEffect(() => {
        if (instalacionSeleccionada === "") {
            setHorariosFiltrados(horarios);
        } else {
            const filtrados = horarios.filter(h => h.instalacion._id === instalacionSeleccionada);
            setHorariosFiltrados(filtrados);
        }
        setCurrentPage(1);
    }, [instalacionSeleccionada, horarios]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = horariosFiltrados.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => {
        if (currentPage < Math.ceil(horariosFiltrados.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleShowDelete = (horario) => {
        setSelectedHorario(horario);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        try {
            await api.delete(`/horario/${selectedHorario._id}`);
            const updatedHorarios = horarios.filter(h => h._id !== selectedHorario._id);
            setHorarios(updatedHorarios);
            setHorariosFiltrados(updatedHorarios);
            setShowDeleteModal(false);
        } catch (err) {
            console.error("Error eliminando horario:", err);
        }
    };

    return (
        <Container>
            <h1 className="my-4">Listado de Horarios</h1>

            <Form.Group className="mb-3">
                <Form.Label>Filtrar por Instalación:</Form.Label>
                <Form.Select 
                    value={instalacionSeleccionada}
                    onChange={(e) => setInstalacionSeleccionada(e.target.value)}
                >
                    <option value="">Todas las Instalaciones</option>
                    {instalaciones.map(inst => (
                        <option key={inst._id.$oid || inst._id} value={inst._id.$oid || inst._id}>
                            {inst.nombre}
                        </option>
                    ))}
                </Form.Select>
            </Form.Group>

            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hora Inicio</th>
                        <th>Hora Fin</th>
                        <th>Instalación</th>
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {currentItems.map((horario) => (
                        <tr key={horario._id}>
                            <td>{horario._id}</td>
                            <td>{horario.hora_inicio.slice(0, 8)}</td>
                            <td>{horario.hora_fin.slice(0, 8)}</td>
                            <td>{horario.instalacion?.nombre || "Sin instalación"}</td>
                            <td>
                                <Button as={Link} to={`/horario/edit/${horario._id}`} variant="success">
                                    Editar
                                </Button>
                            </td>
                            <td>
                                <Button 
                                    variant="danger" 
                                    onClick={() => handleShowDelete(horario)}
                                >
                                    Eliminar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            <div className="d-flex justify-content-center mt-3">
                <Button onClick={prevPage} disabled={currentPage === 1}>Anterior</Button>
                <span className="mx-3">Página {currentPage} de {Math.ceil(horariosFiltrados.length / itemsPerPage)}</span>
                <Button onClick={nextPage} disabled={currentPage === Math.ceil(horariosFiltrados.length / itemsPerPage)}>Siguiente</Button>
            </div>

            <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirmar Eliminación</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedHorario && (
                        <>
                            <p>¿Estás seguro de eliminar este horario?</p>
                            <p><strong>Hora inicio:</strong> {selectedHorario.hora_inicio.slice(0, 8)}</p>
                            <p><strong>Hora fin:</strong> {selectedHorario.hora_fin.slice(0, 8)}</p>
                            <p><strong>Instalación:</strong> {selectedHorario.instalacion?.nombre}</p>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="danger" onClick={handleConfirmDelete}>
                        Eliminar
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default HorariosList;