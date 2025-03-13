import { useEffect, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api";
import { Button, Container, Table } from "react-bootstrap";

const HorariosList = () => {
    const [horarios, setHorarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const peticion = async () => {
            try {
                const reponse = await api.get('/horario');
                const corregidoOid = reponse.data.map(item => {
                    return {
                        ...item,
                        _id: item._id.$oid
                    };
                });
                setHorarios(corregidoOid)
            } catch (err) {
                navigate('/login')
                console.log(err);
            }
        }
        peticion();
    }, []);

    return(
        <Container>
            <Table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hora inicio</th>
                        <th>Hora fin</th>
                        <th>Editar</th>
                        <th>Borrar</th>
                    </tr>
                </thead>
                <tbody>
                    {horarios.map((horario) => (
                        <tr key={horario._id}>
                            <td>{horario._id}</td>
                            <td>{horario.hora_inicio}</td>
                            <td>{horario.hora_fin}</td>
                            <td>
                                <Button as={Link} to={`/horario/edit/${horario._id}`} className="btn-success">
                                    Editar
                                </Button>
                            </td>
                            <td>
                                <Button as={Link} to={`/horario/del/${horario._id}`} className="btn-danger  ">
                                    Borrar
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    )
}

export default HorariosList