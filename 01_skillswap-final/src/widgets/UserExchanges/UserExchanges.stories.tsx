import type { Meta, StoryObj } from '@storybook/react';
import UserExchanges from './UserExchanges';
import React from 'react';

const meta: Meta<typeof UserExchanges> = {
  title: 'Widgets/UserExchanges',
  component: UserExchanges,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof UserExchanges>;

// Основная история с демо данными
export const Default: Story = {
  name: 'Демо данные (активные + история)',
  render: () => (
    <div
      style={{ padding: '2rem', backgroundColor: 'var(--color-background)', minHeight: '100vh' }}
    >
      <UserExchanges />
    </div>
  ),
};

// История для пустого состояния
export const EmptyState: Story = {
  name: 'Пустое состояние (нет обменов)',
  render: () => {
    // Переопределяем компонент с пустыми данными
    const EmptyUserExchanges = () => {
      const [activeTab, setActiveTab] = React.useState<'active' | 'history'>('active');

      return (
        <div
          style={{
            padding: '2rem',
            backgroundColor: 'var(--color-background)',
            minHeight: '100vh',
            maxWidth: '800px',
            margin: '0 auto',
          }}
        >
          <div
            style={{
              width: '100%',
              padding: '2rem',
              background: 'var(--color-card)',
              borderRadius: '1.5rem',
            }}
          >
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                Мои обмены
              </h2>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  background: 'var(--color-disabled)',
                  padding: '0.25rem',
                  borderRadius: '0.75rem',
                }}
              >
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: activeTab === 'active' ? 'var(--color-accent)' : 'transparent',
                    color: activeTab === 'active' ? 'var(--color-text)' : 'var(--color-caption)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab('active')}
                >
                  Активные (0)
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: activeTab === 'history' ? 'var(--color-accent)' : 'transparent',
                    color: activeTab === 'history' ? 'var(--color-text)' : 'var(--color-caption)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab('history')}
                >
                  История
                </button>
              </div>
            </header>

            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: 'var(--color-caption)',
              }}
            >
              <div
                style={{
                  fontSize: '48px',
                  marginBottom: '1rem',
                  color: 'var(--color-caption)',
                }}
              ></div>
              <h3
                style={{
                  margin: '1rem 0 0.5rem',
                  color: 'var(--color-text)',
                  fontSize: '1.5rem',
                }}
              >
                Пока нет обменов
              </h3>
              <p
                style={{
                  margin: '0 auto 1.5rem',
                  maxWidth: '400px',
                  lineHeight: 1.5,
                }}
              >
                Начните учиться или учить других, чтобы здесь появились активные обмены
              </p>
              <button
                style={{
                  padding: '0.75rem 1.5rem',
                  background: 'var(--color-accent)',
                  color: 'var(--color-text)',
                  border: 'none',
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  width: '100%',
                  maxWidth: '200px',
                }}
              >
                Найти обмен
              </button>
            </div>
          </div>
        </div>
      );
    };

    return <EmptyUserExchanges />;
  },
};

// Определяем типы для данных обменов
type ExchangeType = 'teaching' | 'learning';
type ExchangeStatus = 'active' | 'pending' | 'completed' | 'cancelled';

interface BaseExchange {
  id: number;
  skillName: string;
  partnerName: string;
  partnerAvatar: string;
  dateStarted: string;
  type: ExchangeType;
}

interface ActiveExchange extends BaseExchange {
  status: 'active' | 'pending';
}

interface CompletedExchange extends BaseExchange {
  status: 'completed' | 'cancelled';
  dateEnded: string;
}

type Exchange = ActiveExchange | CompletedExchange;

