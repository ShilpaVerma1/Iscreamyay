import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { Storage } from '@ionic/storage';
import {MainscreenPage } from '../pages/mainscreen/mainscreen';
import {MainHomePage } from '../pages/mainhome/mainhome';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  usrid:any;
  rootPage: any=HomePage;
  type:any;
  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public menu: MenuController,private storage: Storage, public statusBar: StatusBar, public splashScreen: SplashScreen) {
  this.initializeApp();
  
    document.addEventListener("pause", () => {

    }, false);

    document.addEventListener("resume", () => {

    }, false);

    this.storage.get('userid').then((userid) => {
          this.usrid = userid;
          if(!this.usrid ){
              this.rootPage = HomePage ;
          }
          else if(this.usrid ) {
              this.rootPage = MainHomePage;
          }
    });

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
