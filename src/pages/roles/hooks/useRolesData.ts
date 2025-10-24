import {
  useRolGetPagedQuery,
  type RolGetPagedApiResponse,
} from "../../../services/generated/api";
import type { RolRow } from "./types";

export function useRolesData(args: {
  page: number;
  pageSize: number;
  sort?: string;
  filter?: string;
}) {
  const { data, isLoading, isFetching, error, refetch } = useRolGetPagedQuery({
    page: args.page,
    pageSize: args.pageSize,
  });

  const api = data as RolGetPagedApiResponse | undefined;
  const rows: RolRow[] = (api?.data ?? []).map((r: any) => ({
    id: r.id,
    nombre: r.nombre,
    isSystem: r.isSystem,
    isAssignable: r.isAssignable,
  }));

  return {
    rows,
    totalCount: api?.totalCount ?? 0,
    isLoading,
    isFetching,
    error,
    refetch,
  };
}
