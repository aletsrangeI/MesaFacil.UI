import { emptySplitApi } from "./baseApi";

export interface DatosEmpresaOnboarding {
  nombre: string;
  rfc?: string;
  nombreSucursal: string;
  direccion?: string;
  zonaHoraria: string;
  moneda: string;
  tasaIva: number;
}

export interface EstacionCocinaOnboarding {
  nombre: string;
  minutosAmbar: number;
  minutosRojo: number;
}

export interface AreaYMesasOnboarding {
  nombreArea: string;
  orden: number;
  prefijoMesa: string;
  cantidadMesas: number;
  asientosPorMesa: number;
}

export interface ProductoOnboarding {
  nombre: string;
  nombreCategoria: string;
  precio: number;
  estacionCocina?: string;
  descripcion?: string;
}

export interface OpcionModificadorOnboarding {
  nombre: string;
  precioExtra: number;
  esDefault: boolean;
}

export interface GrupoModificadorOnboarding {
  nombreProducto: string;
  nombreGrupo: string;
  obligatorio: boolean;
  minSeleccion: number;
  maxSeleccion: number;
  opciones: OpcionModificadorOnboarding[];
}

export interface MenuOnboarding {
  nombreMenu: string;
  categorias: string[];
  productos: ProductoOnboarding[];
  gruposModificador: GrupoModificadorOnboarding[];
}

export interface PersonalOnboarding {
  nombreCompleto: string;
  rol: "Mesero" | "Manager" | "Repartidor";
  pin: string;
  telefono?: string;
}

export interface ProvisionarRestaurantePayload {
  datosEmpresa: DatosEmpresaOnboarding;
  estacionesCocina: EstacionCocinaOnboarding[];
  areasYMesas: AreaYMesasOnboarding[];
  menu: MenuOnboarding;
  personal: PersonalOnboarding[];
  pinSupervisorAdmin?: string;
  abrirTurnoInicial: boolean;
  fondoCajaInicial: number;
}

export interface ProvisionarRestauranteResult {
  empresaId: number;
  sucursalId: number;
  mesasCreadas: number;
  productosCreados: number;
  usuariosCreados: number;
  turnoId?: number;
  rutaRedirect: string;
}

export interface OnboardingEstadoResult {
  onboardingCompletado: boolean;
  tieneSucursales: boolean;
  totalMesas: number;
  totalProductos: number;
  tieneTurnoAbierto: boolean;
  pasoSugerido: number;
}

interface ApiResponse<T> {
  data: T;
  isSuccess: boolean;
  message: string;
}

export const onboardingApi = emptySplitApi.injectEndpoints({
  endpoints: (builder) => ({
    getOnboardingEstado: builder.query<OnboardingEstadoResult, void>({
      query: () => ({
        url: "/api/onboarding/estado",
        method: "GET",
      }),
      transformResponse: (response: ApiResponse<OnboardingEstadoResult>) => response.data,
      providesTags: ["Mesa" as any, "Producto" as any, "Turno" as any],
    }),
    provisionarRestaurante: builder.mutation<ProvisionarRestauranteResult, ProvisionarRestaurantePayload>({
      query: (body) => ({
        url: "/api/onboarding/provisionar",
        method: "POST",
        body,
      }),
      transformResponse: (response: ApiResponse<ProvisionarRestauranteResult>) => response.data,
      invalidatesTags: [
        "Mesa" as any,
        "Producto" as any,
        "Menu" as any,
        "CategoriaMenu" as any,
        "Turno" as any,
        "Usuario" as any,
        "Sucursal" as any,
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetOnboardingEstadoQuery,
  useProvisionarRestauranteMutation,
} = onboardingApi;
