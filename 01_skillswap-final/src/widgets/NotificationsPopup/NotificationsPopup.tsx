import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useNavigate } from 'react-router-dom';

import styles from './NotificationsPopup.module.scss';

import { useAppDispatch, useAppSelector } from '../../app/providers/store';
import { selectCurrentUser } from '../../entities/user/model/selectors';
import { selectAllUsers } from '../../entities/user/model';
import { Text } from '../../shared/ui/text';

import {
  clearReadForUser,
  hydrateNotifications,
  markAllReadForUser,
  markRead,
  selectNotificationsByUser,
} from '../../features/notifications';

import NotificationCenter from '../../shared/ui/notification/NotificationCenter';
import type { IconName } from '../../shared/ui/icons';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  anchorRect?: DOMRect | null;
};

type Pos = { top: number; left: number };

const GAP = 20;
const VIEWPORT_PAD = 16;

const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

const NotificationsPopup: React.FC<Props> = ({ isOpen, onClose, anchorRect }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const currentUser = useAppSelector(selectCurrentUser);
  const users = useAppSelector(selectAllUsers);

  const popupRef = useRef<HTMLDivElement | null>(null);
  const [pos, setPos] = useState<Pos>({ top: 110, left: 16 });

  useEffect(() => {
    if (!isOpen) return;
    dispatch(hydrateNotifications());
  }, [dispatch, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', onEsc);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const list = useAppSelector(
    currentUser?.id ? selectNotificationsByUser(currentUser.id) : () => []
  );

  const { unread, read } = useMemo(() => {
    return {
      unread: list.filter((n) => !n.isRead),
      read: list.filter((n) => n.isRead),
    };
  }, [list]);

  const getUserName = (id: number) => users.find((u) => u.id === id)?.name ?? `User#${id}`;

  const iconFor = (type: string): IconName => {
    switch (type) {
      case 'exchange_done':
      case 'exchange_accepted':
        return 'checkboxDone';
      case 'exchange_rejected':
      case 'exchange_canceled':
        return 'checkboxRemove';
      default:
        return 'messageText';
    }
  };

  const textFor = (n: (typeof list)[number]) => {
    const actor = getUserName(n.actorUserId);

    switch (n.type) {
      case 'exchange_proposed':
        return `${actor} предлагает вам обмен`;
      case 'exchange_accepted':
        return `${actor} принял ваш обмен`;
      case 'exchange_rejected':
        return `${actor} отклонил ваш обмен`;
      case 'exchange_done':
        return `${actor} завершил обмен`;
      case 'exchange_canceled':
        return `${actor} отменил заявку`;
      default:
        return actor;
    }
  };

  const onGoTo = (id: string) => {
    dispatch(markRead({ id }));
    onClose();
    navigate('/profile/requests');
  };

  const onReadAll = () => {
    if (!currentUser) return;
    dispatch(markAllReadForUser({ userId: currentUser.id }));
  };

  const onClearRead = () => {
    if (!currentUser) return;
    dispatch(clearReadForUser({ userId: currentUser.id }));
  };

  useLayoutEffect(() => {
    if (!isOpen || !anchorRect) return;

    const raf = requestAnimationFrame(() => {
      const el = popupRef.current;
      if (!el) return;

      const popupW = el.offsetWidth || 556;
      const popupH = el.offsetHeight || 400;

      const left = Math.round(anchorRect.right - popupW);
      const top = Math.round(anchorRect.bottom + GAP);

      const maxLeft = window.innerWidth - popupW - VIEWPORT_PAD;
      const maxTop = window.innerHeight - popupH - VIEWPORT_PAD;

      setPos({
        left: clamp(left, VIEWPORT_PAD, maxLeft),
        top: clamp(top, VIEWPORT_PAD, maxTop),
      });
    });

    return () => cancelAnimationFrame(raf);
  }, [isOpen, anchorRect, unread.length, read.length]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) return null;

  const unreadUi = unread.map((n) => ({
    id: n.id,
    icon: iconFor(n.type),
    text: textFor(n),
    onGoTo: () => onGoTo(n.id),
  }));

  const readUi = read.map((n) => ({
    id: n.id,
    icon: iconFor(n.type),
    text: textFor(n),
    onGoTo: () => onGoTo(n.id),
  }));

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div
        ref={popupRef}
        className={styles.popup}
        style={{ top: pos.top, left: pos.left }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className={styles.newWrapper}>
          <div className={styles.sectionHeader}>
            <Text variant='h2'>Новые уведомления</Text>
            <button
              onClick={onReadAll}
              className={styles.sectionAction}
              disabled={unreadUi.length === 0}
            >
              <Text variant='h4'>Прочитать все</Text>
            </button>
          </div>

          {unreadUi.length === 0 ? (
            <div className={styles.empty}>Нет новых уведомлений</div>
          ) : (
            <NotificationCenter notifications={unreadUi} dismissible={false} variant='inline' />
          )}
        </div>
        <div className={styles.readWrapper}>
          <div className={styles.sectionHeader}>
            <Text variant='h2'>Просмотренные</Text>

            <button
              type='button'
              className={styles.sectionAction}
              onClick={onClearRead}
              disabled={readUi.length === 0}
            >
              <Text variant='h4'>Очистить</Text>
            </button>
          </div>

          {readUi.length === 0 ? (
            <div className={styles.empty}>Пока нет просмотренных</div>
          ) : (
            <NotificationCenter notifications={readUi} dismissible={false} variant='inline' />
          )}
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default NotificationsPopup;
