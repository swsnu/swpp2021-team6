import { ReactChildren } from 'react';

interface Props {
  color: string;
  children: React.ReactNode;
}

const Label = ({ color, children }: Props) => {
  const labelStyle = {
    padding: '5px 8px',
    backgroundColor: color,
    borderRadius: '8px',
  };
  return <span style={labelStyle}>{children}</span>;
};

export default Label;
