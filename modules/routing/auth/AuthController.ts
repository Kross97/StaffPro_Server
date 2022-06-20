import {IClientDuplex} from "../../../interfaces/IClientDuplex";
import {AuthService} from "../../services/auth/AuthService";
import {postMethodBodyHandler} from "../../../helpers/postMethodBodyHandler";
import {ISignInRequest, IUserDto} from "../../../interfaces/auth/IAuths";
import {jsonSuccess} from "../../../helpers/responseHelpers/jsonSuccess";
import {errorHandler} from "../../../helpers/responseHelpers/errorHandler";

const dispatcherAuthApi = {
  'postsignup': 'signUp',
  'postsignin': 'signIn',
};


export class AuthController {

   static async signUp(client: IClientDuplex) {
     const body = await postMethodBodyHandler(client);
     if(body) {
         try {
             const response = await AuthService.signUp(body as IUserDto);
             jsonSuccess(client, response);
         } catch (err) {
             console.log("CONTROLLER_ERR SIGN_UP", err);
             errorHandler(client, err);
         }
     }
   }

   static async signIn(client: IClientDuplex) {
       const body = await postMethodBodyHandler(client);
       try {
        const response = await AuthService.signIn(body as ISignInRequest);
        jsonSuccess(client, response);
       } catch (err) {
           console.log("CONTROLLER_ERR SIGN_IN", err);
           errorHandler(client, err);
       }
   }

   static api(client: IClientDuplex, methodName: string) {
     const nameMethod = dispatcherAuthApi[`${client.request.method}${methodName}`.toLowerCase()];
     const currentMethod = this[nameMethod];

     if(currentMethod) {
         currentMethod(client);
     } else {
         client.response.statusCode = 404;
         client.response.end('Not Found');
     }
   }
};