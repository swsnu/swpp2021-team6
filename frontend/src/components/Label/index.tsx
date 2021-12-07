interface Props {
  className?: string;
  color: string;
  font: string;
  children: React.ReactNode;
}

const Label = ({ className, color, font = 'white', children }: Props) => {
  const labelStyle = {
    padding: '5px 20px',
    marginRight: '15px',
    borderRadius: '55px',
    fontSize: '10px',
    backgroundColor: color,
    color: font,
  };

  return (
    <span className={className} style={labelStyle}>
      {children}
    </span>
  );
};

export default Label;
