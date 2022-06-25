export interface IUserDto {
  email: string;
  name: string;
  lastName: string;
  patronymic: string;
  day: number;
  month: string;
  year: number;
  phone?: string;
  sex: 'man' | 'woman';
  remember: boolean;
  password: string;
}

export interface IUserResponse {
    email: string;
    name: string;
    lastName: string;
    patronymic: string;
    day: number;
    month: string;
    year: number;
    phone?: string;
    sex: 'man' | 'woman';
}

export interface ISignInRequest {
    email: string;
    password: string;
}

export interface IChangePassword {
    email: string;
    oldPassword: string;
    password: string;
}