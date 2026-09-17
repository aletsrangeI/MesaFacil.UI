import React, { useState, useEffect } from "react";
import { Modal } from "../../../../components/modal/Modal";
import { Input } from "../../../../components/ui/input/Input";
import { Button } from "../../../../components/ui/button/Button";
import Icon from "../../../../components/ui/icons/Icon";
import type { UsuarioExtendedDto, UsuarioFormData } from "../types";

interface UsuarioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingUser: UsuarioExtendedDto | null;
  onSubmit: (data: UsuarioFormData) => Promise<boolean>;
  isSubmitting: boolean;
  formError: string | null;
  sucursales: Array<{ id: number; nombre: string }>;
  roles: Array<{ id: number; nombre: string }>;
}

type TabType = "general" | "security" | "activity";

export const UsuarioFormModal: React.FC<UsuarioFormModalProps> = ({
  isOpen,
  onClose,
  editingUser,
  onSubmit,
  isSubmitting,
  formError,
  sucursales,
  roles,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>("general");

  // Form states
  const [nombreCompleto, setNombreCompleto] = useState("");
  const [correo, setCorreo] = useState("");
  const [idRol, setIdRol] = useState<number | null>(null);
  const [idSucursal, setIdSucursal] = useState<number | null>(null);
  const [isActive, setIsActive] = useState(true);
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [pinSupervisor, setPinSupervisor] = useState("");
  const [desbloquearPinSupervisor, setDesbloquearPinSupervisor] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);

  // Sync with editingUser when opened
  useEffect(() => {
    if (isOpen) {
      setActiveTab("general");
      setClientError(null);
      if (editingUser) {
        setNombreCompleto(editingUser.nombreCompleto ?? "");
        setCorreo(editingUser.correo ?? "");
        setIdRol(editingUser.idRol ?? null);
        setIdSucursal(editingUser.idSucursal ?? null);
        setIsActive(editingUser.isActive ?? true);
        setPassword("");
        setPin("");
        setPinSupervisor("");
        setDesbloquearPinSupervisor(false);
      } else {
        setNombreCompleto("");
        setCorreo("");
        setIdRol(roles.length > 0 ? roles[0].id : null);
        setIdSucursal(null);
        setIsActive(true);
        setPassword("");
        setPin("");
        setPinSupervisor("");
        setDesbloquearPinSupervisor(false);
      }
    }
  }, [isOpen, editingUser, roles]);

  const selectedRolObj = roles.find((r) => r.id === idRol);
  const isSupervisorRole =
    selectedRolObj?.nombre.toLowerCase().includes("admin") ||
    selectedRolObj?.nombre.toLowerCase().includes("manager") ||
    selectedRolObj?.nombre.toLowerCase().includes("gerente") ||
    Boolean(editingUser?.hasPinSupervisor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setClientError(null);

    const trimmedName = nombreCompleto.trim();
    const trimmedEmail = correo.trim();
    const trimmedPinSupervisor = pinSupervisor.trim();

    if (!trimmedName) {
      setClientError("El nombre completo es obligatorio.");
      setActiveTab("general");
      return;
    }

    if (trimmedEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setClientError("El formato del correo electrónico no es válido.");
      setActiveTab("general");
      return;
    }

    if (trimmedPinSupervisor && !/^\d{4}$/.test(trimmedPinSupervisor)) {
      setClientError("El PIN de supervisor debe ser exactamente de 4 dígitos numéricos.");
      setActiveTab("security");
      return;
    }

    if (!editingUser && !password.trim() && !pin.trim()) {
      setClientError("Debes configurar al menos una credencial (Contraseña web o PIN de acceso rápido).");
      setActiveTab("security");
      return;
    }

    const payload: UsuarioFormData = {
      id: editingUser?.id,
      idEmpresa: editingUser?.idEmpresa ?? 1,
      idSucursal,
      nombreCompleto: trimmedName,
      correo: trimmedEmail,
      isActive,
      password: password.trim() || undefined,
      pin: pin.trim() || undefined,
      idRol,
      pinSupervisor: trimmedPinSupervisor || undefined,
      desbloquearPinSupervisor: desbloquearPinSupervisor || undefined,
    };

    const success = await onSubmit(payload);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      size="lg"
      title={editingUser ? `Editar Usuario: ${editingUser.nombreCompleto}` : "Crear Nuevo Usuario"}
      description="Gestiona perfil, asignación de sucursal, rol y credenciales de seguridad."
    >
      <form onSubmit={handleSubmit} className="user-modal-form">
        {/* Navigation Tabs */}
        <nav className="user-modal-tabs" aria-label="Secciones del formulario">
          <button
            type="button"
            className={`user-modal-tab ${activeTab === "general" ? "is-active" : ""}`}
            onClick={() => setActiveTab("general")}
          >
            <Icon name="User" size={16} />
            <span>Perfil & Asignación</span>
          </button>
          <button
            type="button"
            className={`user-modal-tab ${activeTab === "security" ? "is-active" : ""}`}
            onClick={() => setActiveTab("security")}
          >
            <Icon name="KeyRound" size={16} />
            <span>Seguridad & Credenciales</span>
          </button>
          {editingUser && (
            <button
              type="button"
              className={`user-modal-tab ${activeTab === "activity" ? "is-active" : ""}`}
              onClick={() => setActiveTab("activity")}
            >
              <Icon name="Activity" size={16} />
              <span>Estado Operativo</span>
              {editingUser.hasOpenTurno && (
                <span className="user-modal-tab__dot" title="Turno de caja abierto" />
              )}
            </button>
          )}
        </nav>

        {/* Global or Form error */}
        {(clientError || formError) && (
          <div className="user-modal-alert is-danger" role="alert">
            <Icon name="AlertCircle" size={18} />
            <span>{clientError || formError}</span>
          </div>
        )}

        {/* TAB 1: Perfil & Asignación */}
        {activeTab === "general" && (
          <div className="user-modal-section">
            <div className="user-modal-grid-2">
              <Input
                label="Nombre Completo *"
                placeholder="Ej. Juan Carlos Pérez"
                value={nombreCompleto}
                onChange={(e) => setNombreCompleto(e.target.value)}
                leftIcon={<Icon name="User" size={16} />}
                autoFocus
              />
              <Input
                label="Correo Electrónico"
                type="email"
                placeholder="juan.perez@mesafacil.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                leftIcon={<Icon name="Mail" size={16} />}
              />
            </div>

            <div className="user-modal-grid-2">
              {/* Rol Selector */}
              <div className="user-modal-field">
                <label htmlFor="user-modal-rol" className="user-modal-label">
                  Rol Operativo *
                </label>
                <select
                  id="user-modal-rol"
                  className="user-modal-select"
                  value={idRol ? String(idRol) : ""}
                  onChange={(e) => setIdRol(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="" disabled>Seleccione un rol...</option>
                  {roles.map((r) => (
                    <option key={r.id} value={String(r.id)}>
                      {r.nombre}
                    </option>
                  ))}
                </select>
                <span className="user-modal-helper">
                  Define los permisos de sistema (POS, Comandero, KDS o Administración).
                </span>
              </div>

              {/* Sucursal Selector */}
              <div className="user-modal-field">
                <label htmlFor="user-modal-sucursal" className="user-modal-label">
                  Sucursal Asignada
                </label>
                <select
                  id="user-modal-sucursal"
                  className="user-modal-select"
                  value={idSucursal ? String(idSucursal) : ""}
                  onChange={(e) => setIdSucursal(e.target.value ? Number(e.target.value) : null)}
                >
                  <option value="">Todas las sucursales (Corporativo)</option>
                  {sucursales.map((s) => (
                    <option key={s.id} value={String(s.id)}>
                      {s.nombre}
                    </option>
                  ))}
                </select>
                <span className="user-modal-helper">
                  Limita la operación y los pedidos al restaurante correspondiente.
                </span>
              </div>
            </div>

            {/* Toggle IsActive */}
            <div className="user-modal-toggle-row">
              <div className="user-modal-toggle-info">
                <span className="user-modal-toggle-title">Estado de la Cuenta</span>
                <span className="user-modal-toggle-desc">
                  {isActive
                    ? "Usuario habilitado para iniciar sesión y operar en el sistema."
                    : "Usuario suspendido. No podrá acceder a ninguna terminal ni módulo."}
                </span>
              </div>
              <label className="user-modal-switch">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  disabled={Boolean(editingUser?.hasOpenTurno && !isActive)}
                />
                <span className="user-modal-slider" />
              </label>
            </div>

            {editingUser?.hasOpenTurno && !isActive && (
              <div className="user-modal-alert is-warning">
                <Icon name="AlertTriangle" size={18} />
                <span>
                  Atención: El usuario tiene un turno de caja abierto en el POS. Si lo desactivas, no podrá cerrar su turno hasta reactivarlo.
                </span>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Seguridad & Credenciales */}
        {activeTab === "security" && (
          <div className="user-modal-section">
            {/* Card 1: Acceso Web */}
            <div className="user-modal-card">
              <div className="user-modal-card__header">
                <div className="user-modal-card__icon is-primary">
                  <Icon name="Globe" size={16} />
                </div>
                <div>
                  <h3 className="user-modal-card__title">Acceso Web / Backoffice</h3>
                  <p className="user-modal-card__desc">
                    Contraseña para acceder a la administración web, reportes y dashboards.
                  </p>
                </div>
              </div>
              <div className="user-modal-card__body">
                <Input
                  label={editingUser ? "Nueva Contraseña (opcional)" : "Contraseña de Acceso Web"}
                  type="password"
                  placeholder={
                    editingUser
                      ? "Dejar en blanco para conservar la actual"
                      : "Mínimo 6 caracteres"
                  }
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  leftIcon={<Icon name="Lock" size={16} />}
                />
                {editingUser?.hasPassword && (
                  <span className="user-modal-badge-ok">
                    <Icon name="CheckCircle2" size={12} />
                    Contraseña activa configurada
                  </span>
                )}
              </div>
            </div>

            {/* Card 2: PIN POS & Comandero */}
            <div className="user-modal-card">
              <div className="user-modal-card__header">
                <div className="user-modal-card__icon is-info">
                  <Icon name="Tablet" size={16} />
                </div>
                <div>
                  <h3 className="user-modal-card__title">PIN de Acceso Rápido (POS & Comandero)</h3>
                  <p className="user-modal-card__desc">
                    PIN numérico (4 a 6 dígitos) para cambio rápido de mesero en comandero móvil y caja.
                  </p>
                </div>
              </div>
              <div className="user-modal-card__body">
                <Input
                  label={editingUser ? "Nuevo PIN de Terminal (opcional)" : "PIN de Terminal"}
                  type="password"
                  inputMode="numeric"
                  placeholder={
                    editingUser
                      ? "Dejar en blanco para conservar el actual"
                      : "Ej. 1234"
                  }
                  value={pin}
                  onChange={(e) => setPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                  leftIcon={<Icon name="Hash" size={16} />}
                />
                {editingUser?.hasPin && (
                  <span className="user-modal-badge-ok">
                    <Icon name="CheckCircle2" size={12} />
                    PIN de terminal activo configurado
                  </span>
                )}
              </div>
            </div>

            {/* Card 3: Candado de Supervisor (Spec 024) */}
            {isSupervisorRole && (
              <div className="user-modal-card is-highlight">
                <div className="user-modal-card__header">
                  <div className="user-modal-card__icon is-warning">
                    <Icon name="ShieldAlert" size={16} />
                  </div>
                  <div>
                    <h3 className="user-modal-card__title">
                      Candado de Supervisor (Spec 024)
                    </h3>
                    <p className="user-modal-card__desc">
                      PIN de 4 dígitos para autorizar cancelaciones en KDS y descuentos mayores al 10%.
                    </p>
                  </div>
                </div>
                <div className="user-modal-card__body">
                  <Input
                    label={editingUser ? "Nuevo PIN de Supervisor (4 dígitos)" : "PIN de Supervisor (4 dígitos)"}
                    type="password"
                    inputMode="numeric"
                    placeholder="4 dígitos numéricos"
                    maxLength={4}
                    value={pinSupervisor}
                    onChange={(e) => setPinSupervisor(e.target.value.replace(/\D/g, "").slice(0, 4))}
                    leftIcon={<Icon name="Shield" size={16} />}
                  />

                  {editingUser?.hasPinSupervisor && (
                    <span className="user-modal-badge-ok">
                      <Icon name="CheckCircle2" size={12} />
                      Candado de supervisor configurado
                    </span>
                  )}

                  {editingUser?.isPinSupervisorLocked && (
                    <div className="user-modal-alert is-danger" style={{ marginTop: 12 }}>
                      <Icon name="Lock" size={18} />
                      <div style={{ flex: 1 }}>
                        <strong>PIN bloqueado por intentos fallidos.</strong>
                        <p style={{ margin: "2px 0 0 0", fontSize: 13 }}>
                          Se bloquearon autorizaciones automáticas por seguridad.
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setDesbloquearPinSupervisor(true)}
                        disabled={desbloquearPinSupervisor}
                      >
                        {desbloquearPinSupervisor ? "Listo para desbloquear" : "Desbloquear ahora"}
                      </Button>
                    </div>
                  )}

                  {desbloquearPinSupervisor && (
                    <span className="user-modal-badge-ok" style={{ marginTop: 8 }}>
                      <Icon name="CheckCircle2" size={12} />
                      Se desbloqueará el PIN al guardar los cambios.
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: Estado Operativo (Solo en edición) */}
        {activeTab === "activity" && editingUser && (
          <div className="user-modal-section">
            <div className="user-modal-activity-grid">
              {/* Turno de caja */}
              <div className="user-modal-activity-item">
                <div className="user-modal-activity-item__header">
                  <Icon name="Clock" size={18} />
                  <span>Turno en Caja</span>
                </div>
                {editingUser.hasOpenTurno ? (
                  <div className="user-modal-chip is-active">
                    <span className="user-modal-pulse-dot" />
                    Turno Abierto Actualmente
                  </div>
                ) : (
                  <div className="user-modal-chip is-inactive">Sin turno activo</div>
                )}
                <span className="user-modal-activity-note">
                  {editingUser.hasOpenTurno
                    ? "Este usuario tiene un arqueo de caja en curso en el POS. Debe cerrarlo antes de eliminarlo."
                    : "No registra operaciones de caja abiertas en este momento."}
                </span>
              </div>

              {/* Candado de Supervisor */}
              <div className="user-modal-activity-item">
                <div className="user-modal-activity-item__header">
                  <Icon name="Shield" size={18} />
                  <span>Candado de Supervisor</span>
                </div>
                {editingUser.isPinSupervisorLocked ? (
                  <div className="user-modal-chip is-locked">Bloqueado por Intentos</div>
                ) : editingUser.hasPinSupervisor ? (
                  <div className="user-modal-chip is-ok">Activo y Operativo</div>
                ) : (
                  <div className="user-modal-chip is-inactive">No configurado</div>
                )}
                <span className="user-modal-activity-note">
                  {editingUser.isPinSupervisorLocked
                    ? `Bloqueado temporalmente hasta ${editingUser.pinBloqueadoHasta ?? "pronto"}.`
                    : editingUser.hasPinSupervisor
                    ? "Autorizado para desbloquear pedidos y validar descuentos en POS."
                    : "Configure un PIN de 4 dígitos en la pestaña de Seguridad para habilitarlo."}
                </span>
              </div>

              {/* Sucursal vinculada */}
              <div className="user-modal-activity-item">
                <div className="user-modal-activity-item__header">
                  <Icon name="Building2" size={18} />
                  <span>Sucursal Vinculada</span>
                </div>
                <div className="user-modal-chip is-info">
                  {editingUser.nombreSucursal ?? "Todas (Acceso Corporativo)"}
                </div>
                <span className="user-modal-activity-note">
                  Los pedidos y comandas generados por este usuario quedan asociados a esta sede.
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="user-modal-footer">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            leftIcon={<Icon name="Check" size={16} />}
          >
            {editingUser ? "Guardar Cambios" : "Crear Usuario"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
