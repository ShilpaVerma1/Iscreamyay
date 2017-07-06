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
import {MainscreenPage } from '../mainscreen/mainscreen';

declare var window: any;
@Component({
  selector: 'page-mainhome',
  templateUrl: 'mainhome.html',

})
export class MainHomePage {
UserProfilePage = UserProfilePage;
SettingPage = SettingPage;
HowitworksPage: any;
usrid:any;
Name:any;
Email:any;
response:any;
img:any;
fbt:any;
af:any;
userref:any;
devicenotid:any;

ngOnInit(){
     this.fbt=this.navParams.get('type');
     if(this.fbt == 'facebook' ){
          this.storage.set("logintype",'facebook');
          this.Name=this.navParams.get('name');
          this.img = this.navParams.get('picture');
          this.Email=this.navParams.get('email');  
          var uid = this.navParams.get('usrid');
          this.http.get("http://192.169.146.6/ogo/iceCreamApi/fbLogin?name="+this.Name+"&email="+this.Email+"&type="+this.fbt+ "&fbuserid="+uid+ "&img=" +this.img).map(res =>res.json()).subscribe(data => {
                this.response = data;
                   this.storage.set("userid",this.response.id);  
                    this.storage.get('userid').then((userid) => {
                      this.usrid = userid;   
                       this.storage.get('deviceid').then((deviceid) => {
                        this.devicenotid = deviceid;
                          this.http.get("http://192.169.146.6/ogo/iceCreamApi/saveToken?token="+this.devicenotid+"&userid="+this.usrid).map(res =>res.json()).subscribe(data =>{
                        })  
                      })
              })          
      });   
    }
    if(this.fbt=='google'){
      this.storage.set("logintype",'google');
      this.Name=this.navParams.get('name');
      this.Email=this.navParams.get('email');
      this.img=this.navParams.get('picture');
      this.http.get("http://192.169.146.6/ogo/iceCreamApi/googleLogin?name="+this.Name+"&email="+ this.Email+"&type="+this.fbt+"&img="+this.img).map(res =>res.json()).subscribe(data => {
        this.response = data;
           this.storage.set("userid",this.response.id);  
           this.storage.get('userid').then((userid) => {
              this.usrid = userid;  
                this.storage.get('deviceid').then((deviceid) => {
                  this.devicenotid = deviceid;
                    this.http.get("http://192.169.146.6/ogo/iceCreamApi/saveToken?token="+this.devicenotid+"&userid="+this.usrid).map(res =>res.json()).subscribe(data =>{

                    })  
                 })
             })         
       }) 
    }
}
constructor(public navCtrl: NavController, private http:Http,public menu:MenuController, private storage: Storage, public platform:Platform, private navParams:NavParams) {
   
    Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
     Network.onConnect().subscribe(()=> {
     
     });
//  this.http.get("http://api.openweathermap.org/data/2.5/weather?q=Mohali&APPID=c39cf4533471f7937f1bf78089d724ba").map(res =>res.json()).subscribe(data =>{
//    console.log(data);
//   })  
  //http://api.openweathermap.org/data/2.5/weather?lat=30.7046&lon=76.7179&APPID=c39cf4533471f7937f1bf78089d724ba&units=metric
}
hometst(){
  this.navCtrl.push(MainscreenPage);
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

ionViewDidEnter() {
    //to disable menu, or
    this.menu.enable(false);
   
  }

  ionViewWillLeave() {
    // to enable menu.
    this.menu.enable(true);
  }

}
