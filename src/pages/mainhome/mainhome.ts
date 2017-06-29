import { Component,Injectable } from '@angular/core';
import { NavController, Platform,MenuController, NavParams} from 'ionic-angular';
import { UserProfilePage } from '../userprofile/userprofile';
import { EventPage } from '../event/event';
import { SettingPage } from '../setting/setting';
import { HowitworksPage } from '../howitworks/howitworks';
import { Storage } from '@ionic/storage';
import { Network } from 'ionic-native';
import { Http } from '@angular/http';
import firebase from 'firebase';
import { Geolocation } from 'ionic-native';
import{AngularFire,FirebaseListObservable} from 'angularfire2';

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
                if(this.response.uid!=0){
                  this.storage.set("userid",this.response.uid);  
                  this.storage.get('userid').then((userid) => {
                    this.usrid = userid;   
                 
                    navigator.geolocation.getCurrentPosition(position => {
                    var lat = position.coords.latitude;
                    var lng = position.coords.longitude;
      
                    this.userref = this.af.database.list('/Drivers/'+ this.usrid); 
                      this.userref.push({
                          latitude:lat,
                          longitude:lng,
                      });
                  })
                   this.storage.get('deviceid').then((deviceid) => {
                      this.devicenotid = deviceid;
                        this.http.get("http://192.169.146.6/ogo/iceCreamApi/saveToken?token="+this.devicenotid+"&userid="+this.usrid).map(res =>res.json()).subscribe(data =>{
                      })  
                    })

                })       
              }else
              {
                   this.storage.set("userid",this.response.id);  
                    this.storage.get('userid').then((userid) => {
                      this.usrid = userid;   
                       this.storage.get('deviceid').then((deviceid) => {
                        this.devicenotid = deviceid;
                          this.http.get("http://192.169.146.6/ogo/iceCreamApi/saveToken?token="+this.devicenotid+"&userid="+this.usrid).map(res =>res.json()).subscribe(data =>{
                        })  
                      })
                    })
              }
                         
      });   
    }
}
constructor(af:AngularFire,public navCtrl: NavController, private http:Http,public menu:MenuController, private storage: Storage, public platform:Platform, private navParams:NavParams) {
   this.af=af;
   
    Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
     Network.onConnect().subscribe(()=> {
     
     });

}
  
profile(){
  this.navCtrl.push(UserProfilePage);
}
setting(){
  this.navCtrl.push(SettingPage);
}
goomap(){
  this.navCtrl.push(EventPage);
}
works(){
  this.navCtrl.push(HowitworksPage);
}

ionViewDidEnter() {
    //to disable menu, or
    this.menu.enable(false);
    // console.log( JSON.stringify(this.rawlist));
    // console.log( this.rawlist.length);
  }

  ionViewWillLeave() {
    // to enable menu.
    this.menu.enable(true);
  }

}
