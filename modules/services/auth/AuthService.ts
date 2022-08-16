import {AuthDatabasesFiles} from "../../databasesFiles/auth/AuthDatabasesFiles";
import {IChangePassword, ISignInRequest, IUserDto} from "../../../interfaces/auth/IAuths";
import {schemaBuilder, schemes, validator} from "../../../schemaValidator/schemaBuilder";
import {AuthDatabasesMongo} from "../../databasesMongoDB/auth/AuthDatabasesMongo";

const schemaSignUp = {
  'name': schemaBuilder(schemes.required),
  'email': schemaBuilder(schemes.required),
  'sex': schemaBuilder(schemes.required),
};

const schemaSignIn = {
  'email': schemaBuilder(schemes.required),
  'password': schemaBuilder(schemes.required),
};

const schemaChangePassword = {
    'email': schemaBuilder(schemes.required),
    'oldPassword': schemaBuilder(schemes.required),
    'password': schemaBuilder(schemes.required),
}

export class AuthService {
  static async signUp(body: IUserDto) {
    await validator(schemaSignUp, body);
   return AuthDatabasesMongo.signUp(body);
  }

  static async signIn(body: ISignInRequest) {
    await validator(schemaSignIn, body);
    return AuthDatabasesMongo.signIn(body);
  }

  static async changePassword(body: IChangePassword) {
      await validator(schemaChangePassword, body);
     return AuthDatabasesMongo.changePassword(body);
  }
};