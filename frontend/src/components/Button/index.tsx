import './index.scss';

interface Props {
  id?: string;
  className?: string;
  imageUrl?: string;
  onClick: () => void;
  children: React.ReactNode;
}

const Button = ({ id, className, imageUrl, onClick, children }: Props) => {
  if (imageUrl) {
    return (
      <button
        id={id}
        className={`${className} custom-button with-image`}
        onClick={onClick}
      >
        <img src={imageUrl} alt={imageUrl} />
        <span>{children}</span>
      </button>
    );
  }
  return (
    <button id={id} className={`${className} custom-button`} onClick={onClick}>
      <span>{children}</span>
    </button>
  );
};
export default Button;
