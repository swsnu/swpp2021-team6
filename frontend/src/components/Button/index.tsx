import './index.scss';

interface Props {
  className?: string;
  imageUrl?: string;
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ className, imageUrl, onClick, children }: Props) => (
  <button className={`${className} ${imageUrl && 'image'}`} onClick={onClick}>
    <img src={imageUrl} alt={imageUrl} />
    <span>{children}</span>
  </button>
);

export default Button;
