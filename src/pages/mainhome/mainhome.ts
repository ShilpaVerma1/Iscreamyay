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
          // this.storage.set("logintype",'facebook');
          // this.Name=this.navParams.get('name');
          // this.img = this.navParams.get('picture');
          // this.Email=this.navParams.get('email');  
          // var uid = this.navParams.get('usrid');
          // this.storage.set("usrname",this.Name);
          this.storage.get('usrname').then((usrname) => {
              this.usrname = usrname;  
          })
          // this.http.get(this.apiurl+"fbLogin?name="+this.Name+"&email="+this.Email+"&type="+this.fbt+ "&fbuserid="+uid+ "&img=" +this.img).map(res =>res.json()).subscribe(data => {
          //       this.response = data;
          //          this.storage.set("userid",this.response.id); 
          //     this.storage.get('currlat').then((currlat)=>{
          //     this.storage.get('currlng').then((currlng)=>{

          //           var firebaseRef = firebase.database().ref('/Drivers/Profiles');
          //           var geoFire = new GeoFire(firebaseRef);
          //           geoFire.set(this.response.id, [currlat,currlng]).then(function() {
                        
          //           }, function(error) {
                    
          //           });
          //       })
          //     })      
          //     this.storage.get('userid').then((userid) => {
          //       this.usrid = userid;   
          //         this.storage.get('deviceid').then((deviceid) => {
          //           this.devicenotid = deviceid;
          //             this.http.get(this.apiurl+"saveToken?token="+this.devicenotid+"&userid="+this.usrid).map(res =>res.json()).subscribe(data =>{
          //             })  
          //         })
          //     })          
          // });   
      }
    if(this.fbt=='google'){
      // this.storage.set("logintype",'google');
      // this.Name=this.navParams.get('name');
      // this.Email=this.navParams.get('email');
      // this.img=this.navParams.get('picture');
      // this.storage.set("usrname",this.Name);
      this.storage.get('usrname').then((usrname) => {
              this.usrname = usrname;  
      })
      // this.http.get(this.apiurl+"googleLogin?name="+this.Name+"&email="+ this.Email+"&type="+this.fbt+"&img="+this.img).map(res =>res.json()).subscribe(data => {
      //   this.response = data;
      //      this.storage.set("userid",this.response.id); 
      //       this.storage.get('currlat').then((currlat)=>{
      //         this.storage.get('currlng').then((currlng)=>{

      //               var firebaseRef = firebase.database().ref('/Drivers/Profiles');
      //               var geoFire = new GeoFire(firebaseRef);
      //               geoFire.set(this.response.id, [currlat,currlng]).then(function() {
                        
      //               }, function(error) {
                    
      //               });
      //           })
      //         })    
          //  this.storage.get('userid').then((userid) => {
          //     this.usrid = userid;  
          //       this.storage.get('deviceid').then((deviceid) => {
          //         this.devicenotid = deviceid;
          //           this.http.get(this.apiurl+"saveToken?token="+this.devicenotid+"&userid="+this.usrid).map(res =>res.json()).subscribe(data =>{

          //           })  
          //        })
          //    })         
      // }) 
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
    
    var firebaseRef = firebase.database().ref('/Drivers/Profiles');
    var geoFire = new GeoFire(firebaseRef);
        geoFire.set( this.usrid , [0,0]).then(function() {
         }, function(error) {
    });   
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
