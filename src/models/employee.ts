import { getEmployees } from '@/services/employee.service';
import type { Employee } from '@/types/employee';

interface EmployeeModelState {
  list: Employee[];
}

interface Action {
  type: string;
  payload?: any;
}

export default {
  namespace: 'employee',

  // FIX kiểu state
  state: {
    list: [],
  } as EmployeeModelState,

  effects: {
    // FIX type cho effect
    *fetch(_: Action, { put }: any) {
      const data: Employee[] = getEmployees();
      yield put({ type: 'setList', payload: data });
    },
  },

  reducers: {
    // FIX type reducer
    setList(state: EmployeeModelState, { payload }: Action) {
      return {
        ...state,
        list: payload,
      };
    },
  },
};