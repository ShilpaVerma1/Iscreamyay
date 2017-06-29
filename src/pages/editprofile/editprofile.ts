import { Component } from '@angular/core';
import { NavController, Platform,MenuController, LoadingController} from 'ionic-angular';
import { MainHomePage } from '../mainhome/mainhome';
import { UserProfilePage } from '../userprofile/userprofile';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';
import { Storage } from '@ionic/storage';

declare var window: any;
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html'
})
export class EditProfilepage {
MainHomePage = MainHomePage;
data:any;
upImage:any;
usrrid:any;
profile:any={};
usrrrid:any;
typeuser:any;

  constructor(public navCtrl: NavController,public menu:MenuController, private http: Http, private storage: Storage, public platform: Platform, private loadingCtrl: LoadingController ) {
     Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
     Network.onConnect().subscribe(()=> {

     });

this.storage.get('userid').then((userid) => {
  this.usrrrid = userid;
  this.http.get("http://192.169.146.6/ogo/iceCreamApi/getProfile?userid="+ this.usrrrid).map(res =>res.json()).subscribe(data =>{
    this.profile= data; 
  })
})

}

update(fname,lname,ph_no,email){
   this.storage.get('logintype').then((logintype) => {
      this.typeuser = logintype;
     
      this.storage.get('userid').then((userid) => {
      this.usrrid = userid;
        let loadingPopup = this.loadingCtrl.create({
          content: ''
        });
    loadingPopup.present(); 
    this.http.get("http://192.169.146.6/ogo/iceCreamApi/editProfile?userid="+this.usrrid+"&fname="+fname+"&lname="+lname+"&email=" +email+"&phone="+ph_no+"&type="+this.typeuser).map(res =>res.json()).subscribe(data =>{
       setTimeout(() => {
        this.upImage =data;
        loadingPopup.dismiss();   
          if(this.upImage.status == "Success"){
              //alert("Your profile has been successfully updated");
              window.plugins.toast.show("Your profile has been successfully updated", "long", "center");
              this.navCtrl.push(UserProfilePage);
          }else{
             //alert("This email id already registered");
            window.plugins.toast.show("This email id already registered", "long", "center");
                   this.navCtrl.push(UserProfilePage);
          }
      }, 1000);
    })     
  })
   })
}

backpage(){
  this.navCtrl.push(UserProfilePage);
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
