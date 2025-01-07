export interface IUser {
  id?: number;
  email: string;
  name: string;
  bio?: string;
  role?: string;
  firebase_token: string;
}
