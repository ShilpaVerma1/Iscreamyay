import { Component } from '@angular/core';
import { NavController, Platform,MenuController} from 'ionic-angular';
import { FbPage } from '../fblog/fblog';
import { OneSignal } from 'ionic-native';
import { Network } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { MainHomePage } from '../mainhome/mainhome';

declare var window: any;
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [OneSignal]
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
          window.plugins.toast.show("Always remember to turn on your location", "long", "center");
      });
    this.platform.ready().then(() => {
        OneSignal.startInit('862a0842-e625-439f-a3af-5a41c6a2ac1c', '115973810805'); // import APP ID and Project Number
        OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.Notification);
        OneSignal.setSubscription(true);
        OneSignal.getIds().then((dviceid)=>{
            this.storage.set("deviceid",dviceid.userId);      
                  //alert(dviceid.pushToken);
        });
        OneSignal.handleNotificationReceived().subscribe((data) => {
        });
        OneSignal.handleNotificationOpened().subscribe(() => {
          this.storage.get('userid').then((userid) => {
            this.usrid=userid;
              if(this.usrid ){
                this.navCtrl.push(MainHomePage)
              }
          })
        });
        OneSignal.endInit();
    })
}
welcome(){
    this.storage.get('deviceid').then((deviceid) => {
       this.devid = deviceid;
        if(this.devid != null){
            this.navCtrl.push(FbPage,{
            deviceidd:this.devid
           })
        }
        else{
            this.platform.ready().then(() => {
              window.plugins.toast.show("Reopen your app", "long", "center");
            });
        }
    })
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
