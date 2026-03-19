import { useState, useCallback, useMemo } from 'react';
import { type ValidationRule } from '../validation/rules';

/**
 * Обобщенный тип для схемы валидации.
 */
export type ValidationSchema<T> = Partial<Record<keyof T, ValidationRule<unknown>[]>>;

/**
 * Универсальный хук для управления формами и валидацией.
 */
export function useForm<T extends Record<string, unknown>>(
  initialValues: T,
  validationSchema: Record<keyof T, ValidationRule<unknown>[]>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const validateField = useCallback(
    (name: keyof T, value: unknown): string | undefined => {
      const rules = validationSchema[name];
      if (!rules) return undefined;

      for (const rule of rules) {
        const error = rule(value);
        if (error) return error;
      }
      return undefined;
    },
    [validationSchema]
  );

  const handleChange = useCallback(
    (name: keyof T, value: unknown) => {
      setValues((prev) => ({ ...prev, [name]: value }));
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    },
    [validateField]
  );

  const handleBlur = useCallback((name: keyof T) => {
    setTouched((prev) => ({ ...prev, [name]: true }));
  }, []);

  const handleSubmit = useCallback(
    (onSuccess: (data: T) => void) => {
      const newErrors: Partial<Record<keyof T, string>> = {};
      const newTouched: Partial<Record<keyof T, boolean>> = {};
      let isFormValid = true;

      Object.keys(validationSchema).forEach((key) => {
        const fieldKey = key as keyof T;
        const error = validateField(fieldKey, values[fieldKey]);
        if (error) isFormValid = false;
        newErrors[fieldKey] = error;
        newTouched[fieldKey] = true;
      });

      setErrors(newErrors);
      setTouched(newTouched);

      if (isFormValid) {
        onSuccess(values);
      }
    },
    [values, validationSchema, validateField]
  );

  const isValid = useMemo(() => {
    return Object.keys(validationSchema).every((key) => {
      const error = validateField(key as keyof T, values[key as keyof T]);
      return error === undefined;
    });
  }, [values, validationSchema, validateField]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    isValid,
    setValues,
    setErrors,
    setTouched,
  };
}
