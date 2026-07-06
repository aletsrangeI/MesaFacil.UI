import { useNavigate } from "react-router-dom";
import { useAuthLoginPin } from "./useAuthLoginPin";
import { Input } from "../../components/ui/input/Input";
import { Button } from "../../components/ui/button/Button";
import Icon from "../../components/ui/icons/Icon";
import Container from "../../components/ui/layout/Container";
import "./auth-form.css";

export default function LoginPin() {
  const navigate = useNavigate();
  const {
    userOrEmail,
    setUserOrEmail,
    pin,
    serverError,
    appendPinDigit,
    removePinDigit,
    clearPin,
    handleLogin,
    isLoading,
  } = useAuthLoginPin();

  const MAX_DOTS = 6;

  return (
    <Container as="main" maxWidth="sm" className="auth-wrapper">
      <div className="auth-card" role="form" aria-labelledby="auth-title">
        <header className="auth-header">
          <div className="auth-logo" aria-hidden />
          <h2 id="auth-title" className="auth-title">
            Acceso Rápido (PIN)
          </h2>
          <p className="auth-subtitle">Ingresa tu usuario y PIN de seguridad</p>
        </header>

        <div className="auth-body">
          <Input
            id="userOrEmail"
            label="Usuario o Correo"
            placeholder="correo@ejemplo.com"
            leftIcon={<Icon name="User" />}
            value={userOrEmail}
            onChange={(e) => setUserOrEmail(e.target.value)}
            disabled={isLoading}
            required
          />

          {/* Indicadores visuales del PIN */}
          <div className="pin-feedback">
            <span className="pin-feedback__label">Código PIN</span>
            <div className="pin-feedback__indicators">
              {Array.from({ length: MAX_DOTS }).map((_, i) => (
                <div
                  key={i}
                  className={`pin-feedback__dot ${i < pin.length ? "is-filled" : ""}`}
                />
              ))}
            </div>
          </div>

          {/* Keypad Numérico */}
          <div className="pin-keypad">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                type="button"
                className="pin-keypad__btn"
                onClick={() => appendPinDigit(String(num))}
                disabled={isLoading}
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              className="pin-keypad__btn pin-keypad__btn--danger"
              onClick={clearPin}
              disabled={isLoading || pin.length === 0}
            >
              C
            </button>
            <button
              type="button"
              className="pin-keypad__btn"
              onClick={() => appendPinDigit("0")}
              disabled={isLoading}
            >
              0
            </button>
            <button
              type="button"
              className="pin-keypad__btn pin-keypad__btn--back"
              onClick={removePinDigit}
              disabled={isLoading || pin.length === 0}
              aria-label="Borrar dígito"
            >
              <Icon name="Delete" />
            </button>
          </div>

          {serverError && (
            <div className="auth-error" role="alert">
              <Icon name="AlertTriangle" />
              <span>{serverError}</span>
            </div>
          )}

          <div className="auth-row" style={{ justifyContent: "center", marginTop: "8px" }}>
            <a
              className="auth-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
            >
              Volver al inicio de sesión tradicional
            </a>
          </div>

          <div className="auth-actions" style={{ marginTop: "12px" }}>
            <Button
              type="button"
              variant="primary"
              isLoading={isLoading}
              onClick={handleLogin}
              disabled={isLoading || !userOrEmail || !pin}
              rightIcon={!isLoading ? <Icon name="LogIn" /> : undefined}
            >
              {isLoading ? "Verificando PIN..." : "Entrar"}
            </Button>
          </div>
        </div>
      </div>
    </Container>
  );
}
