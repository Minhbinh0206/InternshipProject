import React from 'react';
import './CustomButton.css';

type ButtonVariant = 'blue' | 'white' | 'black' | 'red' | 'gray';
type ButtonLayout  = 'iconFirst' | 'textFirst' | 'noIcon';

interface ButtonCustomProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  layout?: ButtonLayout;
  icon?: React.ReactNode;
  text?: string;
}

const CustomButton: React.FC<ButtonCustomProps> = ({
  variant = 'blue',
  layout  = 'noIcon',
  icon,
  text = 'Button',
  className = '',
  children,
  ...rest
}) => {
  // gộp className ngoài vào để vẫn custom được
  const cls = `btn btn-${variant} ${layout} ${className}`.trim();

  return (
    <button {...rest} className={cls}>
      {layout === 'iconFirst' && icon}
      {layout !== 'noIcon'  && <span>{children ?? text}</span>}
      {layout === 'textFirst' && icon}
      {layout === 'noIcon'   && (children ?? text)}
    </button>
  );
};

export default CustomButton;
