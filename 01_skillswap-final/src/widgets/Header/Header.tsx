import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Logo } from '../../shared/ui/logo';
import { NavMenu } from '../../shared/ui/nav-menu';
import { GlobalSearch } from '../../shared/ui/search/GlobalSearch';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icons';
import styles from './Header.module.scss';
import Avatar from '../../shared/ui/avatar/Avatar';
import avatarPlaceholder from '/src/shared/assets/user-circle.png';
import { useAppDispatch, useAppSelector } from '../../app/providers/store';
import { logout } from '../../features/auth';
import { selectCurrentUser } from '../../entities/user/model/selectors';
import { selectCurrentUserId } from '../../features/auth/selectors';
import { selectUnreadCountByUser } from '../../features/notifications';
import NotificationsPopup from '../NotificationsPopup/NotificationsPopup';
import { useState, useEffect } from 'react';
import { useGlobalSearch } from '../../shared/lib/hooks/useGlobalSearch';

export interface HeaderProps {
  isAuth?: boolean;
  showSearch?: boolean;
  showMenu?: boolean;
  onSearchChange?: (value: string) => void;
  searchValue?: string;
  notificationsCount?: number;
  onLogout?: () => void;
  pushToLeft?: boolean;
  compactActions?: boolean;
  onCompactActionClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  isAuth = false,
  showSearch = true,
  showMenu = true,
  onSearchChange: propOnSearchChange,
  searchValue: propSearchValue,
  pushToLeft = true,
  compactActions = false,
  onCompactActionClick,
}) => {
  const { searchValue, handleSearchChange } = useGlobalSearch();
  const user = useAppSelector(selectCurrentUser);

  const avatarSrc = isAuth && user?.avatarUrl ? user.avatarUrl : avatarPlaceholder;
  const userName = user?.name ?? 'Профиль';
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const [isNotifOpen, setIsNotifOpen] = React.useState(false);
  const [anchorRect, setAnchorRect] = React.useState<DOMRect | undefined>(undefined);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUserId = useAppSelector(selectCurrentUserId);
  const unreadCount = useAppSelector(
    currentUserId ? selectUnreadCountByUser(currentUserId) : () => 0
  );

  const handleSearchEnter = (value: string) => {
    if (value.trim() && window.location.pathname !== '/') {
      // Если не на главной странице, переходим на главную с поиском
      navigate(`/?q=${encodeURIComponent(value.trim())}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setIsMenuOpen(false);
    setIsNotifOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);

  const toggleNotifications = () => {
    const rect = document.getElementById('profileWrapper')?.getBoundingClientRect();
    setAnchorRect(rect);
    setIsNotifOpen((prev) => !prev);
    setIsMenuOpen(false);
  };

  const getInitialTheme = (): 'light' | 'dark' => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') {
      return saved;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme());

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <header className={styles.header}>
      <div className={`${styles.container} ${!pushToLeft ? styles.isWide : ''}`}>
        <div className={styles.logo}>
          <Logo />
        </div>

        {showMenu && (
          <div className={styles.nav}>
            <NavMenu />
          </div>
        )}

        {showSearch && (
          <div className={styles.search}>
            <GlobalSearch
              value={propSearchValue !== undefined ? propSearchValue : searchValue}
              onChange={propOnSearchChange || handleSearchChange}
              onEnter={handleSearchEnter}
              placeholder='Искать навык'
            />
          </div>
        )}

        <div className={styles.actions}>
          {compactActions ? (
            <Button variant='tertiary' onClick={onCompactActionClick} hasIcon iconName='cross'>
              Закрыть
            </Button>
          ) : !isAuth ? (
            <>
              <div className={styles.iconGroup}>
                <button
                  type='button'
                  onClick={toggleTheme}
                  aria-label={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Icon name={theme === 'light' ? 'moon' : 'sun'} className={styles.icon} />
                </button>
              </div>
              <div className={styles.buttonGroup}>
                <Link to='/login'>
                  <Button variant='secondary'>Войти</Button>
                </Link>
                <Link to='/register'>
                  <Button variant='primary'>Зарегистрироваться</Button>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className={styles.iconGroup}>
                <button
                  type='button'
                  onClick={toggleTheme}
                  aria-label={`Переключить на ${theme === 'light' ? 'тёмную' : 'светлую'} тему`}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  <Icon name={theme === 'light' ? 'moon' : 'sun'} className={styles.icon} />
                </button>
                <button
                  type='button'
                  className={styles.iconButton}
                  aria-label='Уведомления'
                  onClick={toggleNotifications}
                >
                  <span className={styles.notificationWrapper}>
                    <Icon name='notification' className={styles.icon} />
                    {unreadCount > 0 && <span className={styles.notificationDot} />}
                  </span>
                </button>
                <Icon name='like' className={styles.icon} />
              </div>

              <div
                onClick={toggleMenu}
                className={styles.profileWrapper}
                aria-expanded={isMenuOpen}
                aria-haspopup='true'
                id='profileWrapper'
              >
                <span className={styles.profileText}>{`${userName}`}</span>
                <Avatar
                  key={user?.avatarUrl || 'default'}
                  src={avatarSrc}
                  fallbackSrc={avatarPlaceholder}
                  alt={`Аватар ${userName}`}
                  className={styles.avatar}
                />

                {isMenuOpen && (
                  <div className={styles.dropdownMenu}>
                    <Link
                      to='/profile'
                      className={styles.dropdownItem}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      Личный кабинет
                    </Link>
                    <div className={styles.dropdownItem} onClick={handleLogout}>
                      Выйти из аккаунта
                      <Icon name='logout' className={styles.logoutIcon} />
                    </div>
                  </div>
                )}
              </div>

              <NotificationsPopup
                isOpen={isNotifOpen}
                onClose={() => setIsNotifOpen(false)}
                anchorRect={anchorRect}
              />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export { Header };
export default Header;
