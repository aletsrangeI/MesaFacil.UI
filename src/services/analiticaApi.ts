import { emptySplitApi as api } from './baseApi';

export interface ItemIngenieriaMenuDTO {
  idProducto: number;
  nombreProducto: string;
  categoria: string;
  precioVentaPromedio: number;
  costoReceta: number;
  margenContribucion: number;
  foodCostPct: number;
  unidadesVendidas: number;
  porcentajePopularidad: number;
  ingresoTotal: number;
  utilidadTotal: number;
  cuadrante: 'Estrella' | 'CaballoBatalla' | 'Puzzle' | 'Perro' | string;
  recomendacionAccion: string;
}

export interface ItemSinCosteoDTO {
  idProducto: number;
  nombreProducto: string;
  categoria: string;
  unidadesVendidas: number;
  ingresoTotal: number;
  precioVentaPromedio: number;
}

export interface MenuEngineeringKpisDTO {
  foodCostPromedioGeneral: number;
  margenPromedio: number;
  platilloMasRentable: string;
  margenPlatilloMasRentable: number;
  platilloMasVendido: string;
  unidadesPlatilloMasVendido: number;
  cantidadEstrellas: number;
  cantidadCaballos: number;
  cantidadPuzzles: number;
  cantidadPerros: number;
  cantidadSinCosteo: number;
}

export interface MenuEngineeringReportDTO {
  kpis: MenuEngineeringKpisDTO;
  margenContribucionPromedio: number;
  umbralPopularidadUnidades: number;
  totalUnidadesVendidas: number;
  totalVentas: number;
  totalUtilidadBruta: number;
  foodCostPromedioPonderadoPct: number;
  items: ItemIngenieriaMenuDTO[];
  pendientesDeCosteo: ItemSinCosteoDTO[];
}

export interface GetIngenieriaMenuParams {
  idSucursal?: number;
  fechaInicio?: string;
  fechaFin?: string;
  idCategoria?: number;
}

export const analiticaApi = api.injectEndpoints({
  endpoints: (build) => ({
    getIngenieriaMenu: build.query<
      { isSuccess: boolean; data: MenuEngineeringReportDTO; message?: string },
      GetIngenieriaMenuParams
    >({
      query: (params) => ({
        url: '/api/analitica/ingenieria-menu',
        params,
      }),
      providesTags: ['Pedido', 'Producto', 'Menu'],
    }),
  }),
});

export const { useGetIngenieriaMenuQuery } = analiticaApi;
