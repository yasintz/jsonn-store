import { Repository } from '@server/helpers';
import UserModel from '../models/user.model';

type CreateParameters = {
  id: string;
  username: string;
  password: string;
};

type CreateByGoogleIdParameters = {
  id: string;
  username: string;
  googleId: string;
};

class UserRepository extends Repository<typeof UserModel> {
  create = ({ id, password, username }: CreateParameters) => this.Model.create({ id, username, password }).save();

  createByGoogleId = ({ id, googleId, username }: CreateByGoogleIdParameters) =>
    this.Model.create({ id, username, googleId }).save();

  getByUsername = (username: string) => this.Model.findOne({ where: { username } });

  findById = (userId: string) => this.Model.findOne({ where: { id: userId } });

  findByGoogleId = (googleId: string) => this.Model.findOne({ where: { googleId } });
}

export default UserRepository;
