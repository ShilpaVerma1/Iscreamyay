import { Component } from '@angular/core';
import { NavController, Platform,MenuController, LoadingController} from 'ionic-angular';
import { UserProfilePage } from '../userprofile/userprofile';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';
import { Storage } from '@ionic/storage';
import {MainHomePage } from '../mainhome/mainhome';

declare var window: any;
@Component({
  selector: 'page-editprofile',
  templateUrl: 'editprofile.html'
})
export class EditProfilepage {
data:any;
upImage:any;
usrrid:any;
profile:any={};
usrrrid:any;
typeuser:any;
apiurl:any;
codes:any;
states:any;
mail:any;
  constructor(public navCtrl: NavController,public menu:MenuController, private http: Http, private storage: Storage, public platform: Platform, private loadingCtrl: LoadingController ) {
       this.apiurl="http://ec2-54-204-73-121.compute-1.amazonaws.com/ogo/iceCreamApi/";

     Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
     Network.onConnect().subscribe(()=> {

     });

this.storage.get('userid').then((userid) => {
  this.usrrrid = userid;
  this.http.get(this.apiurl+"getProfile?userid="+this.usrrrid).map(res =>res.json()).subscribe(data =>{
    this.profile= data; 
        if(this.profile.email=='undefined' || this.profile.email==''){
            this.mail='';
        }
        if(this.profile.email!='undefined'){
            this.mail=this.profile.email;
        }
    this.http.get(this.apiurl+"getCityByCountry?country_id=" +this.profile.country_id).map(res =>res.json()).subscribe(data =>{
        this.states = data;
    
    })
  })
})
this.http.get(this.apiurl+"getCountries").map(res =>res.json()).subscribe(data =>{
  this.codes = data;
 
})
}
Change(SelectedValue){
  
}
 onChange(SelectedValue){
    this.http.get(this.apiurl+"getCityByCountry?country_id=" +SelectedValue).map(res =>res.json()).subscribe(data =>{
      this.states = data;
    
    })
 }
update(name,email,country,ph_no,state){
   this.storage.get('logintype').then((logintype) => {
      this.typeuser = logintype;
      this.storage.get('userid').then((userid) => {
      this.usrrid = userid;
        let loadingPopup = this.loadingCtrl.create({
          content: 'Loading...',
          spinner:'ios'
        });
    loadingPopup.present(); 
    this.http.get(this.apiurl+"editProfile?userid="+this.usrrid+"&fname="+name+"&email="+email+"&phone="+ph_no+"&state="+state+"&country_code="+country+"&type="+this.typeuser).map(res =>res.json()).subscribe(data =>{
       setTimeout(() => {
        this.upImage =data;
        loadingPopup.dismiss();   
          if(this.upImage.status == "Success"){
             // alert("Your profile has been successfully updated");
              window.plugins.toast.show("Your profile has been successfully updated", "long", "center");
              this.navCtrl.push(MainHomePage);
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

back(){
  this.navCtrl.push(MainHomePage);
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
