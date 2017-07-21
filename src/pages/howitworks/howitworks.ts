import { Component } from '@angular/core';
import { NavController, Platform,MenuController } from 'ionic-angular';
import { Network } from 'ionic-native';
import 'rxjs/add/operator/map';
import {MainHomePage } from '../mainhome/mainhome';

declare var window: any;

@Component({
  selector: 'page-howitworks',
  templateUrl: 'howitworks.html'
})
export class HowitworksPage {

constructor(public navCtrl: NavController,public menu:MenuController, public platform:Platform) {
  Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
  Network.onConnect().subscribe(()=> {

  });

}
 Backtohome(){
   this.navCtrl.push(MainHomePage);
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
