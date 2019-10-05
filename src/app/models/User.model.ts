export class User {
    id: number
    username: string
    password: string
    email: string
    salt: string
    coinMoney: number
    cashMoney: number
    
    constructor(user?: any) {
        Object.assign(this, user)
    }
}