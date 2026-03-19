export const getFirstName = (fullName: string): string => {
  if (!fullName) return '';

  return fullName.trim().split(/\s+/)[0];
};
