import './index.scss';
import { useEffect, useState } from 'react';
import defaultImage from '../../assets/image/auth/signin-left.jpg';
import whiteLogo from '../../assets/image/whitelogo.svg';
import lineCircle from '../../assets/image/auth/line-circle.svg';
import dots from '../../assets/image/auth/dots.svg';
import quoteStart from '../../assets/image/auth/quote-start.svg';
import quoteEnd from '../../assets/image/auth/quote-end.svg';
import { quotes } from '../../assets/quotes';

interface Props {
  name: string;
  imageUrl?: string;
  children: React.ReactNode;
}

const Layout = ({ name, imageUrl = defaultImage, children }: Props) => {
  const backgroundStyle = {
    background: `linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${imageUrl})`,
    backgroundSize: 'cover',
  };
  const [randomIndex, setRandomIndex] = useState<number>(0);

  useEffect(() => {
    setRandomIndex(Math.floor(Math.random() * quotes.length));
  }, []);

  return (
    <div className="layout">
      <div className="left" style={backgroundStyle}>
        <img className="logo" src={whiteLogo} alt="white logo" />
        <img
          className="line-circle"
          src={lineCircle}
          alt="line circle decorator"
        />
        <img className="dots" src={dots} alt="dots decorator" />
        <div className="quote-container">
          <img
            className="quote-start"
            src={quoteStart}
            alt="quote start icon"
          />
          <p className="content">{quotes[randomIndex].content}</p>
          <p className="speaker">{quotes[randomIndex].speaker}</p>
          <img className="quote-end" src={quoteEnd} alt="quote end icon" />
        </div>
      </div>
      <div className="right">
        <h3>{name}</h3>
        <p>함께하면 더 즐거운 운동, 운동장입니다.</p>
        {children}
      </div>
    </div>
  );
};

export default Layout;
