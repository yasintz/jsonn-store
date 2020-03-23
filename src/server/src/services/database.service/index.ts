import Repository from '@server/database/repository';
import UserService from './user.service';

class DatabaseService {
  public readonly UserService: UserService;

  constructor(repository: Repository) {
    this.UserService = new UserService(repository.UserRepository);
  }
}

export default DatabaseService;
