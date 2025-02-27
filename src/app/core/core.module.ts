import { NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { GrowlerModule } from './growler/growler.module';
import { EnsureModuleLoadedOnceGuard } from './ensure-module-loaded-once.guard';
import { ModalModule } from './modal/modal.module';
import { ComponentsStateStore } from './stores/components-state.store';
import { BaseHttpService } from './services/base-http.service';
import { UserStore } from './stores/user.store';
import { BuildingsStore } from './stores/buildings.store';
import { BuildingsService } from './services/buildings.service';
import { AuthGuard } from './services/auth-guard.service';
import { MissionsService } from './services/missions.service';
import { MissionsStore } from './stores/missions.store';
import { VehiclesService } from './services/vehicles.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule, 
    HttpClientModule, 
    GrowlerModule, 
    ModalModule
  ],
  exports: [ 
    HttpClientModule,
    GrowlerModule, 
    ModalModule
  ],
  providers: [
    AuthService,
    HttpClient,
    ComponentsStateStore,
    BuildingsStore,
    BuildingsService,
    MissionsService,
    MissionsStore,
    VehiclesService,
    UserStore,
    BaseHttpService,
    AuthGuard
  ],
})
export class CoreModule extends EnsureModuleLoadedOnceGuard {
  // Looks for the module in the parent injector to see if it's already been loaded (only want it loaded once)
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    super(parentModule);
  }
 }
