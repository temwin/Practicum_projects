import {
  hasSpecialChar,
  hasUppercase,
  isEmail,
  maxLength,
  minLength,
  required,
  type ValidationRule,
} from './rules';

export const loginValidation: Record<string, ValidationRule<unknown>[]> = {
  email: [required, isEmail],
  password: [required],
};

export const registerStepOneValidation: Record<string, ValidationRule<unknown>[]> = {
  email: [required, isEmail],
  password: [required, minLength(8), hasUppercase, hasSpecialChar],
};

export const registerStepTwoValidation: Record<string, ValidationRule<unknown>[]> = {
  name: [required, minLength(2)],
  city: [required],
  gender: [required],
};

export const registerStepThreeValidation: Record<string, ValidationRule<unknown>[]> = {
  skillName: [required, minLength(3)],
  categoryId: [required],
  description: [required, minLength(10)],
};

export const personalDataValidation: Record<string, ValidationRule<unknown>[]> = {
  name: [required, minLength(2)],
  email: [required, isEmail],
};

export const createSkillValidation: Record<string, ValidationRule<unknown>[]> = {
  title: [required, minLength(3), maxLength(50)],
  description: [required, maxLength(500)],
  type: [required],
  category: [required],
};
