import { Component,Injectable } from '@angular/core';
import { NavController, Platform,MenuController, NavParams} from 'ionic-angular';
import { UserProfilePage } from '../userprofile/userprofile';
import { SettingPage } from '../setting/setting';
import { HowitworksPage } from '../howitworks/howitworks';
import { Storage } from '@ionic/storage';
import { Network } from 'ionic-native';
import { Http } from '@angular/http';
import { Geolocation } from 'ionic-native';
import { GoogleMapPage} from '../googlemap/googlemap';
import {BecomevendorPage } from '../becomevendor/becomevendor';
import firebase from 'firebase';
import{AngularFire} from 'angularfire2';
import * as GeoFire from "geofire";
import {FaqPage } from '../faq/faq';

declare var window: any;
@Component({
  selector: 'page-mainhome',
  templateUrl: 'mainhome.html',

})
export class MainHomePage {
UserProfilePage = UserProfilePage;
SettingPage = SettingPage;
HowitworksPage: any;
BecomevendorPage:any;
usrid:any;
Name:any;
Email:any;
response:any;
img:any;
fbt:any;
af:any;
userref:any;
devicenotid:any;
temperature:any;
weathericon:any;
usrname:any;
weather:any;
apiurl:string;
ngOnInit(){
 this.apiurl="http://ec2-54-204-73-121.compute-1.amazonaws.com/ogo/iceCreamApi/";

     this.fbt=this.navParams.get('type');
     if(this.fbt == 'facebook' ){
          this.storage.get('usrname').then((usrname) => {
              this.usrname = usrname;  
          })
      }
      if(this.fbt=='google'){
        this.storage.get('usrname').then((usrname) => {
          this.usrname = usrname;  
        })
      }
      if(this.fbt=='default'){
        this.storage.get('usrname').then((usrname) => {
          this.usrname = usrname;  
        })
      }

}
constructor(public navCtrl: NavController,private http:Http,public menu:MenuController, private storage: Storage, public platform:Platform, private navParams:NavParams) {
 this.apiurl="http://ec2-54-204-73-121.compute-1.amazonaws.com/ogo/iceCreamApi/";

   Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
     Network.onConnect().subscribe(()=> {
     
     });
  
    clearInterval(this.navParams.get('watchid'));
      Geolocation.getCurrentPosition().then((resp) => {
        var currlat=resp.coords.latitude;
        var currlng=resp.coords.longitude;
          this.http.get("http://api.openweathermap.org/data/2.5/weather?lat="+currlat+"&lon="+currlng+"&APPID=c39cf4533471f7937f1bf78089d724ba&units=imperial").map(res =>res.json()).subscribe(data =>{
            this.temperature=data.main.temp;
            this.weathericon="http://openweathermap.org/img/w/"+data.weather[0].icon+'.png';
            this.weather=data.weather[0].description;
            
          }) 
      })
    
    this.storage.get('userid').then((userid) => {
      this.usrid = userid;

        this.http.get(this.apiurl+"getProfile?userid="+ this.usrid).map(res =>res.json()).subscribe(data =>{
          this.usrname=data.firstname;
      })
     })
 
}

profile(){
  this.navCtrl.push(UserProfilePage);
}
setting(){
  this.navCtrl.push(SettingPage);
}
goomap(){
  this.navCtrl.push(GoogleMapPage);
}
works(){
  this.navCtrl.push(HowitworksPage);
}
becomevendor(){
  this.navCtrl.push(BecomevendorPage);
}
faq(){
  this.navCtrl.push(FaqPage)
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
