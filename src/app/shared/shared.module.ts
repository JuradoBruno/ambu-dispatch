import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetDistancePipe } from './pipes/get-distance.pipe';
import { CoordinatesService } from './services/coordinates.service';



@NgModule({
  declarations: [GetDistancePipe],
  imports: [
    CommonModule
  ],
  exports: [
    GetDistancePipe
  ],
  providers: [
    CoordinatesService
  ]
})
export class SharedModule { }
