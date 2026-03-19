import type { SVGProps } from 'react';
const SvgRadiobuttonActive = ({
  isFilled,
  ...props
}: SVGProps<SVGSVGElement> & { isFilled?: boolean }) => (
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
      d='M12 22C6.484 22 2 17.516 2 12S6.484 2 12 2s10 4.484 10 10-4.484 10-10 10m0-18.605c-4.744 0-8.605 3.86-8.605 8.605 0 4.744 3.86 8.605 8.605 8.605 4.744 0 8.605-3.86 8.605-8.605 0-4.744-3.86-8.605-8.605-8.605'
    />
    <circle cx={12} cy={12} r={5} fill='currentColor' />
  </svg>
);
export default SvgRadiobuttonActive;
