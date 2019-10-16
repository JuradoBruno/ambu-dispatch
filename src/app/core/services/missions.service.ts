import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Mission } from '../../models/Mission.model';
import { MissionsStore } from '../stores/missions.store';
import { BaseHttpService } from './base-http.service';
import { UserStore } from '../stores/user.store';
import { ModalService } from '../modal/modal.service';
import { User } from '../../models/User.model';

@Injectable()
export class MissionsService {
    baseUrl = environment.baseUrl
    missionsUrl = this.baseUrl + 'missions'
    constructor(
        private http: HttpClient,
        private baseHttpService: BaseHttpService,
        private storeMissions: MissionsStore,
        private userStore: UserStore,
        private modal: ModalService
    ) {}

    getMissions() {
        this.http.get<Mission[]>(this.missionsUrl).toPromise().then((missions: Mission[]) => {
            this.storeMissions.storeMissions(missions)
        })
    }
    
    addMission(latlng, mission: Mission) {
        let headers = this.baseHttpService.returnHeaders()
        return this.http.post(this.missionsUrl+ '/by-coordinates', { latlng, mission}, { headers }).toPromise().then((user: User) => {
            this.userStore.storeCurrentUser(user)
        }).catch(error => {
            let header = "Erreur" + error.error.statusCode
            this.modal.show({
            header,
            body: error.error.message,
            cancelButtonVisible: false
            })
        })
    }
}