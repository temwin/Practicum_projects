import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { Skill } from '../../../api/types';
import { getSkills } from '../../../api/';
import type { RootState } from '../../../app/providers/store';

interface SkillsState {
  skills: Skill[];
  customSkillIds: number[];
  nextCustomSkillId: number;
  isLoading: boolean;
  error: string | null;
}

const SKILLS_KEY = 'skills';
const CUSTOM_IDS_KEY = 'customSkillIds';
const NEXT_ID_KEY = 'nextCustomSkillId';

const loadSkills = (): Skill[] => {
  const raw = localStorage.getItem(SKILLS_KEY);
  return raw ? (JSON.parse(raw) as Skill[]) : [];
};

const saveSkills = (skills: Skill[]) => {
  localStorage.setItem(SKILLS_KEY, JSON.stringify(skills));
};

const loadCustomIds = (): number[] => {
  const raw = localStorage.getItem(CUSTOM_IDS_KEY);
  return raw ? (JSON.parse(raw) as number[]) : [];
};

const saveCustomIds = (ids: number[]) => {
  localStorage.setItem(CUSTOM_IDS_KEY, JSON.stringify(ids));
};

const loadNextId = (fallback: number): number => {
  const raw = localStorage.getItem(NEXT_ID_KEY);
  const n = raw ? Number(raw) : NaN;
  return Number.isFinite(n) && n > 0 ? n : fallback;
};

const saveNextId = (n: number) => {
  localStorage.setItem(NEXT_ID_KEY, String(n));
};

const initialState: SkillsState = {
  skills: loadSkills(),
  customSkillIds: loadCustomIds(),
  nextCustomSkillId: loadNextId(1000),
  isLoading: false,
  error: null,
};

export const fetchSkills = createAsyncThunk<Skill[]>('skills/fetchSkills', async () => {
  const data: Skill[] = await getSkills();
  return data;
});

export const selectSkillById = (id: number) => (state: RootState) =>
  state.skills.skills.find((skill) => skill.id === id);

const skillsSlice = createSlice({
  name: 'skills',
  initialState,
  reducers: {
    hydrateSkills: (state) => {
      state.skills = loadSkills();
      state.customSkillIds = loadCustomIds();
      state.nextCustomSkillId = loadNextId(state.nextCustomSkillId || 1000);
    },

    upsertSkill: (state, action: PayloadAction<{ skill: Skill; isCustom: boolean }>) => {
      const { skill, isCustom } = action.payload;

      const idx = state.skills.findIndex((s) => s.id === skill.id);
      if (idx >= 0) state.skills[idx] = skill;
      else state.skills.push(skill);

      if (isCustom) {
        if (!state.customSkillIds.includes(skill.id)) {
          state.customSkillIds.push(skill.id);
        }
        if (skill.id >= state.nextCustomSkillId) {
          state.nextCustomSkillId = skill.id + 1;
        }
      }

      saveSkills(state.skills);
      saveCustomIds(state.customSkillIds);
      saveNextId(state.nextCustomSkillId);
    },

    allocateCustomSkillId: (state) => {
      state.nextCustomSkillId += 1;
      saveNextId(state.nextCustomSkillId);
    },

    setNextCustomSkillId: (state, action: PayloadAction<number>) => {
      state.nextCustomSkillId = action.payload;
      saveNextId(state.nextCustomSkillId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSkills.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSkills.fulfilled, (state, action) => {
        const catalog = action.payload;

        const byId = new Map<number, Skill>();

        for (const s of catalog) byId.set(s.id, s);

        for (const s of state.skills) {
          if (!byId.has(s.id)) byId.set(s.id, s);
        }

        state.skills = Array.from(byId.values());
        state.isLoading = false;

        const maxId = state.skills.reduce((m, s) => Math.max(m, s.id), 0);
        state.nextCustomSkillId = Math.max(state.nextCustomSkillId, maxId + 1);

        saveSkills(state.skills);
        saveNextId(state.nextCustomSkillId);
        saveCustomIds(state.customSkillIds);
      })
      .addCase(fetchSkills.rejected, (state, action) => {
        state.error = action.error.message || 'Ошибка загрузки навыков';
        state.isLoading = false;
      });
  },
});

export const { hydrateSkills, upsertSkill, allocateCustomSkillId, setNextCustomSkillId } =
  skillsSlice.actions;

export default skillsSlice.reducer;
