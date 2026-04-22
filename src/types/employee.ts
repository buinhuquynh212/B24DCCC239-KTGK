export type EmployeeStatus =
  | 'probation'
  | 'official'
  | 'leave'
  | 'resigned';

export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  salary: number;
  status: EmployeeStatus;
}