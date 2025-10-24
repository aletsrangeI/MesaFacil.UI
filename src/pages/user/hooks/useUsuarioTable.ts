import { useMemo, useState } from "react";
import type { UsuarioRow } from "./types";
import type { ColumnDef } from "@tanstack/react-table";
import {
  useUsuarioGetPagedQuery,
  type UsuarioGetPagedApiResponse,
} from "../../../services/generated/api";

type UseUsuarioTableOptions = {
  apiPageStartsAt?: 0 | 1;
  onEditRequested?: (row: UsuarioRow) => void;
  onCreateRequested?: () => void;
};

export const useUsuarioTable = (opts?: UseUsuarioTableOptions) => {
  const apiStartsAt = opts?.apiPageStartsAt ?? 1;
  const [page, setPage] = useState<number>(apiStartsAt);
  const [pageSize, setPageSize] = useState<number>(10);

  const {
    data: paged,
    isLoading: isPageLoading,
    isFetching: isPageFetching,
    refetch: refetchPage,
    error: pageError,
  } = useUsuarioGetPagedQuery({ page, pageSize });

  const columns: ColumnDef<UsuarioRow, any>[] = useMemo(
    () => [
      { accessorKey: "id", header: "ID" },
      { accessorKey: "nombreCompleto", header: "Nombre" },
      { accessorKey: "correo", header: "Correo" },
      { accessorKey: "idEmpresa", header: "Empresa" },
    ],
    []
  );

  const rows: UsuarioRow[] = useMemo(() => {
    const list = (paged as UsuarioGetPagedApiResponse | undefined)?.data ?? [];
    return list.map((r: any) => ({
      id: r.id,
      idEmpresa: r.idEmpresa,
      nombreCompleto: r.nombreCompleto,
      correo: r.correo,
    }));
  }, [paged]);

  return {
    table: {
      columns,
    },
  };
};
