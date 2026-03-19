import React, { useState } from 'react';
import { Button } from '../../shared/ui/button';
import { Icon } from '../../shared/ui/icons';
import { Tag, type TagType } from '../../shared/ui/tag';
import styles from './UserExchanges.module.scss';

interface Exchange {
  id: number;
  skillName: string;
  partnerName: string;
  partnerAvatar: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  dateStarted: string;
  dateEnded?: string;
  type: 'teaching' | 'learning';
}

export const UserExchanges = () => {
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const mockExchanges: Exchange[] = [
    {
      id: 1,
      skillName: 'Игра на гитаре',
      partnerName: 'Анна Петрова',
      partnerAvatar: 'https://i.pravatar.cc/150?img=5',
      status: 'active',
      dateStarted: '2024-03-15',
      type: 'teaching',
    },
    {
      id: 2,
      skillName: 'Фотография',
      partnerName: 'Иван Сидоров',
      partnerAvatar: 'https://i.pravatar.cc/150?img=6',
      status: 'pending',
      dateStarted: '2024-03-20',
      type: 'learning',
    },
    {
      id: 3,
      skillName: 'Английский язык',
      partnerName: 'Мария Иванова',
      partnerAvatar: 'https://i.pravatar.cc/150?img=7',
      status: 'completed',
      dateStarted: '2024-02-10',
      dateEnded: '2024-03-10',
      type: 'teaching',
    },
  ];

  const getStatusTagType = (status: Exchange['status']): TagType => {
    switch (status) {
      case 'active':
        return 'plus';
      case 'pending':
        return 'creation';
      case 'completed':
        return 'education';
      case 'cancelled':
        return 'health';
      default:
        return 'business';
    }
  };

  const getExchangeTypeTag = (type: Exchange['type']): TagType => {
    return type === 'teaching' ? 'home' : 'langs';
  };

  const getStatusText = (status: Exchange['status']): string => {
    switch (status) {
      case 'pending':
        return 'Ожидание';
      case 'active':
        return 'Активен';
      case 'completed':
        return 'Завершен';
      case 'cancelled':
        return 'Отменен';
    }
  };

  const getTypeText = (type: Exchange['type']): string => {
    return type === 'teaching' ? 'Я учу' : 'Я учусь';
  };

  const filteredExchanges = mockExchanges.filter((exchange) =>
    activeTab === 'active'
      ? ['active', 'pending'].includes(exchange.status)
      : ['completed', 'cancelled'].includes(exchange.status)
  );

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={styles.title}>Мои обмены</h2>

        <div className={styles.tabs}>
          <Button
            variant={activeTab === 'active' ? 'primary' : 'tertiary'}
            onClick={() => setActiveTab('active')}
          >
            Активные ({mockExchanges.filter((e) => ['active', 'pending'].includes(e.status)).length}
            )
          </Button>
          <Button
            variant={activeTab === 'history' ? 'primary' : 'tertiary'}
            onClick={() => setActiveTab('history')}
          >
            История
          </Button>
        </div>
      </header>

      {filteredExchanges.length === 0 ? (
        <div className={styles.emptyState}>
          <Icon name='messageText' />
          <h3>Пока нет обменов</h3>
          <p>Начните учиться или учить других, чтобы здесь появились активные обмены</p>
          <Button variant='primary' size='full'>
            Найти обмен
          </Button>
        </div>
      ) : (
        <div className={styles.exchangesList}>
          {filteredExchanges.map((exchange) => (
            <div key={exchange.id} className={styles.exchangeCard}>
              <div className={styles.exchangeHeader}>
                <div className={styles.userInfo}>
                  <img
                    src={exchange.partnerAvatar}
                    alt={exchange.partnerName}
                    className={styles.avatar}
                  />
                  <div>
                    <h4 className={styles.partnerName}>{exchange.partnerName}</h4>
                    <span className={styles.skillName}>{exchange.skillName}</span>
                  </div>
                </div>

                <div className={styles.exchangeMeta}>
                  <Tag type={getStatusTagType(exchange.status)}>
                    {getStatusText(exchange.status)}
                  </Tag>
                  <Tag type={getExchangeTypeTag(exchange.type)}>{getTypeText(exchange.type)}</Tag>
                </div>
              </div>

              <div className={styles.exchangeContent}>
                <div className={styles.dates}>
                  <span>Начало: {new Date(exchange.dateStarted).toLocaleDateString('ru-RU')}</span>
                  {/* Проверяем наличие dateEnded перед отображением */}
                  {exchange.dateEnded && (
                    <span>
                      Завершение: {new Date(exchange.dateEnded).toLocaleDateString('ru-RU')}
                    </span>
                  )}
                </div>

                <div className={styles.actions}>
                  {exchange.status === 'pending' && (
                    <>
                      <Button variant='primary'>Принять</Button>
                      <Button variant='tertiary'>Отклонить</Button>
                    </>
                  )}
                  {exchange.status === 'active' && (
                    <Button variant='primary'>
                      <Icon name='messageText' />
                      Написать сообщение
                    </Button>
                  )}
                  {exchange.status === 'completed' && (
                    <Button variant='tertiary'>Оставить отзыв</Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserExchanges;
