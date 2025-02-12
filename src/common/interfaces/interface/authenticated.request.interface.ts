import { User } from '../../../core/user/user.schema';

export interface AuthenticatedRequest extends Request {
  user: User;
}
