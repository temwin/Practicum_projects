// приводим gender пользователя к 'male' | 'female' | 'unknown'
export const normalizeGender = (g?: string): 'male' | 'female' | 'unknown' => {
  const s = (g ?? '').trim().toLowerCase();

  if (!s) return 'unknown';

  // варианты на русском
  if (s.includes('муж')) return 'male';
  if (s.includes('жен')) return 'female';

  // варианты на англ
  if (s === 'male' || s === 'm') return 'male';
  if (s === 'female' || s === 'f') return 'female';

  return 'unknown';
};
