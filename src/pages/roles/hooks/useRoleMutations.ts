import {
  useRolInsertMutation,
  useRolUpdateMutation,
  useRolDeleteMutation,
} from "../../../services/generated/api";

export function useRoleMutations() {
  const [createRol, createState] = useRolInsertMutation();
  const [updateRol, updateState] = useRolUpdateMutation();
  const [deleteRol, deleteState] = useRolDeleteMutation();

  const isMutating =
    createState.isLoading || updateState.isLoading || deleteState.isLoading;

  return {
    createRol,
    updateRol,
    deleteRol,
    createState,
    updateState,
    deleteState,
    isMutating,
  };
}
