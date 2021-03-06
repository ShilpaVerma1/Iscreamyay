import { Component } from '@angular/core';
import { NavController, Platform,MenuController} from 'ionic-angular';
import { FbPage } from '../fblog/fblog';
import { Network } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { MainHomePage } from '../mainhome/mainhome';

declare var window: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {
FbPage = FbPage;
devid:any;
usrid:any;
constructor(public navCtrl: NavController,public menu:MenuController, public platform: Platform, private storage: Storage) {
    
    Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
    Network.onConnect().subscribe(()=> {
    });
     this.platform.ready().then(() => {
          window.plugins.toast.show("Always remember to turn on your location", "short", "center");
      });

}
welcome(){
    // this.storage.get('deviceid').then((deviceid) => {
    //    this.devid = deviceid;
    //     if(this.devid != null){
    //         this.navCtrl.push(FbPage,{
    //         deviceidd:this.devid
    //        })
    //     }
    //     else{
    //         this.platform.ready().then(() => {
    //           window.plugins.toast.show("Reopen your app", "long", "center");
    //         });
    //     }
    // })
   this.navCtrl.push(FbPage);
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
