import { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
}

const Button = ({ className, children, ...rest }: Props) => (
  <button className={className} {...rest}>
    {children}
  </button>
);

export default Button;
