import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Building } from 'src/app/models/Buildings.model';
import { BuildingsStore } from '../stores/buildings.store';
import { environment } from 'src/environments/environment';
import { BaseHttpService } from './base-http.service';
import { UserStore } from '../stores/user.store';
import { User } from '../../models/User.model';
import { ModalService } from '../modal/modal.service';

@Injectable({
  providedIn: 'root'
})
export class BuildingsService {
  baseUrl = environment.baseUrl
  // baseUrl = 'https://ambu-dispatch-production.eu-west-1.elasticbeanstalk.com' // Get that from .env
  // 
  buildingsUrl = this.baseUrl + 'buildings'

  constructor(
    private http: HttpClient,
    private baseHttpService: BaseHttpService,
    private storeBuildings: BuildingsStore,
    private userStore: UserStore,
    private modal: ModalService) { }

  getBuildings() {
    this.http.get<Building[]>(this.buildingsUrl).toPromise().then((buildings: Building[]) => {
      this.storeBuildings.storeBuildings(buildings)
    })
  }

  addBuilding(latlng, buildingToCreateAndMoneyType) {
    const { building, moneyType } = buildingToCreateAndMoneyType
    let headers = this.baseHttpService.returnHeaders()

    return this.http.post(this.buildingsUrl + '/by-coordinates', { latlng, building, moneyType }, { headers }).toPromise().then((user: User) => {
      this.userStore.storeCurrentUser(user)
    }).catch(error => {
      let header = error.error.statusCode === 404? 'Adresse introuvable' : error.error.statusCode
      this.modal.show({
        header,
        body: error.error.message,
        cancelButtonVisible: false
      })
    })
  }
}
