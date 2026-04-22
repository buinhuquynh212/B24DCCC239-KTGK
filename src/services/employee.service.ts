import type { Employee } from '@/types/employee';

const KEY = 'employees';

// GET
export const getEmployees = (): Employee[] => {
  const data = localStorage.getItem(KEY);
  return data ? (JSON.parse(data) as Employee[]) : [];
};

// SAVE
export const saveEmployees = (data: Employee[]) => {
  localStorage.setItem(KEY, JSON.stringify(data));
};

// ADD
export const addEmployee = (emp: Employee) => {
  const list = getEmployees();
  list.push(emp);
  saveEmployees(list);
};

// UPDATE
export const updateEmployee = (emp: Employee) => {
  const list = getEmployees().map((e: Employee) =>
    e.id === emp.id ? emp : e
  );
  saveEmployees(list);
};

// DELETE
export const deleteEmployee = (id: string) => {
  const list = getEmployees().filter((e: Employee) => e.id !== id);
  saveEmployees(list);
};