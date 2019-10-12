import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Route, CanLoad } from "@angular/router";
import { AuthService } from "./auth.service";


@Injectable()
export class AuthGuard implements CanActivate, CanLoad {

    constructor(private authService: AuthService, 
                private router: Router){
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean{
        if (this.authService.checkIfUserIsSignedIn()) return true
        this.router.navigateByUrl('/auth')
        return false
    }

    canLoad(route: Route): boolean {
        return this.authService.checkIfUserIsSignedIn()
    }
}