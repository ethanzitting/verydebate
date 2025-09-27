import { twMerge } from 'tailwind-merge';
import { FC } from 'react';

type Props = {
  className?: string;
  icon: string;
  size?: string;
};

export const FontAwesomeIcon: FC<Props> = ({
  icon,
  className = '',
  size = '20px',
}) => {
  return (
    <i
      className={twMerge('fa-sharp fa-solid', className, icon)}
      style={{
        minHeight: size,
        maxHeight: size,
        minWidth: size,
        maxWidth: size,
        height: size,
        width: size,
      }}
    ></i>
  );
};
