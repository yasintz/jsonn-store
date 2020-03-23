import DatabaseService from '@server/services/database.service';
import Repository from '@server/database/repository';
import Models from '@server/database/models';

class DatabaseContext {
  private repository: Repository;

  readonly Services: DatabaseService;

  constructor() {
    this.repository = new Repository(Models);
    this.Services = new DatabaseService(this.repository);
  }
}

export default DatabaseContext;
