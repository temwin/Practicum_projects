import { expect, test, describe, beforeEach } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import {
  skillReducer,
  selectSkills,
  selectSkillById,
  selectSkillsLoading,
  selectSkillsError,
} from '.';
import type { RootState } from '../../../app/providers/store';
import type { Skill } from '../../../api/types';

describe('тесты слайса skills', () => {
  let store: ReturnType<typeof configureStore>;
  const initialSkills: Skill[] = [
    {
      id: 1,
      subcategoryId: 7,
      name: 'Scrum в реальных проектах',
      description: 'Как адаптировать Scrum...',
    },
    {
      id: 2,
      subcategoryId: 1,
      name: 'Мотивация распределённых команд',
      description: 'Техника вовлечения...',
    },
  ];

  beforeEach(() => {
    store = configureStore({
      reducer: { skills: skillReducer },
      preloadedState: {
        skills: {
          skills: initialSkills,
          isLoading: false,
          error: null,
        },
      },
    });
  });

  test('начальное состояние', () => {
    const emptyStore = configureStore({
      reducer: { skills: skillReducer },
    });

    const state = emptyStore.getState() as RootState;
    expect(selectSkills(state)).toEqual([]);
    expect(selectSkillsLoading(state)).toBe(false);
    expect(selectSkillsError(state)).toBeNull();
  });

  test('получение всех навыков', () => {
    const state = store.getState() as RootState;
    expect(selectSkills(state)).toEqual(initialSkills);
  });

  test('получение навыка по id', () => {
    const state = store.getState() as RootState;
    const expectedSkill = initialSkills[1];
    expect(selectSkillById(2)(state)).toEqual(expectedSkill);
  });

  test('проверка навыка по несуществующему id', () => {
    const state = store.getState() as RootState;
    expect(selectSkillById(999)(state)).toBeUndefined();
  });

  test('проверка загрузки и ошибки', () => {
    const state = store.getState() as RootState;
    expect(selectSkillsLoading(state)).toBe(false);
    expect(selectSkillsError(state)).toBeNull();
  });
});
