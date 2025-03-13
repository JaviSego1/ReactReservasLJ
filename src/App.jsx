// App.jsx o donde definas el enrutador
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import RootLayout from "./components/RootLayout";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import InstalacionesPage from "./pages/InstalacionesPage";
import InstalacionDeletePage from "./pages/InstalacionDeletePage";
import InstalacionFormPage from "./pages/InstalacionFormPage";
import ReservasPage from "./pages/ReservasPage";
import HorariosPage from "./pages/HorariosPage";
import HorarioFormPage from "./pages/HorarioFormPage";
import HorarioDeletePage from "./pages/HorarioDeletePage";

import 'bootstrap/dist/css/bootstrap.min.css';


const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true, // Esto indica que es la ruta por defecto para "/"
        element: <HomePage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "instalaciones",
        element: <InstalacionesPage />,
      },
      {
        path: "instalacion/add",
        element: <InstalacionFormPage />,
      },
      {
        path: "instalacion/edit/:_id",
        element: <InstalacionFormPage />,
      },
      {
        path: "instalacion/del/:_id",
        element: <InstalacionDeletePage />,
      },
      {
        path: "mis-reservas",
        element: <ReservasPage />,
      },
      {
        path: "horarios",
        element: <HorariosPage/>,
      },
      {
        path: "horario/add",
        element: <HorarioFormPage/>,
      },
      {
        path: "horario/edit/:_id",
        element: <HorarioFormPage/>,
      },
      {
        path: "horario/del/:_id",
        element: <HorarioDeletePage/>,
      }
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
