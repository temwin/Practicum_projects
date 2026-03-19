import type { SVGProps } from 'react';

const SvgDone = ({ isFilled, ...props }: SVGProps<SVGSVGElement> & { isFilled?: boolean }) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    fill='none'
    viewBox='0 0 24 24'
    {...props}
  >
    <path stroke='currentColor' strokeWidth={1.5} d='M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z' />
    <path
      stroke='currentColor'
      strokeLinecap='round'
      strokeWidth={1.5}
      d='m8.844 12.202 1.562 1.561a1.17 1.17 0 0 0 1.652 0l3.467-3.466'
    />
  </svg>
);
export default SvgDone;
