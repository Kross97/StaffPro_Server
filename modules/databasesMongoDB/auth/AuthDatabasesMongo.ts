import {IChangePassword, ISignInRequest, IUserDto, IUserResponse} from "../../../interfaces/auth/IAuths";
import {ConnectorMyDB} from "../connectorsDB/mongoDBConector/connectors/ConnectorMyDB";

export class AuthDatabasesMongo {
    static async signUp(data: IUserDto): Promise<IUserResponse> {
        const user = await ConnectorMyDB.getCollection('authorization').find({ email: data.email });
        // if(!user) {
        //
        // }
        ConnectorMyDB.getCollection('authorization').insertOne(data);
        return data;
    }

    // static async signIn(data: ISignInRequest): Promise<IUserResponse> {
    // }
    //
    // static async changePassword(data: IChangePassword): Promise<IUserResponse> {
    // }
};