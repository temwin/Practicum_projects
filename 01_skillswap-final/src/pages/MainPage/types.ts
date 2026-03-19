export type SkillType = 'all' | 'learn' | 'teach';
export type Gender = 'all' | 'male' | 'female';

export type SelectedItem = {
  id: number;
  name: string;
};

export type FiltersValue = {
  skillType: SkillType;
  gender: Gender;
  selectedSkills: SelectedItem[]; // subcategory ids
  selectedCities: SelectedItem[]; // city ids
};
