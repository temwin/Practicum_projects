import type { SVGProps } from 'react';
const SvgChevronDown = ({
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
      d='M12 15.935c-.646 0-1.292-.249-1.781-.738L4.2 9.179a.696.696 0 0 1 0-.978.696.696 0 0 1 .978 0l6.018 6.018a1.136 1.136 0 0 0 1.606 0L18.821 8.2a.696.696 0 0 1 .978 0 .696.696 0 0 1 0 .978l-6.018 6.018c-.489.49-1.135.738-1.781.738'
    />
  </svg>
);
export default SvgChevronDown;
