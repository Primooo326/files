export interface IUser {
  email: string;
  uid: string;
  password: string;
  displayName: string;
  emailVerified: boolean;
  token: string;
}
export class User implements IUser {
  email!: string;
  uid!: string;
  password!: string;
  displayName!: string;
  emailVerified!: boolean;
  token!: any;
}
