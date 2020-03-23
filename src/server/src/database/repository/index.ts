import UserRepository from './user.repository';
import { ModelsType } from '../models';

class Repository {
  readonly UserRepository: UserRepository;

  constructor(models: ModelsType) {
    this.UserRepository = new UserRepository(models.UserModel);
  }
}

export default Repository;
