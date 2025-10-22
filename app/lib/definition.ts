export type StateBot = {
  message: string | null;
  status: string;
};

export type StateDrive = {
  data: [] | null;
  status: string;
}

export type User = {
  id: number;
  role_id: number;
  email: string;
  password: string;
}

export type GDriveFile = {
  id: string;
  name: string;
}
