import { Component } from '@angular/core';
import {  NavController,LoadingController, NavParams,MenuController,Platform,AlertController,IonicPage} from 'ionic-angular';
import { FbPage } from '../fblog/fblog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';
import {Observable} from 'rxjs/Rx';
import {RecoverpassPage } from '../recoverpass/recoverpass';

declare var window: any;
@IonicPage()
@Component({
  selector: 'page-forgotpass',
  templateUrl: 'forgotpass.html',
})
export class ForgotpassPage {
 ForgetForm: FormGroup;
 errorMsg:any;
 response:any;
 apiurl:string;
  constructor(public navCtrl: NavController,public loadingCtrl:LoadingController,public platform:Platform,private storage: Storage,public http:Http,public alert:AlertController, public formBuilder: FormBuilder,public menu:MenuController, public navParams: NavParams) {
  this.apiurl="http://ec2-54-204-73-121.compute-1.amazonaws.com/ogo/iceCreamApi/";

     Observable.interval(30000).subscribe(x => {
        this.errorMsg='';
     })
  this.ForgetForm = formBuilder.group({
        email:['',Validators.compose([Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'), Validators.required])]
    });
   
}
validate(): boolean {
    if (this.ForgetForm.valid) {
      return true;
    }
     let control = this.ForgetForm.controls['email'];
    if (!control.valid) {
      if (control.errors['required']) {   
            this.errorMsg = 'This field is mandatory to be filled.';    
      } else if (control.errors['pattern']) {
        this.errorMsg = 'Enter valid email id here';
      }else{
         this.errorMsg = '';
      }
    }
    return false;
}
 submit(Email) {
    if (this.validate()) {
        let loading = this.loadingCtrl.create({
          cssClass:'spin',
          spinner: 'ios',
          content: 'Loading...'
        });
        loading.present(); 
    this.http.get(this.apiurl+"verifyEmail?email="+Email).map(res =>res.json()).subscribe(data =>{

    this.response=data;
    this.storage.set("otp",this.response.otp);
          if(this.response.success == "Sucess"){
            this.platform.ready().then(() => {
              loading.dismiss();

              this.navCtrl.push(RecoverpassPage);

              window.plugins.toast.show("Check your email id", "long", 'center');
            });

           //alert("Check your email id");
          }else{
             loading.dismiss();
             this.platform.ready().then(() => {
              window.plugins.toast.show("Enter valid email id", "long", 'center');
            });

          }
        })
    }
 }
  backview(){
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
