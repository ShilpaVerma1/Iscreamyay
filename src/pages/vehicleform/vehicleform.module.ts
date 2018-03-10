import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { VehicleformPage } from './vehicleform';

@NgModule({
  declarations: [
    VehicleformPage,
  ],
  imports: [
  //  IonicModule.forChild(VehicleformPage),
  ],
  exports: [
    VehicleformPage
  ]
})
export class VehicleformPageModule {}
