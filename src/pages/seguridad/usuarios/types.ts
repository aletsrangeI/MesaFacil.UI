import type { UsuarioDto } from "../../../services/generated/api";

export interface UsuarioExtendedDto extends UsuarioDto {
  idSucursal?: number | null;
  nombreSucursal?: string | null;
  hasPassword?: boolean;
  hasPin?: boolean;
  hasPinSupervisor?: boolean;
  isPinSupervisorLocked?: boolean;
  pinBloqueadoHasta?: string | null;
  hasOpenTurno?: boolean;
  pinSupervisor?: string | null;
  desbloquearPinSupervisor?: boolean;
}

export type EstadoFilterType = "ALL" | "ACTIVE" | "INACTIVE" | "OPEN_TURNO" | "SUPERVISOR_LOCKED";

export interface UsuarioFiltersState {
  search: string;
  idSucursal: string; // "" = todas
  idRol: string;      // "" = todos
  estado: EstadoFilterType;
}

export interface UsuarioStats {
  total: number;
  activos: number;
  enTurno: number;
  conPinSupervisor: number;
  supervisoresBloqueados: number;
}

export interface UsuarioFormData {
  id?: number;
  idEmpresa: number;
  idSucursal: number | null;
  nombreCompleto: string;
  correo: string;
  isActive: boolean;
  password?: string;
  pin?: string;
  idRol: number | null;
  pinSupervisor?: string;
  desbloquearPinSupervisor?: boolean;
}
