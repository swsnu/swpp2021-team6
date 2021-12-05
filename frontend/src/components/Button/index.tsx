import './index.scss';

interface Props {
  id?: string;
  className?: string;
  imageUrl?: string;
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ id, className, imageUrl, onClick, children }: Props) => (
  <button
    id={id}
    className={`${className} ${imageUrl && 'image'} custom-button`}
    onClick={onClick}
  >
    <img src={imageUrl} alt={imageUrl} />
    <span>{children}</span>
  </button>
);

export default Button;
