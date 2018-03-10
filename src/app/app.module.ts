import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { FbPage } from '../pages/fblog/fblog';
import { CurrentPage } from '../pages/currentpage/currentpage';
import { EditProfilepage } from '../pages/editprofile/editprofile';
import { SettingPage } from '../pages/setting/setting';
import { UserProfilePage } from '../pages/userprofile/userprofile';
import { VendorregisterPage } from '../pages/vendorregister/vendorregister';
import { HowitworksPage } from '../pages/howitworks/howitworks';
import { GoogleMapPage, PopoverPage} from '../pages/googlemap/googlemap';
import {ForgotpassPage } from '../pages/forgotpass/forgotpass';
import {RecoverpassPage } from '../pages/recoverpass/recoverpass';
import {BecomevendorPage } from '../pages/becomevendor/becomevendor';
import {MainscreenPage } from '../pages/mainscreen/mainscreen';
import {MainHomePage } from '../pages/mainhome/mainhome';
import {UserstatusPage } from '../pages/userstatus/userstatus';
import {VehicleformPage } from '../pages/vehicleform/vehicleform';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';
import { Geolocation } from 'ionic-native';
import { HttpModule } from '@angular/http';
import { AngularFireModule} from 'angularfire2';
import * as GeoFire from "geofire";
import {FaqPage } from '../pages/faq/faq';
import { Diagnostic } from '@ionic-native/diagnostic';

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
    SettingPage,
    UserProfilePage,
    VendorregisterPage,
    GoogleMapPage,
    PopoverPage,
    HowitworksPage,
    CurrentPage,
    ForgotpassPage,
    RecoverpassPage,
    MainscreenPage,
    BecomevendorPage,
    FaqPage,VehicleformPage,
    MainHomePage,UserstatusPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
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
  SettingPage,
  UserProfilePage,
  VendorregisterPage,
  GoogleMapPage,
  PopoverPage,
  HowitworksPage,
  CurrentPage,
  ForgotpassPage,
  RecoverpassPage,
  MainscreenPage,
  BecomevendorPage,
  FaqPage,VehicleformPage,
  MainHomePage,UserstatusPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,Diagnostic,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
