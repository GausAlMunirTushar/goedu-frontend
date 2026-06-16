// Academic related TypeScript types

export interface DepartmentData {
  id: string;
  name: string;
  code?: string | null;
  status?: string;
}

export interface BranchData {
  id: string;
  name: string;
  code?: string | null;
  address?: string | null;
  departmentId?: string | null;
  status?: string;
}
