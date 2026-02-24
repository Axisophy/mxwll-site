'use client';

import React, { ReactNode } from 'react';

// -----------------------------------------------------------------------------
// ControlGroup — wraps related controls with optional title
// -----------------------------------------------------------------------------

interface ControlGroupProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function ControlGroup({ title, children, className = '' }: ControlGroupProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      {title && (
        <div className="text-xs font-mono uppercase tracking-wider text-black/40">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Slider — range input with label and formatted value display
// -----------------------------------------------------------------------------

interface SliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step?: number;
  formatValue?: (value: number) => string;
  className?: string;
}

export function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step = 1,
  formatValue,
  className = '',
}: SliderProps) {
  const displayValue = formatValue ? formatValue(value) : value.toString();

  return (
    <div className={className}>
      <div className="flex justify-between items-baseline mb-1">
        <label className="text-[11px] md:text-xs font-mono text-black/50">{label}</label>
        <span className="text-[11px] md:text-xs font-mono text-black/80">{displayValue}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        className="w-full h-2 md:h-1.5 bg-black/10 appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 md:[&::-webkit-slider-thumb]:w-4 md:[&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:bg-[var(--color-blue)] [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// Button — multi-variant
// -----------------------------------------------------------------------------

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  disabled?: boolean;
  className?: string;
}

const variantStyles: Record<ButtonVariant, { base: string; active: string }> = {
  primary: {
    base: 'bg-[var(--color-blue)] text-white hover:bg-black',
    active: 'bg-black text-white',
  },
  secondary: {
    base: 'bg-black/5 text-black/70 hover:bg-black/10',
    active: 'bg-black/15 text-black',
  },
  ghost: {
    base: 'bg-white border border-black/10 text-black/60 hover:bg-black/5',
    active: 'bg-black text-white border-black',
  },
  danger: {
    base: 'bg-[var(--color-pink)] text-white hover:bg-black',
    active: 'bg-black text-white',
  },
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-2 py-2 md:py-1 text-xs',
  md: 'px-4 py-2.5 md:py-2 text-xs',
};

export function Button({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  active = false,
  disabled = false,
  className = '',
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center font-mono transition-colors
        disabled:opacity-30 disabled:cursor-not-allowed
        ${sizeStyles[size]}
        ${active ? styles.active : styles.base}
        ${className}
      `}
    >
      {children}
    </button>
  );
}

// -----------------------------------------------------------------------------
// ButtonGroup — segmented toggle
// -----------------------------------------------------------------------------

interface ButtonGroupOption<T extends string> {
  value: T;
  label: string;
}

interface ButtonGroupProps<T extends string> {
  options: ButtonGroupOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: ButtonSize;
  className?: string;
}

export function ButtonGroup<T extends string>({
  options,
  value,
  onChange,
  size = 'sm',
  className = '',
}: ButtonGroupProps<T>) {
  return (
    <div className={`inline-flex overflow-hidden border border-black/10 ${className}`}>
      {options.map((option, i) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`
            ${sizeStyles[size]} font-mono transition-colors
            ${i > 0 ? 'border-l border-black/10' : ''}
            ${value === option.value
              ? 'bg-[var(--color-blue)] text-white'
              : 'bg-black/5 text-black/60 hover:text-black'
            }
          `}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// Select — dropdown with label
// -----------------------------------------------------------------------------

interface SelectOption<T extends string> {
  value: T;
  label: string;
}

interface SelectProps<T extends string> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: SelectOption<T>[];
  className?: string;
}

export function Select<T extends string>({
  label,
  value,
  onChange,
  options,
  className = '',
}: SelectProps<T>) {
  return (
    <div className={className}>
      {label && (
        <label className="text-[11px] md:text-xs font-mono text-black/50 block mb-1">
          {label}
        </label>
      )}
      <select
        value={value}
        onChange={e => onChange(e.target.value as T)}
        className="w-full px-4 py-2 text-xs font-mono border border-black/10 bg-white focus:outline-none focus:border-black"
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

// -----------------------------------------------------------------------------
// Toggle — checkbox with label and optional description
// -----------------------------------------------------------------------------

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
  className?: string;
}

export function Toggle({
  label,
  checked,
  onChange,
  description,
  className = '',
}: ToggleProps) {
  return (
    <label className={`flex items-start gap-2 cursor-pointer text-sm ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="mt-1"
      />
      <div>
        <span className="text-black/80">{label}</span>
        {description && (
          <span className="block text-xs text-black/50">{description}</span>
        )}
      </div>
    </label>
  );
}

// -----------------------------------------------------------------------------
// Readout — label + value + optional unit
// -----------------------------------------------------------------------------

interface ReadoutProps {
  label: string;
  value: string | number;
  unit?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dark';
  className?: string;
}

const readoutSizes = {
  sm: 'text-sm',
  md: 'text-lg',
  lg: 'text-2xl',
};

export function Readout({
  label,
  value,
  unit,
  size = 'md',
  variant = 'default',
  className = '',
}: ReadoutProps) {
  if (variant === 'dark') {
    return (
      <div className={`bg-black p-4 ${className}`}>
        <div className="text-[10px] font-mono text-white/50 uppercase tracking-wider mb-1">
          {label}
        </div>
        <div className={`font-mono font-bold text-white ${readoutSizes[size]}`}>
          {value}
          {unit && <span className="text-white/40 font-normal ml-1 text-xs">{unit}</span>}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-black/5 p-4 ${className}`}>
      <div className="text-xs text-black/40">{label}</div>
      <div className={`font-mono font-bold ${readoutSizes[size]}`}>
        {value}
        {unit && <span className="text-black/40 font-normal ml-1 text-xs">{unit}</span>}
      </div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// ReadoutGrid — grid of Readout items
// -----------------------------------------------------------------------------

interface ReadoutGridItem {
  label: string;
  value: string | number;
  unit?: string;
}

interface ReadoutGridProps {
  items: ReadoutGridItem[];
  columns?: 2 | 3 | 4;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'dark';
  className?: string;
}

const colClasses = {
  2: 'grid-cols-2',
  3: 'grid-cols-2 md:grid-cols-3',
  4: 'grid-cols-2 md:grid-cols-4',
};

export function ReadoutGrid({
  items,
  columns = 2,
  size = 'sm',
  variant = 'default',
  className = '',
}: ReadoutGridProps) {
  return (
    <div className={`grid ${colClasses[columns]} gap-2 ${className}`}>
      {items.map((item, i) => (
        <Readout key={i} {...item} size={size} variant={variant} />
      ))}
    </div>
  );
}

// -----------------------------------------------------------------------------
// InfoPanel — contextual help / info box
// -----------------------------------------------------------------------------

interface InfoPanelProps {
  title?: string;
  children: ReactNode;
  variant?: 'default' | 'highlight' | 'success';
  className?: string;
}

const infoPanelStyles = {
  default: {
    bg: 'bg-black/5',
    title: 'text-xs font-bold text-black/40 mb-2',
    body: 'text-sm text-black/70 leading-relaxed',
  },
  highlight: {
    bg: 'bg-[var(--color-blue)] text-white',
    title: 'text-[10px] font-mono text-white/60 uppercase tracking-wider mb-1',
    body: 'text-sm text-white leading-relaxed',
  },
  success: {
    bg: 'bg-[var(--color-lime)]',
    title: 'text-[10px] font-mono text-black/60 uppercase tracking-wider mb-1',
    body: 'text-sm text-black leading-relaxed',
  },
};

export function InfoPanel({
  title,
  children,
  variant = 'default',
  className = '',
}: InfoPanelProps) {
  const styles = infoPanelStyles[variant];

  return (
    <div className={`p-4 ${styles.bg} ${className}`}>
      {title && <div className={styles.title}>{title}</div>}
      <div className={styles.body}>{children}</div>
    </div>
  );
}
