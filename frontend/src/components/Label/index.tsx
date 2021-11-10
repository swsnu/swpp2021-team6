interface Props {
  className?: string;
  color: string;
  children: React.ReactNode;
}

const Label = ({ className, color, children }: Props) => {
  const labelStyle = {
    padding: '5px 8px',
    backgroundColor: color,
    color: 'white',
  };

  return (
    <span className={className} style={labelStyle}>
      {children}
    </span>
  );
};

export default Label;
