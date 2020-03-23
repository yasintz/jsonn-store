import UserModel from './user.model';
import JsonModel from './json.model';
import UserJsonModel from './user_json.model';

export type ModelsType = typeof Models;

const Models = {
  UserModel,
  JsonModel,
  UserJsonModel,
};

export default Models;
