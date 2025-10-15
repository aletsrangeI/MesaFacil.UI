import { FormGenerator } from "../../forms/FormGenerator";
import { mesaFacilFields } from "../../components/ui/adapters";
import Container from "../../components/ui/layout/Container";
import { Button } from "../../components/ui/button";
import Icon from "../../components/ui/icons/Icon";
import { useAuthLoginForm } from "./useAuthLoginForm";
import "./auth-form.css";

export default function RegistroUsuario() {
  const {
    formId,
    fields,
    isLoading,
    error,
    serverError,
    handleSubmit,
  } = useAuthLoginForm();

  return (
    <Container as="main" maxWidth="sm" className="auth-wrapper">
      <div className="auth-card" role="form" aria-labelledby="auth-title">
        <header className="auth-header">
          <div className="auth-logo" aria-hidden />
          <h2 id="auth-title" className="auth-title">
            Iniciar sesión
          </h2>
          <p className="auth-subtitle">Accede con tu usuario o correo</p>
        </header>

        <div className="auth-body">
          <FormGenerator
            formId={formId}
            showDefaultSubmit={false}
            fields={fields}
            components={mesaFacilFields}
            onSubmit={handleSubmit}
          />

          {(serverError || error) && (
            <div className="auth-error" role="alert">
              <Icon name="AlertTriangle" />
              <span>{serverError ?? "Error de autenticación."}</span>
            </div>
          )}

          <div className="auth-row">
            <a className="auth-link" href="#" onClick={(e) => e.preventDefault()}>
              ¿Olvidaste tu contraseña?
            </a>
            <a className="auth-link" href="#" onClick={(e) => e.preventDefault()}>
              Crear cuenta
            </a>
          </div>

          <div className="auth-actions">
            <Button
              type="submit"
              form={formId}
              variant="primary"
              isLoading={isLoading}
              rightIcon={!isLoading ? <Icon name="LogIn" /> : undefined}
              disabled={isLoading}
            >
              {isLoading ? "Ingresando..." : "Entrar"}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}