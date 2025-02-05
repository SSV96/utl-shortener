import { User } from '../user.schema';

export interface AuthenticatedRequest extends Request {
  user: User;
}
