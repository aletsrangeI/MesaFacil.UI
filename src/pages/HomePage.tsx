// src/pages/HomePage.tsx
import React from "react";
import Container from "../components/ui/layout/Container";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { NumberField } from "../components/ui/number-field";
import { Select } from "../components/ui/select";
import Icon from "../components/ui/icons/Icon";

export default function HomePage() {
  const [search, setSearch] = React.useState("");
  const [qtyPastor, setQtyPastor] = React.useState(1);
  const [price, setPrice] = React.useState<number | "">(95);

  const onSave = () => {
    // Ejemplo: envío de datos
    alert(`Guardado:
- Nombre: ${search || "(vacío)"}
- Precio: ${price || 0}
- Cantidad Taco Pastor: ${qtyPastor}`);
  };

  return (
    <Container
      as="main"
      maxWidth="xl"
      style={{ display: "grid", gap: 24, paddingTop: 24, paddingBottom: 48 }}
    >
      {/* Header simple */}
      <header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <h1 style={{ margin: 0 }}>Demo UI — Pedidos</h1>
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="ghost">Cancelar</Button>
          <Button onClick={onSave}>Guardar</Button>
        </div>
      </header>

      {/* Filtro / búsqueda */}
      <section
        aria-label="Búsqueda"
        style={{ display: "grid", gap: 12, maxWidth: 560 }}
      >
        <Input
          label="Buscar platillo"
          placeholder="Ej. Taco, Hamburguesa, Ensalada…"
          rightIcon={<Icon name="Search" />}
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          helperText="Escribe para filtrar el catálogo"
          size="md"
        />
      </section>
  

      {/* Form breve (nombre + precio) */}
      <section
        aria-label="Edición rápida"
        style={{ display: "grid", gap: 16, maxWidth: 560 }}
      >
        <Input
          label="Nombre de platillo"
          placeholder="Ej. Hamburguesa Clásica"
          value={search}
          onChange={(e) => setSearch(e.currentTarget.value)}
          size="lg"
        />
        <Input
          label="Precio"
          type="number"
          placeholder="Ej. 95"
          leftIcon={<Icon name="BadgeDollarSign" />}
          value={price}
          onChange={(e) =>
            setPrice(
              e.currentTarget.value === "" ? "" : Number(e.currentTarget.value)
            )
          }
          helperText="En pesos MXN"
          size="sm"
        />
        <div style={{ display: "flex", gap: 12 }}>
          <Button variant="primary" size="lg">primary</Button>
          <Button variant="secondary" size="md">secondary</Button>
          <Button variant="ghost" size="sm">ghost</Button>
        </div>

        <Select
          helperText="Elige una opción"
          label="Categoría"
          leftIcon={<span>🍽️</span>}
          onChange={() => {}}
          size="md"
          value="tacos"
        >
        </Select>
      </section>

      {/* Tarjeta de producto (ejemplo) */}
      <section aria-label="Catálogo" style={{ display: "grid", gap: 16 }}>
        <h2 style={{ margin: 0, fontSize: 18 }}>Ejemplo de item</h2>
        <article
          style={{
            display: "grid",
            gridTemplateColumns: "120px 1fr auto",
            gap: 16,
            padding: 16,
            borderRadius: 12,
            background: "#fff",
            boxShadow: "var(--shadow-sm, 0 4px 12px rgba(0,0,0,.06))",
            border: "1px solid rgba(0,0,0,.08)",
            alignItems: "center",
          }}
        >
          {/* Thumbnail placeholder */}
          <div
            aria-hidden
            style={{
              width: 120,
              height: 90,
              borderRadius: 10,
              background:
                "linear-gradient(120deg, rgba(214,69,69,.12), rgba(226,167,46,.12))",
            }}
          />

          {/* Contenido */}
          <div style={{ display: "grid", gap: 8 }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
              <h3 style={{ margin: 0 }}>Taco Pastor</h3>
              <strong>$32</strong>
            </div>
            <p style={{ margin: 0, color: "var(--color-muted, #6b7280)" }}>
              Tortilla de maíz, cerdo adobado, piña asada y cebolla.
            </p>

            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <span
                style={{
                  fontSize: 12,
                  background: "rgba(214,69,69,.14)",
                  color: "#7b2c2c",
                  padding: "6px 8px",
                  borderRadius: 999,
                }}
              >
                Picante
              </span>
              <span
                style={{
                  fontSize: 12,
                  background: "rgba(226,167,46,.14)",
                  color: "#7a560f",
                  padding: "6px 8px",
                  borderRadius: 999,
                }}
              >
                Maíz
              </span>
            </div>
          </div>

          {/* Acciones */}
          <div style={{ display: "grid", gap: 8, justifyItems: "end" }}>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <NumberField
                aria-label="Cantidad Taco Pastor"
                min={0}
                max={99}
                step={1}
                size="md"
                value={qtyPastor}
                onChange={setQtyPastor}
              />
              <Button onClick={() => alert(`Agregar ${qtyPastor} Taco Pastor`)}>
                Agregar
              </Button>
            </div>
            <Button variant="link">Detalles</Button>
          </div>
        </article>
      </section>
    </Container>
  );
}
