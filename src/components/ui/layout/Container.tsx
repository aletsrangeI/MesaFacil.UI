import React from 'react';
import './container.css';

type MaxWidth = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ContainerProps extends React.HTMLAttributes<HTMLElement> {
  /** Controla el ancho máximo (default: 'xl') */
  maxWidth?: MaxWidth;
  /** Si true, quita el padding lateral */
  noPadding?: boolean;
  /** Tag a renderizar (div por defecto) */
  as?: React.ElementType;
}

const maxMap: Record<Exclude<MaxWidth, 'full'>, number> = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1200,
};

export default function Container({
  as: Tag = 'div',
  maxWidth = 'xl',
  noPadding = false,
  className,
  style,
  children,
  ...rest
}: ContainerProps) {
  const inlineMax = maxWidth === 'full' ? '100%' : `${maxMap[maxWidth]}px`;

  return (
    <Tag
      className={[
        'container',
        noPadding ? 'container--no-pad' : '',
        className ?? '',
      ].join(' ').trim()}
      style={{ ...style, ['--container-max' as any]: inlineMax }}
      {...rest}
    >
      {children}
    </Tag>
  );
}
