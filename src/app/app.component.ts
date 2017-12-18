import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
import { VendorregisterPage } from '../pages/vendorregister/vendorregister';
import {MainHomePage } from '../pages/mainhome/mainhome';
import { GoogleMapPage} from '../pages/googlemap/googlemap';
import { OneSignal } from 'ionic-native';
import { UserProfilePage } from '../pages/userprofile/userprofile';

@Component({
  templateUrl: 'app.html',
  providers: [OneSignal]

})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  usrid:any;
  rootPage: any=HomePage;
  typeuser:any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public menu: MenuController,private storage: Storage, public statusBar: StatusBar, public splashScreen: SplashScreen) {
  this.initializeApp();
  
    document.addEventListener("pause", () => {

    }, false);

    document.addEventListener("resume", () => {

    }, false);

    this.storage.get('userid').then((userid) => {
          this.usrid = userid;
        this.storage.get('logintype').then((logintype) => {
          this.typeuser = logintype;

          if(!this.usrid && !this.typeuser){
              this.rootPage = HomePage ;
          }
          else if(this.usrid && this.typeuser) {
              this.rootPage = GoogleMapPage;
          }
        })
    });
    this.platform.ready().then(() => {
        OneSignal.startInit('862a0842-e625-439f-a3af-5a41c6a2ac1c', '115973810805'); // import APP ID and Project Number
        OneSignal.inFocusDisplaying(OneSignal.OSInFocusDisplayOption.Notification);
        OneSignal.setSubscription(true);
        OneSignal.getIds().then((dviceid)=>{
            this.storage.set("deviceid",dviceid.userId);      
                  //alert(dviceid.pushToken);
             //     alert(dviceid.userId);
        });
        OneSignal.handleNotificationReceived().subscribe((data) => {
        });
        OneSignal.handleNotificationOpened().subscribe(() => {
          this.storage.get('userid').then((userid) => {
            this.usrid=userid;
              if(this.usrid ){
                this.nav.push(MainHomePage)
              }
          })
        });
        OneSignal.endInit();
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
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
