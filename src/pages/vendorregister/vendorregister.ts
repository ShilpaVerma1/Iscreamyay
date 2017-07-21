import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, Platform, LoadingController} from 'ionic-angular';
import { HomePage} from '../home/home';
import { FbPage} from '../fblog/fblog';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';
import 'rxjs/add/operator/map';
import{AngularFire,FirebaseListObservable} from 'angularfire2';
import firebase from 'firebase';
import { Geolocation } from 'ionic-native';

declare var window: any;

@Component({
  selector: 'page-vendorregister',
  templateUrl: 'vendorregister.html'
})
export class VendorregisterPage {
HomePage :any;
FbPage:any;
regsterform: any;
codes:any;
states:any;
userref:any;
af:any;

  constructor(af:AngularFire,public navCtrl: NavController,public loadingCtrl:LoadingController, private platform: Platform,public menu: MenuController, public navParams: NavParams,private http: Http) {
    this.af=af;

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

this.regsterform = [];
this.regsterform.firstname="";
this.regsterform.lastname="";
this.regsterform.email="";
this.regsterform.password="";
this.regsterform.confirmPassword="";
this.regsterform.phone="";
this.regsterform.countrycode="";
this.regsterform.stats="";
//this.netprovider;

this.http.get("http://192.169.146.6/ogo/iceCreamApi/getCountries").map(res =>res.json()).subscribe(data =>{
this.codes = data;
 
})
}

 onChange(SelectedValue){
 this.http.get("http://192.169.146.6/ogo/iceCreamApi/getCityByCountry?country_id=" +SelectedValue).map(res =>res.json()).subscribe(data =>{
  this.states = data;
 
})
}
Change(SelectedValue){

}

register(){
  let loading = this.loadingCtrl.create({
    cssClass:'spin',
    spinner: 'ios',
    content: 'Loading...'
  });
  loading.present(); 
  if(this.regsterform.firstname != "" && this.regsterform.lastname != "" && this.regsterform.email !="" && this.regsterform.password != "" && this.regsterform.confirmPassword != "" && this.regsterform.phone != "" && this.regsterform.countrycode != "" && this.regsterform.stats != ""){
    if(this.regsterform.password == this.regsterform.confirmPassword){

  this.http.get("http://192.169.146.6/ogo/iceCreamApi/signup?firstname="+this.regsterform.firstname+"&lastname="+this.regsterform.lastname+"&email="+this.regsterform.email+"&password="+this.regsterform.password+"&phone_number="+this.regsterform.phone+"&city="+this.regsterform.stats+"&country_code="+this.regsterform.countrycode).map(res =>res.json()).subscribe(data =>{
  this.regsterform = data;
  
  if(this.regsterform.status != "Failed"){
  //alert("Check your email for completing registeration.");
    loading.dismiss();
    window.plugins.toast.show("You are successfully registered","long","center");
    this.navCtrl.push(FbPage);
  }else{
//alert("You have already registered");
loading.dismiss();
window.plugins.toast.show("You have already registered","long","center");
this.navCtrl.setRoot(this.navCtrl.getActive().component);
  }
 
})
  }else{
 loading.dismiss();
 window.plugins.toast.show("Password doesn't match","long","center");
  //alert("Password doesn't match");
    this.regsterform.password="";
    this.regsterform.confirmPassword="";
  }
  }
  else{
    loading.dismiss();
    //alert("All fields are mendatory to fill");
    window.plugins.toast.show("All fields are mendatory to fill","long","center");
  }
  
}
back()
{
  this.navCtrl.push(FbPage);
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
