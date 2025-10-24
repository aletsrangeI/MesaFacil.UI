import { useCallback, useState } from "react";

export function useRolesTableState(
  initial = {
    page: 1,
    pageSize: 10 as 5 | 10 | 20,
    sort: "nombre",
    filter: "",
  }
) {
  const [page, setPage] = useState(initial.page);
  const [pageSize, setPageSize] = useState(initial.pageSize);
  const [sort, setSort] = useState(initial.sort);
  const [filter, setFilter] = useState(initial.filter);

  const onPageChange = useCallback((p: number) => setPage(p), []);
  const onPageSizeChange = useCallback(
    (ps: number) => setPageSize(ps as any),
    []
  );
  const onSortChange = useCallback((s: string) => setSort(s), []);
  const onFilterChange = useCallback((f: string) => setFilter(f), []);

  return {
    page,
    pageSize,
    sort,
    filter,
    onPageChange,
    onPageSizeChange,
    onSortChange,
    onFilterChange,
  };
}
