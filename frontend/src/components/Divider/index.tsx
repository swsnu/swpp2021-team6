import './index.scss';

interface Props {
  text?: string;
}

const Divider = ({ text }: Props) => {
  if (text) {
    return (
      <div id="divider">
        <div className="divider-left" />
        <div className="description">{text}</div>
        <div className="divider-right" />
      </div>
    );
  }
  return <div id="divider-without-text" />;
};
export default Divider;
