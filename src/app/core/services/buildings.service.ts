import { Injectable } from '@angular/core';
import { Building } from 'src/app/models/Building.model';
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
  buildingsUrl = 'buildings'

  constructor(
    private baseHttp: BaseHttpService,
    private storeBuildings: BuildingsStore,
    private userStore: UserStore,
    private modal: ModalService) { }

  getBuildings() {
    this.baseHttp.get<Building[]>(this.buildingsUrl).then((buildings: Building[]) => {
      this.storeBuildings.storeBuildings(buildings)
    })
  }

  addBuilding(latlng, buildingToCreateAndMoneyType) {
    const { building, moneyType } = buildingToCreateAndMoneyType

    return this.baseHttp.post<User>(this.buildingsUrl + '/by-coordinates', { latlng, building, moneyType }, {}, false).then((user: User) => {
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
