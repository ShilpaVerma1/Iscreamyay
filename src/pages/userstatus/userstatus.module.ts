import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UserstatusPage } from './userstatus';

@NgModule({
  declarations: [
    UserstatusPage,
  ],
  imports: [
    IonicPageModule.forChild(UserstatusPage),
  ],
})
export class UserstatusPageModule {}
