import { uuid } from '@server/utils';
import bcrypt from 'bcrypt';
import { Service } from '@server/helpers';
import UserRepository from '@server/database/repository/user.repository';
import { HTTP400Error } from '@server/helpers/http-errors';

class UserService extends Service<UserRepository> {
  create = async (username: string, password: string) => {
    return this.Repository.create({
      id: uuid(),
      username,
      password: await bcrypt.hash(password, 12),
    });
  };

  hasUserByName = async (username: string): Promise<boolean> => {
    if (!username) {
      throw new HTTP400Error('Username is required');
    }
    const user = await this.Repository.getByUsername(username);

    return Boolean(user);
  };

  getUser = async (username: string, password: string) => {
    const user = await this.Repository.getByUsername(username);
    if (user) {
      const match = await bcrypt.compare(password, user.password);
      if (match) {
        return user;
      }
    }

    return undefined;
  };

  findById = async (userId: string) => {
    const user = await this.Repository.findById(userId);

    return user;
  };

  findOrCreateByGoogleId = async (googleId: string, email: string) => {
    const user = await this.Repository.findByGoogleId(googleId);
    if (user) {
      return user;
    }

    return this.Repository.createByGoogleId({ id: uuid(), username: email, googleId });
  };
}

export default UserService;
