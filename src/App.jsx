// Compartido · marco de la aplicación. Cada pantalla se dibuja dentro de <Outlet />.
import { NavLink, Outlet } from 'react-router';
import { RUTAS } from './shared/constants/rutas.js';

// Menú temporal para que el equipo pueda moverse entre pantallas mientras se construyen.
// Quitarlo antes de la demo.
const MENU_DESARROLLO = [
  ['Inicio', RUTAS.INICIO],
  ['Check-in', RUTAS.CHECKIN],
  ['Solicitud', RUTAS.SOLICITUD],
  ['Confirmación', RUTAS.CONFIRMACION],
  ['Seguimiento', RUTAS.SEGUIMIENTO],
  ['Centro de control', RUTAS.CONTROL],
];

export default function App() {
  return (
    <>
      <nav className="menu-desarrollo" aria-label="Menú de desarrollo">
        <strong>NEXO 360</strong>
        {MENU_DESARROLLO.map(([texto, ruta]) => (
          <NavLink key={ruta} to={ruta} end>
            {texto}
          </NavLink>
        ))}
      </nav>
      <main className="contenido">
        <Outlet />
      </main>
    </>
  );
}
