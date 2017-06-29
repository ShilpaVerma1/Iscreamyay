import { Component } from '@angular/core';
import { NavController, Platform,MenuController, NavParams} from 'ionic-angular';
import { Facebook, NativeStorage } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { MainHomePage } from '../mainhome/mainhome';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';

declare var window: any;

@Component({
  selector: 'page-fbreg',
  templateUrl: 'fbreg.html'
})
export class FbRegPage {
MainHomePage = MainHomePage;
Name:any;
Email:any;
response:any;
img:any;
fbt:any;
  constructor(public navCtrl: NavController,public menu:MenuController,private storage: Storage, private http:Http, public platform: Platform, private navParams:NavParams) {
   this.fbt=this.navParams.get('type');

Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
     Network.onConnect().subscribe(()=> {
      // this.platform.ready().then(() => {
      //    window.plugins.toast.show("You are online", "long", "center");
      //   });
     });


if(this.fbt == 'facebook' ){
  this.storage.set("logintype",'facebook');
  this.Name=this.navParams.get('name');
  this.img = this.navParams.get('picture');
  this.Email=this.navParams.get('email');  
    var uid = this.navParams.get('usrid');
   this.http.get("http://192.169.146.6/ogo/iceCreamApi/fbLogin?name="+this.Name+"&email="+this.Email+"&type="+this.fbt+ "&fbuserid="+uid+ "&img=" +this.img).map(res =>res.json()).subscribe(data => {
        this.response = data;    
          this.storage.set("userid",this.response.id);  
       });   
}
 
  }
  fbcontinue(){
    this.navCtrl.push(MainHomePage)
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
