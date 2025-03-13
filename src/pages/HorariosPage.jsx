import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import HorariosList from "../components/HorariosList";

const HorariosPage = () => {
    return(
        <>
            <h3>Listado de horarios</h3>
            <HorariosList/>
            <Button as={Link} to="/horario/add">Añadir un nuevo horario</Button>
        </>
    )
}

export default HorariosPage;