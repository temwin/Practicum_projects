import type { RootState } from '../../../app/providers/store';
import type { Skill } from '../../../api/types';

export const selectSkills = (state: RootState): Skill[] => state.skills.skills;

export const selectSkillById =
  (id: number) =>
  (state: RootState): Skill | undefined =>
    state.skills.skills.find((skill) => skill.id === id);

export const selectSkillsLoading = (state: RootState): boolean => state.skills.isLoading;
export const selectSkillsError = (state: RootState): string | null => state.skills.error;
