import React, { useMemo, useState } from "react";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarShape = "rounded" | "square" | "circle";
export type AvatarStatus = "none" | "online" | "busy" | "away" | "offline";

export type AvatarProps = {
  /** Nombre del usuario para fallback de iniciales y accesibilidad */
  name: string;
  /** URL de imagen opcional */
  src?: string | null;
  /** Texto alternativo; por defecto usa `name` */
  alt?: string;
  /** Tamaño visual del avatar */
  size?: AvatarSize;
  /** Forma del avatar */
  shape?: AvatarShape;
  /** Muestra anillo de foco/realce */
  ring?: boolean;
  /** Estado con indicator dot (esquina inferior derecha) */
  status?: AvatarStatus;
  /** Clase adicional */
  className?: string;
  /** OnClick opcional para comportarse como botón */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  /** Slot para overlay (ej: ícono de cámara) */
  overlay?: React.ReactNode;
  /** Controlar carga de imagen desde fuera (pruebas) */
  forceImageError?: boolean;
};

const SIZE_MAP: Record<AvatarSize, number> = { sm: 24, md: 32, lg: 40, xl: 56 };

function getInitials(name: string): string {
  const parts = (name || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({
  name,
  src,
  alt,
  size = "md",
  shape = "circle",
  ring = false,
  status = "none",
  className = "",
  onClick,
  overlay,
  forceImageError,
}: AvatarProps) {
  const [imgErr, setImgErr] = useState(false);
  const pixel = SIZE_MAP[size] ?? SIZE_MAP.md;
  const initials = useMemo(() => getInitials(name), [name]);
  const ariaLabel = alt || name;

  const shapeClass =
    shape === "square"
      ? "ui-avatar--square"
      : shape === "rounded"
        ? "ui-avatar--rounded"
        : "ui-avatar--circle";
  const ringClass = ring ? " ui-avatar--ring" : "";
  const statusClass = status !== "none" ? ` ui-avatar--status-${status}` : "";

  const showImage = !!src && !imgErr && !forceImageError;

  return (
    <div
      className={[
        "ui-avatar",
        shapeClass,
        ringClass,
        statusClass,
        className,
      ].join(" ")}
      style={{ width: pixel, height: pixel }}
      role={onClick ? "button" : undefined}
      aria-label={ariaLabel}
      tabIndex={onClick ? 0 : -1}
      onClick={onClick}
      onKeyDown={(e) => {
        if (!onClick) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(e as any);
        }
      }}
    >
      {showImage ? (
        <img
          src={src!}
          alt={ariaLabel}
          className="ui-avatar__img"
          draggable={false}
          onError={() => setImgErr(true)}
        />
      ) : (
        <span className="ui-avatar__initials" aria-hidden="true">
          {initials}
        </span>
      )}

      {overlay ? <span className="ui-avatar__overlay">{overlay}</span> : null}
      {status !== "none" ? (
        <span className="ui-avatar__dot" aria-hidden="true" />
      ) : null}
    </div>
  );
}

export default Avatar;
