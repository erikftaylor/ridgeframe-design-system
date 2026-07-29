import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

import './Button.css';

type ButtonWithoutIcon = {
  icon?: never;
  iconPosition?: never;
};

type ButtonWithLeadingIcon = {
  icon: ReactNode;
  iconPosition?: 'leading';
};

type ButtonWithTrailingIcon = {
  icon: ReactNode;
  iconPosition: 'trailing';
};

type ButtonIconProps = ButtonWithoutIcon | ButtonWithLeadingIcon | ButtonWithTrailingIcon;

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
  ButtonIconProps & {
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary';
  };

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    'aria-busy': ariaBusy,
    children,
    className,
    disabled,
    icon,
    iconPosition = 'leading',
    loading = false,
    type = 'button',
    variant = 'primary',
    ...buttonProps
  },
  ref,
) {
  const classes = [
    'rf-button',
    `rf-button--${variant}`,
    loading ? 'rf-button--loading' : undefined,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const iconSlot = icon ? (
    <span aria-hidden="true" className={`rf-button__icon rf-button__icon--${iconPosition}`}>
      {icon}
    </span>
  ) : null;

  return (
    <>
      <button
        {...buttonProps}
        aria-busy={loading || ariaBusy}
        className={classes}
        disabled={disabled || loading}
        ref={ref}
        type={type}
      >
        {iconPosition === 'leading' ? iconSlot : null}
        <span className={`rf-button__label${loading ? ' rf-button__label--loading' : ''}`}>
          {children}
        </span>
        {iconPosition === 'trailing' ? iconSlot : null}
        {loading ? <span aria-hidden="true" className="rf-button__loader" /> : null}
      </button>
      {loading ? <span className="rf-button__status" role="status">Loading</span> : null}
    </>
  );
});
