// src/components/modal/Modal.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { Modal } from "./Modal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Select } from "../ui/select";

const meta: Meta<typeof Modal> = {
  title: "Feedback/Modal",
  component: Modal,
  parameters: { layout: "centered" },
};
export default meta;

type Story = StoryObj<typeof Modal>;

const Options = () => (
  <>
    <option value="true">Sí</option>
    <option value="false">No</option>
  </>
);

const FormExample = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>Abrir formulario</Button>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Crear nuevo rol"
        description="Define un rol y asigna permisos personalizados."
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setOpen(false)}>Guardar</Button>
          </>
        }
      >
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
          }}
        >
          <div>
            <label htmlFor="nombre">Nombre del rol</label>
            <Input id="nombre" placeholder="Ej. Mesero" />
          </div>

          <div>
            <label htmlFor="descripcion">Descripción</label>
            <Input
              id="descripcion"
              placeholder="Ej. Puede tomar pedidos y cerrar mesas"
            />
          </div>

          <div>
            <Select
              aria-label="¿Es asignable?"
              helperText="Elige una opción"
              label="Categoría"
              leftIconName="Utensils"
              onChange={() => {}}
              size="md"
              value="tacos"
            >
              <Options />
            </Select>
          </div>
        </form>
      </Modal>
    </>
  );
};

export const Formulario: Story = { render: () => <FormExample /> };