// История с большим количеством данных
export const ManyExchanges: Story = {
  name: 'Много обменов (активные + завершенные)',
  render: () => {
    const ManyExchangesComponent = () => {
      const [activeTab, setActiveTab] = React.useState<'active' | 'history'>('active');

      // Моковые данные для активных обменов (5 штук)
      const activeExchanges: ActiveExchange[] = [
        {
          id: 1,
          skillName: 'Игра на гитаре',
          partnerName: 'Анна Петрова',
          partnerAvatar: 'https://i.pravatar.cc/150?img=1',
          status: 'active',
          dateStarted: '2024-03-15',
          type: 'teaching',
        },
        {
          id: 2,
          skillName: 'Фотография',
          partnerName: 'Иван Сидоров',
          partnerAvatar: 'https://i.pravatar.cc/150?img=2',
          status: 'pending',
          dateStarted: '2024-03-18',
          type: 'learning',
        },
        {
          id: 3,
          skillName: 'Английский язык',
          partnerName: 'Мария Иванова',
          partnerAvatar: 'https://i.pravatar.cc/150?img=3',
          status: 'active',
          dateStarted: '2024-03-10',
          type: 'teaching',
        },
        {
          id: 4,
          skillName: 'Кулинария',
          partnerName: 'Алексей Кузнецов',
          partnerAvatar: 'https://i.pravatar.cc/150?img=4',
          status: 'pending',
          dateStarted: '2024-03-20',
          type: 'learning',
        },
        {
          id: 5,
          skillName: 'Фронтенд разработка',
          partnerName: 'Дмитрий Смирнов',
          partnerAvatar: 'https://i.pravatar.cc/150?img=5',
          status: 'active',
          dateStarted: '2024-03-05',
          type: 'teaching',
        },
      ];

      // Моковые данные для завершенных обменов (5 штук)
      const completedExchanges: CompletedExchange[] = [
        {
          id: 6,
          skillName: 'Йога и медитация',
          partnerName: 'Екатерина Волкова',
          partnerAvatar: 'https://i.pravatar.cc/150?img=6',
          status: 'completed',
          dateStarted: '2024-02-01',
          dateEnded: '2024-03-01',
          type: 'teaching',
        },
        {
          id: 7,
          skillName: 'Графический дизайн',
          partnerName: 'Сергей Попов',
          partnerAvatar: 'https://i.pravatar.cc/150?img=7',
          status: 'completed',
          dateStarted: '2024-01-15',
          dateEnded: '2024-02-28',
          type: 'learning',
        },
        {
          id: 8,
          skillName: 'Испанский язык',
          partnerName: 'Ольга Соколова',
          partnerAvatar: 'https://i.pravatar.cc/150?img=8',
          status: 'completed',
          dateStarted: '2024-01-10',
          dateEnded: '2024-02-25',
          type: 'teaching',
        },
        {
          id: 9,
          skillName: 'Создание сайтов',
          partnerName: 'Павел Лебедев',
          partnerAvatar: 'https://i.pravatar.cc/150?img=9',
          status: 'cancelled',
          dateStarted: '2024-02-20',
          dateEnded: '2024-03-01',
          type: 'learning',
        },
        {
          id: 10,
          skillName: 'Финансовая грамотность',
          partnerName: 'Наталья Козлова',
          partnerAvatar: 'https://i.pravatar.cc/150?img=10',
          status: 'completed',
          dateStarted: '2024-01-05',
          dateEnded: '2024-02-15',
          type: 'teaching',
        },
      ];

      const allExchanges: Exchange[] = [...activeExchanges, ...completedExchanges];

      const getStatusColor = (status: ExchangeStatus) => {
        switch (status) {
          case 'active':
            return '#d4edda';
          case 'pending':
            return '#fff3cd';
          case 'completed':
            return '#e2e3e5';
          case 'cancelled':
            return '#f8d7da';
          default:
            return '#f0f0f0';
        }
      };

      const getStatusTextColor = (status: ExchangeStatus) => {
        switch (status) {
          case 'active':
            return '#155724';
          case 'pending':
            return '#856404';
          case 'completed':
            return '#383d41';
          case 'cancelled':
            return '#721c24';
          default:
            return '#333';
        }
      };

      const getStatusText = (status: ExchangeStatus) => {
        switch (status) {
          case 'pending':
            return 'Ожидание';
          case 'active':
            return 'Активен';
          case 'completed':
            return 'Завершен';
          case 'cancelled':
            return 'Отменен';
          default:
            return '';
        }
      };

      const filteredExchanges = allExchanges.filter((exchange) =>
        activeTab === 'active'
          ? ['active', 'pending'].includes(exchange.status)
          : ['completed', 'cancelled'].includes(exchange.status)
      );

      // Функция для безопасной проверки наличия свойства dateEnded
      const isCompletedExchange = (exchange: Exchange): exchange is CompletedExchange => {
        return 'dateEnded' in exchange;
      };

      return (
        <div
          style={{
            padding: '2rem',
            backgroundColor: 'var(--color-background)',
            minHeight: '100vh',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '2rem',
              background: 'var(--color-card)',
              borderRadius: '1.5rem',
            }}
          >
            <header
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem',
              }}
            >
              <h2
                style={{
                  fontSize: '1.75rem',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  margin: 0,
                }}
              >
                Мои обмены
              </h2>

              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  background: 'var(--color-disabled)',
                  padding: '0.25rem',
                  borderRadius: '0.75rem',
                }}
              >
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: activeTab === 'active' ? 'var(--color-accent)' : 'transparent',
                    color: activeTab === 'active' ? 'var(--color-text)' : 'var(--color-caption)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab('active')}
                >
                  Активные ({activeExchanges.length})
                </button>
                <button
                  style={{
                    padding: '0.5rem 1rem',
                    border: 'none',
                    borderRadius: '0.5rem',
                    background: activeTab === 'history' ? 'var(--color-accent)' : 'transparent',
                    color: activeTab === 'history' ? 'var(--color-text)' : 'var(--color-caption)',
                    cursor: 'pointer',
                  }}
                  onClick={() => setActiveTab('history')}
                >
                  История ({completedExchanges.length})
                </button>
              </div>
            </header>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {filteredExchanges.map((exchange) => (
                <div
                  key={exchange.id}
                  style={{
                    background: 'var(--color-background)',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid var(--color-border)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '1rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <img
                        src={exchange.partnerAvatar}
                        alt={exchange.partnerName}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                      <div>
                        <h4 style={{ fontWeight: 600, margin: '0 0 0.25rem' }}>
                          {exchange.partnerName}
                        </h4>
                        <span style={{ fontSize: '0.875rem', color: 'var(--color-caption)' }}>
                          {exchange.skillName}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          background: getStatusColor(exchange.status),
                          color: getStatusTextColor(exchange.status),
                        }}
                      >
                        {getStatusText(exchange.status)}
                      </span>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '1rem',
                          fontSize: '0.75rem',
                          background: exchange.type === 'teaching' ? '#d1ecf1' : '#d4edda',
                          color: exchange.type === 'teaching' ? '#0c5460' : '#155724',
                        }}
                      >
                        {exchange.type === 'teaching' ? 'Я учу' : 'Я учусь'}
                      </span>
                    </div>
                  </div>

                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--color-border)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '0.875rem',
                        color: 'var(--color-caption)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem',
                      }}
                    >
                      <span>
                        Начало: {new Date(exchange.dateStarted).toLocaleDateString('ru-RU')}
                      </span>
                      {/* Проверяем наличие dateEnded с помощью type guard */}
                      {isCompletedExchange(exchange) && (
                        <span>
                          Завершение: {new Date(exchange.dateEnded).toLocaleDateString('ru-RU')}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {exchange.status === 'pending' && (
                        <>
                          <button
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'var(--color-accent)',
                              color: 'var(--color-text)',
                              border: 'none',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            Принять
                          </button>
                          <button
                            style={{
                              padding: '0.5rem 1rem',
                              background: 'transparent',
                              color: 'var(--color-caption)',
                              border: '1px solid var(--color-border)',
                              borderRadius: '0.5rem',
                              cursor: 'pointer',
                              fontSize: '0.875rem',
                            }}
                          >
                            Отклонить
                          </button>
                        </>
                      )}
                      {exchange.status === 'active' && (
                        <button
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'var(--color-accent)',
                            color: 'var(--color-text)',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                          }}
                        >
                          Написать сообщение
                        </button>
                      )}
                      {exchange.status === 'completed' && (
                        <button
                          style={{
                            padding: '0.5rem 1rem',
                            background: 'transparent',
                            color: 'var(--color-caption)',
                            border: '1px solid var(--color-border)',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.875rem',
                          }}
                        >
                          Оставить отзыв
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    };

    return <ManyExchangesComponent />;
  },
};
