import { User } from '../models/User.model';

export interface IUserSignupData {
    username: string;
    password: string;
    email: string;
}

export interface IUserSigninData {
    username: string;
    password: string;
}

export interface ISigninDto {
    accessToken: string;
    user: User;
}