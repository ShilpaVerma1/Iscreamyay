import { Component } from '@angular/core';
import { NavController, Platform, NavParams,MenuController} from 'ionic-angular';
import { Facebook, NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { MainHomePage } from '../mainhome/mainhome';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';
import firebase from 'firebase';
import { Geolocation } from 'ionic-native';
import{AngularFire,FirebaseListObservable} from 'angularfire2';
declare var window: any;

@Component({
  selector: 'page-googlereg',
  templateUrl: 'googlereg.html'
})
export class GoogleRegPage {
Name:any;
Email:any;
response:any;
img:any;
googlet:any;
MainHomePage = MainHomePage;
userref:any;
af:any;
usrid:any;
devicenotid:any;
constructor(af:AngularFire,public navCtrl: NavController,public menu:MenuController, private storage: Storage, private http:Http, public platform: Platform, private navParams:NavParams) {
    this.googlet=this.navParams.get('type');
    this.af=af;

    Network.onDisconnect().subscribe(() => {
          this.platform.ready().then(() => {
              window.plugins.toast.show("You are offline", "long", "center");
            });

        });
     Network.onConnect().subscribe(()=> {
     
     });
  if(this.googlet == 'google'){
    this.storage.set("logintype",'google');
      this.Name=this.navParams.get('name');
      this.Email=this.navParams.get('email');
      this.img=this.navParams.get('picture');
      this.http.get("http://192.169.146.6/ogo/iceCreamApi/googleLogin?name="+this.Name+"&email="+ this.Email+"&type="+this.googlet+"&img="+this.img).map(res =>res.json()).subscribe(data => {
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
                  
     })  
  }
}
  googlecontinue(){
    this.navCtrl.push(MainHomePage,{

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
