import logger from '../config/logger';
import { User } from '../interfaces/user.interface';
import { UserModel, UserModel } from '../models/user.model';
import { BaseRepository } from './base.repository';

export class UserRepository extends BaseRepository<User, UserModel> {
  constructor() {
    super(UserModel, 'user');
  }

  async getByEmail(email: string): Promise<User | null> {
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
