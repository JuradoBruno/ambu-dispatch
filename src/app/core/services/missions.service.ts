import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Mission } from '../../models/Mission.model';
import { MissionsStore } from '../stores/missions.store';
import { BaseHttpService } from './base-http.service';
import { UserStore } from '../stores/user.store';
import { User } from '../../models/User.model';

@Injectable()
export class MissionsService {
    missionsUrl = 'missions'
    constructor(
        private http: HttpClient,
        private baseHttp: BaseHttpService,
        private storeMissions: MissionsStore,
        private userStore: UserStore,
    ) { }

    getMissions() {
        this.baseHttp.get<Mission[]>(this.missionsUrl).then((missions: Mission[]) => {
            this.storeMissions.storeMissions(missions)
        })
    }

    addMission(latlng, mission: Mission) {
        return this.baseHttp.post<User>(this.missionsUrl + '/by-coordinates', { latlng, mission }).then((user: User) => {
            this.userStore.storeCurrentUser(user)
        })
    }
}