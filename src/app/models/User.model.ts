export class User {
    id: number
    username: string
    password: string
    email: string
    salt: string
    coin_money: string
    cash_money: string
    
    constructor(user?: any) {
        Object.assign(this, user)
    }
}