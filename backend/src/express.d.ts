import { User } from './auth/interfaces/user.interface';

declare global {
  namespace Express {
    export interface Request {
      user?: Omit<User, 'password'>;
    }
  }
}
