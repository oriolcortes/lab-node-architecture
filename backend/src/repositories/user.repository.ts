import logger from '../config/logger';
import { IUser } from '../interfaces/user.interface';
import { IUserModel, UserModel } from '../models/user.model';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<IUser, IUserModel> {
  constructor() {
    super(UserModel, 'user');
  }

  async getByEmail(email: string): Promise<IUser | null> {
    logger.debug(`Repository: Fetching user by email: ${email}`);
    const user = await this.model.findOne({ email });
    if (!user) {
      logger.debug(`Repository: No user found with email: ${email}`);
      return null;
    }
    logger.debug(`Repository: User with email ${email} fetched`);
    return this.transformId(user);
  }
}
