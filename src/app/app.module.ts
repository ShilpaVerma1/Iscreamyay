import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FbPage } from '../pages/fblog/fblog';
import { CurrentPage } from '../pages/currentpage/currentpage';
import { EditProfilepage } from '../pages/editprofile/editprofile';
import { MainHomePage } from '../pages/mainhome/mainhome';
import { SettingPage } from '../pages/setting/setting';
import { UserProfilePage } from '../pages/userprofile/userprofile';
import { VendorregisterPage } from '../pages/vendorregister/vendorregister';
import { HowitworksPage } from '../pages/howitworks/howitworks';
import { GoogleMapPage, PopoverPage} from '../pages/googlemap/googlemap';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from 'ionic-native';
import { HttpModule } from '@angular/http';
import { AngularFireModule} from 'angularfire2';
import * as GeoFire from "geofire";
import {ForgotpassPage } from '../pages/forgotpass/forgotpass';
import {RecoverpassPage } from '../pages/recoverpass/recoverpass';
import {MainscreenPage } from '../pages/mainscreen/mainscreen';

var firebaseConfig = {
    apiKey: "AIzaSyAOHcD8KwzFRtdnnK9obtKGARTwMrBXW_M",
    authDomain: "iscreamyay-88ef1.firebaseapp.com",
    databaseURL: "https://iscreamyay-88ef1.firebaseio.com",
    projectId: "iscreamyay-88ef1",
    storageBucket: "iscreamyay-88ef1.appspot.com",
    messagingSenderId: "42399741180"
  };



@NgModule({
  declarations: [
    MyApp,
    HomePage,
    FbPage,
    EditProfilepage,
    MainHomePage,
    SettingPage,
    UserProfilePage,
    VendorregisterPage,
    GoogleMapPage,
    PopoverPage,
    HowitworksPage,
    CurrentPage,
    ForgotpassPage,
    RecoverpassPage,
    MainscreenPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp, { animate: false }),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp(firebaseConfig),
  ],
  
 exports: [IonicModule],  
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    FbPage,
  EditProfilepage,
  MainHomePage,
  SettingPage,
  UserProfilePage,
  VendorregisterPage,
  GoogleMapPage,
  PopoverPage,
  HowitworksPage,
  CurrentPage,
  ForgotpassPage,
  RecoverpassPage,
  MainscreenPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
