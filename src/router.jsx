// Compartido · rutas de la aplicación. Cambiar solo con acuerdo del equipo.
import { createBrowserRouter } from 'react-router';
import App from './App.jsx';
import HomePage from './features/ciudadano/pages/HomePage.jsx';
import CheckinPage from './features/ciudadano/pages/CheckinPage.jsx';
import EmergencyPage from './features/ciudadano/pages/EmergencyPage.jsx';
import ConfirmationPage from './features/ciudadano/pages/ConfirmationPage.jsx';
import TrackingPage from './features/ciudadano/pages/TrackingPage.jsx';
import ControlCenterPage from './features/control/pages/ControlCenterPage.jsx';
import { RUTAS } from './shared/constants/rutas.js';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <HomePage /> },
      { path: RUTAS.CHECKIN, element: <CheckinPage /> },
      { path: RUTAS.SOLICITUD, element: <EmergencyPage /> },
      { path: RUTAS.CONFIRMACION, element: <ConfirmationPage /> },
      { path: RUTAS.SEGUIMIENTO, element: <TrackingPage /> },
      { path: RUTAS.CONTROL, element: <ControlCenterPage /> },
      { path: '*', element: <p>Esta página no existe.</p> },
    ],
  },
]);
