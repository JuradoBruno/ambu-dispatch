import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Building } from 'src/app/models/Buildings.model';
import { ObservableStore } from '@codewithdan/observable-store';
import { IStoreState } from '../stores/store-state.interface';
import { BuildingsStore } from '../stores/buildings.store';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BuildingsService{
  baseUrl = environment.baseUrl
  buildingsUrl = this.baseUrl + 'buildings'

  constructor( 
    private http: HttpClient,
    private storeBuildings: BuildingsStore) {}

  getBuildings() {
    this.http.get<Building[]>(this.buildingsUrl).toPromise().then((buildings: Building[]) => {
      this.storeBuildings.storeBuildings(buildings)
    })
  }
}
