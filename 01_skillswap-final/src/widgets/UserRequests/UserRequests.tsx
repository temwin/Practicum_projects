import React, { useMemo, useState } from 'react';
import styles from './UserRequests.module.css';
import { useAppDispatch, useAppSelector } from '../../app/providers/store';
import { selectCurrentUser } from '../../entities/user/model/selectors';
import { selectAllUsers } from '../../entities/user/model';
import { selectSkills } from '../../entities/skills/model';
import {
  hydrateRequests,
  selectAllRequests,
  updateRequestStatusAndNotify,
  deleteRequestAndNotify,
} from '../../features/requests';
import type { RequestStatus, ExchangeRequest } from '../../api/types';

type Tab = 'inbox' | 'outbox';
type StatusFilter = 'all' | RequestStatus;

const statusLabel: Record<RequestStatus, string> = {
  pending: 'Ожидает',
  accepted: 'Принята',
  rejected: 'Отклонена',
  inProgress: 'В процессе',
  done: 'Завершена',
};

const UserRequests = () => {
  const dispatch = useAppDispatch();

  const currentUser = useAppSelector(selectCurrentUser);
  const allRequests = useAppSelector(selectAllRequests);

  const users = useAppSelector(selectAllUsers);
  const skills = useAppSelector(selectSkills);

  const [tab, setTab] = useState<Tab>('inbox');
  const [status, setStatus] = useState<StatusFilter>('all');

  React.useEffect(() => {
    dispatch(hydrateRequests());
  }, [dispatch]);

  const currentUserId = currentUser?.id ?? -1;

  const inbox = useMemo(
    () => allRequests.filter((r) => r.toUserId === currentUserId),
    [allRequests, currentUserId]
  );
  const outbox = useMemo(
    () => allRequests.filter((r) => r.fromUserId === currentUserId),
    [allRequests, currentUserId]
  );

  const baseList = tab === 'inbox' ? inbox : outbox;

  const filtered = useMemo(() => {
    if (status === 'all') return baseList;
    return baseList.filter((r) => r.status === status);
  }, [baseList, status]);

  const getUserName = (id: number) => users.find((u) => u.id === id)?.name ?? `User#${id}`;
  const getSkillName = (skillId: number) => {
    const fromUsers = users.find((u) => u.skillCanTeach?.id === skillId)?.skillCanTeach?.name;

    if (fromUsers) return fromUsers;

    return skills.find((s) => s.id === skillId)?.name ?? `Skill#${skillId}`;
  };

  const onAccept = (id: string) =>
    dispatch(updateRequestStatusAndNotify({ id, status: 'accepted' }));
  const onReject = (id: string) =>
    dispatch(updateRequestStatusAndNotify({ id, status: 'rejected' }));
  const onStart = (id: string) =>
    dispatch(updateRequestStatusAndNotify({ id, status: 'inProgress' }));
  const onDone = (id: string) => dispatch(updateRequestStatusAndNotify({ id, status: 'done' }));
  const onCancelOutbox = (id: string) => dispatch(deleteRequestAndNotify({ id }));

  const renderActions = (r: ExchangeRequest) => {
    if (tab === 'inbox') {
      if (r.status === 'pending') {
        return (
          <>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onAccept(r.id)}>
              Принять
            </button>
            <button className={`${styles.btn} ${styles.btnDanger}`} onClick={() => onReject(r.id)}>
              Отклонить
            </button>
          </>
        );
      }

      if (r.status === 'accepted') {
        return (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onStart(r.id)}>
            Начать обмен
          </button>
        );
      }

      if (r.status === 'inProgress') {
        return (
          <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => onDone(r.id)}>
            Завершить
          </button>
        );
      }

      return null;
    }

    if (r.status === 'pending') {
      return (
        <button
          className={`${styles.btn} ${styles.btnDanger}`}
          onClick={() => onCancelOutbox(r.id)}
        >
          Отменить
        </button>
      );
    }

    return null;
  };

  if (!currentUser) {
    return (
      <div className={styles.container}>
        <div className={styles.empty}>Нужно авторизоваться, чтобы видеть заявки.</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>Заявки</h3>

        <div className={styles.controls}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${tab === 'inbox' ? styles.tabActive : ''}`}
              onClick={() => setTab('inbox')}
              type='button'
            >
              Входящие ({inbox.length})
            </button>

            <button
              className={`${styles.tab} ${tab === 'outbox' ? styles.tabActive : ''}`}
              onClick={() => setTab('outbox')}
              type='button'
            >
              Исходящие ({outbox.length})
            </button>
          </div>

          <select
            className={styles.select}
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
          >
            <option value='all'>Все статусы</option>
            <option value='pending'>Ожидает</option>
            <option value='accepted'>Принята</option>
            <option value='rejected'>Отклонена</option>
            <option value='inProgress'>В процессе</option>
            <option value='done'>Завершена</option>
          </select>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          Пока нет заявок.
          <div className={styles.smallHint}>
            Создай заявку на странице навыка через «Предложить обмен».
          </div>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((r) => {
            const fromName = getUserName(r.fromUserId);
            const toName = getUserName(r.toUserId);
            const skillName = getSkillName(r.skillId);

            const created = new Date(r.createdAt).toLocaleString();
            const updated = new Date(r.updatedAt).toLocaleString();

            return (
              <div className={styles.card} key={r.id}>
                <div className={styles.cardLeft}>
                  <div className={styles.cardTop}>
                    <span className={styles.badge}>{statusLabel[r.status]}</span>
                    <span className={styles.meta}>
                      <span>Создано: {created}</span>
                      <span>·</span>
                      <span>Обновлено: {updated}</span>
                    </span>
                  </div>

                  <div className={styles.skillName}>{skillName}</div>

                  <div className={styles.usersLine}>
                    {tab === 'inbox' ? (
                      <>
                        От: <b>{fromName}</b> → Кому: <b>{toName}</b>
                      </>
                    ) : (
                      <>
                        Ты: <b>{fromName}</b> → Кому: <b>{toName}</b>
                      </>
                    )}
                  </div>
                </div>

                <div className={styles.cardRight}>{renderActions(r)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UserRequests;
