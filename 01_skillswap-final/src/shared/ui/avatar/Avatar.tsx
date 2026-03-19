import React, { useEffect, useState } from 'react';

export interface AvatarProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src?: string;
  fallbackSrc?: string;
}

const Avatar: React.FC<AvatarProps> = ({ src, fallbackSrc, alt = 'Avatar', ...imgProps }) => {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    if (src !== currentSrc) {
      setCurrentSrc(src);
    }
  }, [src, currentSrc]);

  //если картинка не загрузилась - подставляем запасной вариант
  const handleError = () => {
    if (fallbackSrc && currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  return <img {...imgProps} src={currentSrc || fallbackSrc} alt={alt} onError={handleError} />;
};

export default Avatar;
