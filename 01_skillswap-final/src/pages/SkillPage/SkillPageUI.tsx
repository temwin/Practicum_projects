import React from 'react';
import { Header } from '../../widgets/Header';
import { CardSkill } from '../../widgets/CardSkill/CardSkill';
import SkillDescription from '../../widgets/SkillDescription/SkillDescription';
import UsersList from '../../widgets/UsersList/UsersList';
import Footer from '../../widgets/Footer/Footer';
import type { Skill } from '../../api/types';
import styles from './SkillPage.module.scss';

import type { UserWithSkill } from '../SkillPage';

export interface SkillPageUIProps {
  skill: Skill | null;
  skillOwner: UserWithSkill | null;
  similarUsers: UserWithSkill[];
  isLoading: boolean;
  isLiked: boolean;
  requestSent: boolean;
  isAuth?: boolean;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  isOwner: boolean;
  error: boolean;

  onLikeSimilarUser?: (userId: number) => void;
  onLikeClick: (skillId: number) => void;
  onShareClick: (skillId: number) => void;
  onMoreDetailsClick: (skillId: number) => void;
  onMoreOptionsClick: (skillId: number) => void;
  onUserClick: (userId: number) => void;
}

export const SkillPageUI: React.FC<SkillPageUIProps> = ({
  skill,
  skillOwner,
  similarUsers,
  isLoading,
  isLiked,
  requestSent,
  isAuth = false,
  searchValue = '',
  onSearchChange,
  isOwner,
  error,

  onLikeSimilarUser,
  onLikeClick,
  onShareClick,
  onMoreDetailsClick,
  onMoreOptionsClick,
  onUserClick,
}) => {
  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error || !skill || !skillOwner) {
    return <div className={styles.error}>Навык не найден</div>;
  }

  return (
    <div className={styles.page}>
      <Header isAuth={isAuth} searchValue={searchValue} onSearchChange={onSearchChange} />

      <main className={styles.mainContent}>
        <div className={styles.skillSection}>
          <div className={styles.userCardContainer}>
            <CardSkill
              key={skillOwner?.avatarUrl}
              userId={skillOwner.id}
              user={{
                ...skillOwner,
                location: skillOwner.location,
              }}
              variant='detailed'
            />
          </div>

          <div className={styles.skillDescriptionContainer}>
            <SkillDescription
              skill={{
                ...skill,
                category: 'Творчество и искусство',
                subcategory: 'Музыка и звук',
                userId: skillOwner.id,
                images: skillOwner.images,
              }}
              isLiked={isLiked}
              onLike={isOwner ? () => {} : onLikeClick}
              onShare={onShareClick}
              onMoreDetails={onMoreDetailsClick}
              onMoreOptions={onMoreOptionsClick}
              isOwner={isOwner}
              requestSent={requestSent}
            />
          </div>
        </div>

        <div className={styles.similarSection}>
          <UsersList
            title='Похожие предложения'
            mode='likes'
            users={similarUsers.map((user) => ({
              id: user.id,
              avatarUrl: user.avatarUrl,
              name: user.name,
              location:
                typeof user.location === 'string' ? { id: 0, name: user.location } : user.location,
              dateOfBirth: user.dateOfBirth,
              gender: user.gender,
              about: user.about,
              greeting: user.greeting || user.about,
              skillCanTeach: user.skillCanTeach as Skill,
              subcategoriesWantToLearn: (user.subcategoriesWantToLearn ?? []).map((subcat) => ({
                id: subcat.id,
                name: subcat.name,
              })),
            }))}
            onUserClick={onUserClick}
            onLikeClick={onLikeSimilarUser}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
};
