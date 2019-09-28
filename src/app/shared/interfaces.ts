export interface IUserSignupData {
    username: string;
    password: string;
    email: string;
}

export interface IUserSigninData {
    username: string;
    password: string;
}

export interface IAuthToken {
    accessToken: string;
}