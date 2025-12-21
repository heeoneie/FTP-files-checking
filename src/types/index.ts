export interface Source {
  id: string;
  path: string;
  useUser: string;
  lastUser: string;
  lastUpdateDate: string;
  timestamp: number;
}

export interface User {
  id: string;
  name: string;
  isActive: boolean;
  loginAt: number;
}

export interface SourceData {
  path: string;
  useUser: string;
  lastUser: string;
  lastUpdateDate: string;
  timestamp: number;
}

export interface UserData {
  name: string;
  isActive: boolean;
  loginAt: number;
}

export type RootPath = 'sysadmin' | 'www' | 'amp_set';