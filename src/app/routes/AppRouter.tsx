import { Routes, Route, Navigate } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { RoleGuard } from "./RoleGuard";
import RegistroUsuario from "../../pages/auth/RegistroUsuario";

function Placeholder({ title }: { title: string }) {
  return (
    <main style={{ padding: 16 }}>
      <h1>{title}</h1>
      <p>Pendiente…</p>
    </main>
  );
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<RegistroUsuario />} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Placeholder title="Home" />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <PrivateRoute>
            <RoleGuard allowed={["Admin"]}>
              <Placeholder title="Admin" />
            </RoleGuard>
          </PrivateRoute>
        }
      />
      <Route
        path="/mesero"
        element={
          <PrivateRoute>
            <RoleGuard allowed={["Mesero"]}>
              <Placeholder title="Mesero" />
            </RoleGuard>
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
