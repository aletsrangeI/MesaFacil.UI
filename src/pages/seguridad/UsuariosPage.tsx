import React from "react";
import {
  useUsuarioGetAllQuery,
  useUsuarioInsertMutation,
  useUsuarioUpdateMutation,
  useUsuarioDeleteMutation,
  useRolGetAllQuery,
  useEmpresaGetAllQuery,
  type UsuarioDto,
} from "../../services/generated/api";
import { Button } from "../../components/ui/button/Button";
import { Input } from "../../components/ui/input/Input";
import Icon from "../../components/ui/icons/Icon";
import { useToast } from "../../components/ui/toast/Toast";
import Container from "../../components/ui/layout/Container";
import { FormGenerator } from "../../forms/FormGenerator";
import { mesaFacilFields } from "../../components/ui/adapters";
import { useUsuariosForm } from "./useUsuariosForm";

import "./usuarios.css";

export default function UsuariosPage() {
  const { addToast } = useToast();
  const { data: resp, isLoading: isLoadingUsers, isError, refetch } = useUsuarioGetAllQuery();
  
  const { data: rolesResp } = useRolGetAllQuery();
  const { data: empresasResp } = useEmpresaGetAllQuery();

  const [insertUser, { isLoading: isInserting }] = useUsuarioInsertMutation();
  const [updateUser, { isLoading: isUpdating }] = useUsuarioUpdateMutation();
  const [deleteUser, { isLoading: isDeleting }] = useUsuarioDeleteMutation();

  const [search, setSearch] = React.useState("");
  
  // Modal states & SDUI fields
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const [editingUser, setEditingUser] = React.useState<UsuarioDto | null>(null);
  const [formError, setFormError] = React.useState<string | null>(null);

  const { formId, fields, isLoadingFields, isFieldsError } = useUsuariosForm();

  const dataSources = React.useMemo(() => {
    return {
      roles: Array.isArray(rolesResp?.data)
        ? rolesResp.data.map((r) => ({ id: r.id ?? 0, nombre: r.nombre ?? "" }))
        : [],
      empresas: Array.isArray(empresasResp?.data)
        ? empresasResp.data.map((e) => ({ id: e.id ?? 0, nombre: e.nombre ?? "" }))
        : [],
    };
  }, [rolesResp, empresasResp]);
  const dynamicFields = React.useMemo(() => {
    if (!editingUser) {
      // Crear: la contraseña es obligatoria
      return fields.map((f) => {
        if (f.name === "password") {
          return {
            ...f,
            validations: [...(f.validations ?? []), { type: "required" as const, value: 1 }],
          };
        }
        return f;
      });
    } else {
      // Editar: la contraseña es opcional, cambiamos label/placeholder para que sea amigable
      return fields.map((f) => {
        if (f.name === "password") {
          return {
            ...f,
            label: "Nueva Contraseña (opcional)",
            placeholder: "Dejar en blanco para mantener la contraseña actual",
            validations: (f.validations ?? []).filter((v) => v.type !== "required"),
          };
        }
        return f;
      });
    }
  }, [fields, editingUser]);
  // Users list
  const users: UsuarioDto[] = React.useMemo(() => {
    if (Array.isArray(resp?.data)) {
      return resp.data;
    }
    return [];
  }, [resp]);

  // Filter users by search query
  const filteredUsers = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.nombreCompleto?.toLowerCase().includes(q) ||
        u.correo?.toLowerCase().includes(q)
    );
  }, [users, search]);

  const openModal = (user: UsuarioDto | null = null) => {
    setFormError(null);
    if (user) {
      setEditingUser(user);
    } else {
      setEditingUser(null);
    }
    dialogRef.current?.showModal();
  };

  const closeModal = () => {
    dialogRef.current?.close();
  };

  const initialValuesOverride = React.useMemo(() => {
    if (!editingUser) return undefined;
    return {
      nombreCompleto: editingUser.nombreCompleto ?? "",
      correo: editingUser.correo ?? "",
      password: "",
      idRol: editingUser.idRol ? String(editingUser.idRol) : "",
      idEmpresa: editingUser.idEmpresa ? String(editingUser.idEmpresa) : "1",
    };
  }, [editingUser]);

  const handleFormikSubmit = async (values: Record<string, any>) => {
    setFormError(null);

    const name = String(values.nombreCompleto ?? "").trim();
    const email = String(values.correo ?? "").trim();
    const password = String(values.password ?? "").trim();
    const idRol = values.idRol ? Number(values.idRol) : undefined;
    const idEmpresa = values.idEmpresa ? Number(values.idEmpresa) : 1;

    if (!name || !email) {
      setFormError("Todos los campos son obligatorios.");
      return;
    }

    try {
      if (editingUser) {
        // Update user
        const res = await updateUser({
          usuarioDto: {
            id: editingUser.id,
            idEmpresa,
            nombreCompleto: name,
            correo: email,
            password: password || undefined,
            idRol,
          },
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Usuario actualizado con éxito.", variant: "success" });
          closeModal();
          refetch();
        } else {
          setFormError(res.message || "Error al actualizar el usuario.");
        }
      } else {
        // Create user
        const res = await insertUser({
          usuarioDto: {
            idEmpresa,
            nombreCompleto: name,
            correo: email,
            password: password || undefined,
            idRol,
          },
        }).unwrap();

        if (res.isSuccess) {
          addToast({ message: "Usuario creado con éxito.", variant: "success" });
          closeModal();
          refetch();
        } else {
          setFormError(res.message || "Error al crear el usuario.");
        }
      }
    } catch (err: any) {
      setFormError(err?.data?.message || "Ocurrió un error inesperado al guardar.");
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${name}"?`)) {
      return;
    }

    try {
      const res = await deleteUser({ id }).unwrap();
      if (res.isSuccess) {
        addToast({ message: "Usuario eliminado correctamente.", variant: "success" });
        refetch();
      } else {
        addToast({ message: res.message || "Error al eliminar el usuario.", variant: "error" });
      }
    } catch (err: any) {
      addToast({
        message: err?.data?.message || "Ocurrió un error al intentar eliminar el usuario.",
        variant: "error",
      });
    }
  };

  return (
    <Container as="div" maxWidth="xl" className="users-page">
      <header className="users-page__header">
        <div className="users-page__title-area">
          <h1 className="users-page__title">Administración de Usuarios</h1>
          <p className="users-page__subtitle">
            Crea, edita y administra las cuentas de usuarios en el sistema.
          </p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Icon name="UserPlus" />}
          onClick={() => openModal()}
        >
          Crear Usuario
        </Button>
      </header>

      <section className="users-page__filters" aria-label="Filtros de búsqueda">
        <Input
          label="Buscar usuario"
          placeholder="Filtra por nombre o correo electrónico..."
          leftIcon={<Icon name="Search" />}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          clearable
          onClear={() => setSearch("")}
        />
      </section>

      <div className="users-page__content">
        {isLoadingUsers ? (
          <div className="users-page__state">
            <div className="users-page__spinner" aria-hidden />
            <p>Cargando lista de usuarios...</p>
          </div>
        ) : isError ? (
          <div className="users-page__state is-error">
            <Icon name="AlertTriangle" />
            <p>No fue posible cargar los usuarios.</p>
            <Button variant="secondary" onClick={() => refetch()}>
              Reintentar
            </Button>
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="users-page__state is-empty">
            <Icon name="Users" />
            <p>
              {search
                ? "No se encontraron usuarios que coincidan con la búsqueda."
                : "No hay usuarios registrados aún."}
            </p>
          </div>
        ) : (
          <div className="users-page__table-wrapper">
            <table className="users-page__table">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Nombre Completo</th>
                  <th scope="col">Correo Electrónico</th>
                  <th scope="col" style={{ textAlign: "right" }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td className="users-page__user-name">
                      <div className="users-page__avatar-placeholder" aria-hidden>
                        {user.nombreCompleto?.charAt(0).toUpperCase() || "U"}
                      </div>
                      <span>{user.nombreCompleto}</span>
                    </td>
                    <td className="users-page__user-email">{user.correo}</td>
                    <td className="users-page__actions">
                      <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        leftIcon={<Icon name="Edit2" />}
                        onClick={() => openModal(user)}
                        aria-label={`Editar usuario ${user.nombreCompleto}`}
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        iconOnly
                        leftIcon={<Icon name="Trash2" />}
                        onClick={() =>
                          user.id && handleDelete(user.id, user.nombreCompleto ?? "")
                        }
                        aria-label={`Eliminar usuario ${user.nombreCompleto}`}
                        disabled={isDeleting}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Dialog for Create/Edit */}
      <dialog ref={dialogRef} className="users-page__dialog">
        <div className="users-page__form">
          <header className="users-page__form-header">
            <h2>{editingUser ? "Editar Usuario" : "Crear Usuario"}</h2>
            <button
              type="button"
              className="users-page__dialog-close"
              onClick={closeModal}
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </header>

          <main className="users-page__form-body">
            {isLoadingFields ? (
              <div className="users-page__state">
                <div className="users-page__spinner" aria-hidden />
                <p>Cargando campos del formulario...</p>
              </div>
            ) : isFieldsError ? (
              <div className="users-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>No fue posible cargar la estructura del formulario.</span>
              </div>
            ) : (
              <FormGenerator
                formId={formId}
                showDefaultSubmit={false}
                fields={dynamicFields}
                components={mesaFacilFields}
                onSubmit={handleFormikSubmit}
                initialValuesOverride={initialValuesOverride}
                dataSources={dataSources}
              />
            )}

            {formError && (
              <div className="users-page__form-error" role="alert">
                <Icon name="AlertCircle" />
                <span>{formError}</span>
              </div>
            )}
          </main>

          <footer className="users-page__form-footer">
            <Button type="button" variant="ghost" onClick={closeModal}>
              Cancelar
            </Button>
            <Button
              type="submit"
              form={formId}
              variant="primary"
              isLoading={isInserting || isUpdating || isLoadingFields}
              disabled={isLoadingFields}
            >
              Guardar
            </Button>
          </footer>
        </div>
      </dialog>
    </Container>
  );
}
