import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Mission } from '../../models/Mission.model';
import { MissionsStore } from '../stores/missions.store';

@Injectable()
export class MissionsService {
    baseUrl = environment.baseUrl
    missionsUrl = this.baseUrl + 'missions'
    constructor(
        private http: HttpClient,
        private storeMissions: MissionsStore
    ) {}

    getMissions() {
        this.http.get<Mission[]>(this.missionsUrl).toPromise().then((missions: Mission[]) => {
            this.storeMissions.storeMissions(missions)
        })
    }
}