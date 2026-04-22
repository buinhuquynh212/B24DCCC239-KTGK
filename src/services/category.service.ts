const POSITION_KEY = 'positions';
const DEPARTMENT_KEY = 'departments';

// ===== POSITION =====
export const getPositions = (): string[] => {
  const data = localStorage.getItem(POSITION_KEY);
  if (!data) {
    const defaultData = ['Manager', 'Staff'];
    localStorage.setItem(POSITION_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

// ===== DEPARTMENT =====
export const getDepartments = (): string[] => {
  const data = localStorage.getItem(DEPARTMENT_KEY);
  if (!data) {
    const defaultData = ['HR', 'IT'];
    localStorage.setItem(DEPARTMENT_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};