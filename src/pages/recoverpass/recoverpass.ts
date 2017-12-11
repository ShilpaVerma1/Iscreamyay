import { Component } from '@angular/core';
import { IonicPage,LoadingController, NavController, NavParams,MenuController,Platform } from 'ionic-angular';
import { FbPage } from '../fblog/fblog';
import {ForgotpassPage } from '../forgotpass/forgotpass';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

declare var window: any;

@IonicPage()
@Component({
  selector: 'page-recoverpass',
  templateUrl: 'recoverpass.html',
})
export class RecoverpassPage {
recover:any;
apiurl:string;
  constructor(public http:Http,public loadingCtrl:LoadingController,public platform:Platform,public navCtrl: NavController,public menu:MenuController,public navParams: NavParams) {
    this.apiurl="http://ec2-54-204-73-121.compute-1.amazonaws.com/ogo/iceCreamApi/";
    this.recover=[];
    this.recover.otp="";
    this.recover.password="";
    this.recover.conf_pass="";
  }
  recoverform(){
  let loading = this.loadingCtrl.create({
    cssClass:'spin',
    spinner: 'ios',
    content: 'Loading...'
  });
  loading.present();
    if( this.recover.password== this.recover.conf_pass && this.recover.otp!=''){
      this.http.get(this.apiurl+"recoverPassword?otp="+ this.recover.otp+"&password="+ this.recover.password).map(res =>res.json()).subscribe(data =>{
        this.recover=data;
      if(this.recover.status != "Failed"){
          loading.dismiss(); 
          this.platform.ready().then(() => {
            window.plugins.toast.show("Your password has been changed successfully", "short", 'center');
          });
          //alert("Password changed successfully");
          this.navCtrl.push(FbPage);
      }else{
        loading.dismiss(); 
        this.platform.ready().then(() => {
          window.plugins.toast.show("Please check your OTP and Password", "short", 'center');
        });
        //alert("Re-enter password");
      }
   }); 
 }else{
     loading.dismiss(); 
     this.platform.ready().then(() => {
        window.plugins.toast.show("Check all fields", "short", 'center');
      });
      //alert("Password doesn't match");
  }
  
 }
  backview(){
    this.navCtrl.push(ForgotpassPage);
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
