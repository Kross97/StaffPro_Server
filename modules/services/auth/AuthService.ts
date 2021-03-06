import {AuthDatabasesFiles} from "../../databases/auth/AuthDatabasesFiles";
import {IChangePassword, ISignInRequest, IUserDto} from "../../../interfaces/auth/IAuths";
import {schemaBuilder, schemes, validator} from "../../../schemaValidator/schemaBuilder";

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
   return AuthDatabasesFiles.signUp(body);
  }

  static async signIn(body: ISignInRequest) {
    await validator(schemaSignIn, body);
    return AuthDatabasesFiles.signIn(body);
  }

  static async changePassword(body: IChangePassword) {
      await validator(schemaChangePassword, body);
     return AuthDatabasesFiles.changePassword(body);
  }
};