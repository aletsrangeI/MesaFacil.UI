import React from 'react';
import * as Lucide from 'lucide-react';

type IconName = keyof typeof Lucide; // p.ej. "Search", "ShoppingCart", etc.

export interface IconProps extends React.SVGAttributes<SVGElement> {
  name: IconName;
  size?: number;        // px
  strokeWidth?: number; // grosor de línea
  title?: string;       // accesibilidad
}

export default function Icon({
  name,
  size = 18,
  strokeWidth = 2,
  title,
  ...rest
}: IconProps) {
  const Cmp = Lucide[name] as unknown as React.ComponentType<any>;
  if (!Cmp) {
    if (import.meta.env.DEV) {
      console.warn(`Icon '${name}' no existe en lucide-react`);
    }
    return null;
  }

  // Hereda color de texto por default (currentColor)
  return (
    <Cmp
      width={size}
      height={size}
      strokeWidth={strokeWidth}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : 'presentation'}
      {...rest}
    >
      {title ? <title>{title}</title> : null}
    </Cmp>
  );
}