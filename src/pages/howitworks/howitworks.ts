import { Component } from '@angular/core';
import { NavController, Platform,MenuController } from 'ionic-angular';
import { Network } from 'ionic-native';
import { MainHomePage} from '../mainhome/mainhome';
import 'rxjs/add/operator/map';
import {MainscreenPage } from '../mainscreen/mainscreen';

declare var window: any;

@Component({
  selector: 'page-howitworks',
  templateUrl: 'howitworks.html'
})
export class HowitworksPage {
  MainHomePage: any;

  constructor(public navCtrl: NavController,public menu:MenuController, public platform:Platform) {
 Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
     Network.onConnect().subscribe(()=> {
      // this.platform.ready().then(() => {
      //    window.plugins.toast.show("You are online", "long", "center");
      //   });
     });
 }
 back(){
   this.navCtrl.push(MainscreenPage);
 }
ionViewDidEnter() {
    //to disable menu, or
    this.menu.enable(false);
  }

  ionViewWillLeave() {
    // to enable menu.
    this.menu.enable(true);
  } 
}
