import {IChangePassword, ISignInRequest, IUserDto, IUserResponse} from "../../../interfaces/auth/IAuths";
import {ConnectorMyDB} from "../connectorsDB/mongoDBConector/connectors/ConnectorMyDB";

export class AuthDatabasesMongo {
    static async signUp(data: IUserDto): Promise<IUserDto> {
        const countUsers = await ConnectorMyDB.getCollection('authorization').find({ email: data.email }).count();
        if(!countUsers) {
            await ConnectorMyDB.getCollection('authorization').insertOne(data);
            return await ConnectorMyDB.getCollection('authorization').findOne({ email: data.email }) as any;
        } else {
            throw { status: 409, message: 'User is Exist'};
        }
    }

    static async signIn(data: ISignInRequest): Promise<IUserResponse> {
        const user = await ConnectorMyDB.getCollection('authorization').findOne<IUserDto>({ email: data.email, password: data.password });
        if(!user) {
            throw { status: 404, message: 'User with user data not exist'};
        } else {
            return  user;
        }
    }

    static async changePassword(data: IChangePassword): Promise<IUserResponse> {
      const user = await ConnectorMyDB.getCollection('authorization').findOneAndUpdate(
          { email: data.email, password: data.oldPassword },
          { $set: { password: data.password }},
          {  returnDocument: 'after' });

      if(user.value) {
          return user.value as any;
      } else {
          throw { status: 400, message: 'Error user updated'};
      }
    }
};