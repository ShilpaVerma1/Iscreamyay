import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,MenuController,Platform } from 'ionic-angular';
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
  constructor(public http:Http,public platform:Platform,public navCtrl: NavController,public menu:MenuController,public navParams: NavParams) {
    this.recover=[];
    this.recover.otp="";
    this.recover.password="";
    this.recover.conf_pass="";
  }
  recoverform(){
    if( this.recover.password== this.recover.conf_pass){
      this.http.get("http://192.169.146.6/ogo/iceCreamApi/recoverPassword?otp="+ this.recover.otp+"&password="+ this.recover.password).map(res =>res.json()).subscribe(data =>{
        this.recover=data;
      if(this.recover.status != "Failed"){
            this.platform.ready().then(() => {
            window.plugins.toast.show("Your password has been changed successfully", "short", 'center');
          });
          //alert("Password changed successfully");
          this.navCtrl.push(FbPage);
      }else{
        this.platform.ready().then(() => {
          window.plugins.toast.show("Please check your OTP and Password", "short", 'center');
        });
        //alert("Re-enter password");
    }
    });
 }else{
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
