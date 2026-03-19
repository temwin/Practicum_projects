import type { SVGProps } from 'react';
const SvgAdd = ({ isFilled, ...props }: SVGProps<SVGSVGElement> & { isFilled?: boolean }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='currentColor'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      fill='currentColor'
      d='M18 12.75H6c-.41 0-.75-.34-.75-.75s.34-.75.75-.75h12c.41 0 .75.34.75.75s-.34.75-.75.75'
    />
    <path
      fill='currentColor'
      d='M12 18.75c-.41 0-.75-.34-.75-.75V6c0-.41.34-.75.75-.75s.75.34.75.75v12c0 .41-.34.75-.75.75'
    />
  </svg>
);
export default SvgAdd;
