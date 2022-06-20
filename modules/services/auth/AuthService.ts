import {AuthDatabasesFiles} from "../../databases/auth/AuthDatabasesFiles";
import {ISignInRequest, IUserDto} from "../../../interfaces/auth/IAuths";
import {schemaBuilder, schemes} from "../../../schemaValidator/schemaBuilder";

const validator = async (schema: Record<string, any> , body: Record<string, any>) => {
    const entriesObj = Object.entries(body);
    let res: boolean | Promise<{ message: string, status: number}> = true;
    for (let i = 0; i < entriesObj.length; i ++) {
        const [key, value] = entriesObj[i];
        if(!(key in schema)) {
            //res = Promise.reject({ message: `${key} Field not found`, status: 400});
            //break;
        } else {
            try {
                res = await schema[key](value);
            } catch (err) {
                 if('messageSchema' in err) {
                     res = Promise.reject({ message: `${key} ${err.messageSchema}`, status: 400});
                 } else {
                     res = Promise.reject({ message: 'Server validation error', status: 500 })
                 }
                 break;
            }
        }
    }
    return res;
};


const schemaSignUp = {
  'name': schemaBuilder(schemes.required),
  'email': schemaBuilder(schemes.required),
  'sex': schemaBuilder(schemes.required),
};

const schemaSignIn = {
  'email': schemaBuilder(schemes.required),
  'password': schemaBuilder(schemes.required),
};

export class AuthService {
  static async signUp(body: IUserDto) {
    await validator(schemaSignUp, body);
   return AuthDatabasesFiles.signUp(body);
  }

  static async signIn(body: ISignInRequest) {
    await validator(schemaSignIn, body);
    return AuthDatabasesFiles.signIn(body);
  }
};