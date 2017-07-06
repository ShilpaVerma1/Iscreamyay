import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { MainscreenPage } from './mainscreen';

@NgModule({
  declarations: [
    MainscreenPage,
  ],
  exports: [
    MainscreenPage
  ]
})
export class MainscreenPageModule {}
