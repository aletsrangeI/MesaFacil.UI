import { useNavigate } from "react-router-dom";
import { useAuthLoginPin } from "./useAuthLoginPin";
import { Button } from "../../components/ui/button/Button";
import Icon from "../../components/ui/icons/Icon";
import Container from "../../components/ui/layout/Container";
import "./auth-form.css";

export default function LoginPin() {
  const navigate = useNavigate();
  const {
    usuarios,
    isLoadingUsers,
    isUsersError,
    selectedUser,
    selectUser,
    pin,
    serverError,
    appendPinDigit,
    removePinDigit,
    clearPin,
    handleLogin,
    isLoading,
    isBlocked,
    secondsLeft,
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
          <p className="auth-subtitle">
            {selectedUser 
              ? "Ingresa tu PIN de seguridad" 
              : "Selecciona tu usuario de la lista"
            }
          </p>
        </header>

        <div className="auth-body">
          {!selectedUser ? (
            /* PASO 1: Selección de Usuario (Avatar/Lista Grid) */
            <div className="pos-user-selection">
              {isLoadingUsers ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "40px", gap: "12px", color: "var(--color-muted)" }}>
                  <div className="spin" style={{ fontSize: "24px" }}>
                    <Icon name="Loader" />
                  </div>
                  <span>Cargando empleados activos...</span>
                </div>
              ) : isUsersError ? (
                <div className="auth-error" role="alert" style={{ margin: "20px 0" }}>
                  <Icon name="AlertTriangle" />
                  <span>No fue posible cargar la lista de usuarios.</span>
                </div>
              ) : usuarios.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "var(--color-muted)" }}>
                  <span>No hay usuarios activos registrados en esta sucursal.</span>
                </div>
              ) : (
                <div className="user-grid">
                  {usuarios.map((u) => {
                    const initials = u.nombreCompleto
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "U";
                    return (
                      <button
                        key={u.id}
                        type="button"
                        className="user-grid__item"
                        onClick={() => selectUser(u)}
                      >
                        <div className="user-grid__avatar">{initials}</div>
                        <span className="user-grid__name">{u.nombreCompleto}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* PASO 2: Ingreso de PIN con Teclado Numérico */
            <div className="pos-pin-entry">
              {/* Usuario Seleccionado Cabecera */}
              <div className="auth-user-selected">
                <div className="auth-user-selected__info">
                  <div className="auth-user-selected__avatar">
                    {selectedUser.nombreCompleto
                      ?.split(" ")
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase() || "U"}
                  </div>
                  <span className="auth-user-selected__name">
                    {selectedUser.nombreCompleto}
                  </span>
                </div>
                <button
                  type="button"
                  className="auth-link"
                  onClick={() => selectUser(null)}
                  style={{ background: "none", border: "none", cursor: "pointer", fontSize: "12px" }}
                  disabled={isLoading}
                >
                  Cambiar usuario
                </button>
              </div>

              {/* Indicadores visuales del PIN */}
              <div className="pin-feedback">
                <span className="pin-feedback__label">
                  {isBlocked ? "Teclado Temporalmente Bloqueado" : "Código PIN"}
                </span>
                <div className="pin-feedback__indicators">
                  {Array.from({ length: MAX_DOTS }).map((_, i) => (
                    <div
                      key={i}
                      className={`pin-feedback__dot ${i < pin.length ? "is-filled" : ""}`}
                    />
                  ))}
                </div>
                {isBlocked && (
                  <span style={{ color: "var(--color-primary)", fontWeight: 700, fontSize: "12px", marginTop: "4px" }}>
                    Inténtalo de nuevo en {secondsLeft} segundos
                  </span>
                )}
              </div>

              {/* Keypad Numérico */}
              <div className="pin-keypad" style={{ marginTop: "16px" }}>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className="pin-keypad__btn"
                    onClick={() => appendPinDigit(String(num))}
                    disabled={isLoading || isBlocked}
                  >
                    {num}
                  </button>
                ))}
                <button
                  type="button"
                  className="pin-keypad__btn pin-keypad__btn--danger"
                  onClick={clearPin}
                  disabled={isLoading || isBlocked || pin.length === 0}
                >
                  C
                </button>
                <button
                  type="button"
                  className="pin-keypad__btn"
                  onClick={() => appendPinDigit("0")}
                  disabled={isLoading || isBlocked}
                >
                  0
                </button>
                <button
                  type="button"
                  className="pin-keypad__btn pin-keypad__btn--back"
                  onClick={removePinDigit}
                  disabled={isLoading || isBlocked || pin.length === 0}
                  aria-label="Borrar dígito"
                >
                  <Icon name="Delete" />
                </button>
              </div>

              {serverError && (
                <div className="auth-error" role="alert" style={{ marginTop: "16px" }}>
                  <Icon name="AlertTriangle" />
                  <span>{serverError}</span>
                </div>
              )}

              <div className="auth-actions" style={{ marginTop: "20px" }}>
                <Button
                  type="button"
                  variant="primary"
                  isLoading={isLoading}
                  onClick={handleLogin}
                  disabled={isLoading || isBlocked || !pin}
                  rightIcon={!isLoading ? <Icon name="LogIn" /> : undefined}
                >
                  {isLoading ? "Verificando PIN..." : "Entrar"}
                </Button>
              </div>
            </div>
          )}

          <div className="auth-row" style={{ justifyContent: "center", marginTop: "12px" }}>
            <a
              className="auth-link"
              href="#"
              onClick={(e) => {
                e.preventDefault();
                navigate("/login");
              }}
              style={{ fontSize: "13px" }}
            >
              Volver al inicio de sesión tradicional
            </a>
          </div>
        </div>
      </div>
    </Container>
  );
}
