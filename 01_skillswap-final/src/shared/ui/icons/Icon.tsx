import React from 'react';
import type { SVGProps } from 'react';

import AddIcon from './svg/Add';
import ArrowSquareLeftIcon from './svg/ArrowSquareLeft';
import ArrowSquareRightIcon from './svg/ArrowSquareRight';
import BookIcon from './svg/Book';
import BriefcaseIcon from './svg/Briefcase';
import CalendarIcon from './svg/Calendar';
import CheckboxDoneIcon from './svg/CheckboxDone';
import CheckboxEmptyIcon from './svg/CheckboxEmpty';
import CheckboxRemoveIcon from './svg/CheckboxRemove';
import ChevronDownIcon from './svg/ChevronDown';
import ChevronRightIcon from './svg/ChevronRight';
import ChevronUpIcon from './svg/ChevronUp';
import ClockIcon from './svg/Clock';
import CountIcon from './svg/Count';
import CrossIcon from './svg/Cross';
import DoneIcon from './svg/Done';
import EditIcon from './svg/Edit';
import EyeIcon from './svg/Eye';
import EyeSlashIcon from './svg/EyeSlash';
import FilterSquareIcon from './svg/FilterSquare';
import GalleryAddIcon from './svg/GalleryAdd';
import GalleryEditIcon from './svg/GalleryEdit';
import GlobalIcon from './svg/Global';
import HomeIcon from './svg/Home';
import IdeaIcon from './svg/Idea';
import LikeIcon from './svg/Like';
import LifestyleIcon from './svg/Lifestyle';
import LogoutIcon from './svg/Logout';
import MessageTextIcon from './svg/MessageText';
import MoonIcon from './svg/Moon';
import MoreSquareIcon from './svg/MoreSquare';
import NotificationIcon from './svg/Notification';
import PaletteIcon from './svg/Palette';
import PlusCircleIcon from './svg/PlusCircle';
import RadiobuttonActiveIcon from './svg/RadiobuttonActive';
import RadiobuttonEmptyIcon from './svg/RadiobuttonEmpty';
import RequestIcon from './svg/Request';
import ScrollIcon from './svg/Scroll';
import ScrollOneIcon from './svg/Scroll1';
import SearchIcon from './svg/Search';
import ShareIcon from './svg/Share';
import SortIcon from './svg/Sort';
import SunIcon from './svg/Sun';
import UserIcon from './svg/User';
import UserCircleIcon from './svg/UserCircle';

const iconMap = {
  add: AddIcon,
  arrowSquareLeft: ArrowSquareLeftIcon,
  arrowSquareRight: ArrowSquareRightIcon,
  book: BookIcon,
  briefcase: BriefcaseIcon,
  calendar: CalendarIcon,
  checkboxDone: CheckboxDoneIcon,
  checkboxEmpty: CheckboxEmptyIcon,
  checkboxRemove: CheckboxRemoveIcon,
  chevronDown: ChevronDownIcon,
  chevronRight: ChevronRightIcon,
  chevronUp: ChevronUpIcon,
  clock: ClockIcon,
  count: CountIcon,
  cross: CrossIcon,
  done: DoneIcon,
  edit: EditIcon,
  eye: EyeIcon,
  eyeSlash: EyeSlashIcon,
  filterSquare: FilterSquareIcon,
  galleryAdd: GalleryAddIcon,
  galleryEdit: GalleryEditIcon,
  global: GlobalIcon,
  home: HomeIcon,
  idea: IdeaIcon,
  like: LikeIcon,
  lifestyle: LifestyleIcon,
  logout: LogoutIcon,
  messageText: MessageTextIcon,
  moon: MoonIcon,
  moreSquare: MoreSquareIcon,
  notification: NotificationIcon,
  palette: PaletteIcon,
  plusCircle: PlusCircleIcon,
  radiobuttonActive: RadiobuttonActiveIcon,
  radiobuttonEmpty: RadiobuttonEmptyIcon,
  request: RequestIcon,
  scroll: ScrollIcon,
  scrollOne: ScrollOneIcon,
  search: SearchIcon,
  share: ShareIcon,
  sort: SortIcon,
  sun: SunIcon,
  user: UserIcon,
  userCircle: UserCircleIcon,
};

export type IconName = keyof typeof iconMap;

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  className?: string;
  isFilled?: boolean;
}

const Icon: React.FC<IconProps> = ({ name, className, isFilled, ...props }) => {
  const IconComponent = iconMap[name];

  return (
    <IconComponent
      {...props}
      isFilled={isFilled}
      className={className}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        width: '1.5rem',
        height: '1.5rem',
        flexShrink: 0,
        ...props.style,
      }}
    />
  );
};

export { Icon };
export default Icon;
