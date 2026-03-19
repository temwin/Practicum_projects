import type { SVGProps } from 'react';
const SvgLike = ({ isFilled, ...props }: SVGProps<SVGSVGElement> & { isFilled?: boolean }) => (
  <svg xmlns='http://www.w3.org/2000/svg' width='1em' height='1em' viewBox='0 0 24 24' {...props}>
    <path
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1}
      d='M7.95 4C5.216 4 3 6.152 3 8.807 3 13.614 8.85 17.983 12 19c3.15-1.017 9-5.386 9-10.193C21 6.152 18.784 4 16.05 4A4.99 4.99 0 0 0 12 6.042 4.99 4.99 0 0 0 7.95 4'
    />
  </svg>
);
export default SvgLike;
