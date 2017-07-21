import { Component } from '@angular/core';
import { NavController,MenuController } from 'ionic-angular';
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import {MainHomePage } from '../mainhome/mainhome';
import {BecomevendorPage } from '../becomevendor/becomevendor';

declare var window: any;
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'

})
export class SettingPage {
  HomePage: any;
  changepass: any;
  dataa: any = {};
  usrrid: any;
  sound_status:any;
  noti_status:any;
  usrid:any;
  data: Array<{ title: string, id: number, details: string, img: string, cssClass: string,showDetails: boolean }> = [];

constructor(public navCtrl: NavController,public menu:MenuController, private storage: Storage, private http: Http) {
   this.storage.get('soundstatus').then((soundstatus) => {
      this.sound_status=soundstatus; 
   })
  this.storage.get('notificstatus').then((notificstatus) => {
        this.noti_status=notificstatus; 
   })
  this.storage.get('user_detail').then((user_detail) => {
    this.usrid= user_detail.id;
    
  })
    
    for (let i = 0; i < 4; i++) {
      if (i == 0) {

        this.data.push({
          img: 'img/i1.png',
          title: 'Sound',
          id: i,
          details: 'Sound',
          cssClass:'btn-profile',
          showDetails: false,

        });
      }
      if (i == 1) {
        this.data.push({
          img: 'img/i2.png',
          cssClass:'btn-profile',
          title: 'Create new Password',
          id: i,
          details: 'password',
   
          showDetails: false
        })
      } if (i == 2) {
        this.data.push({
           img: 'img/i3.png',
            cssClass:'btn-profile',
          title: 'Become a Vendor',
          id: i,
          details: 'vendor',
          showDetails: false
        })
      }
      if (i == 3) {
        this.data.push({
          img: 'img/i4.png',
           cssClass:'btn-profile',
          title: 'Log Out',
          id: i,
          details: 'logout',
          showDetails: false,
        })
      }

    }

  }

  notify_music(a){
      this.http.get("http://192.169.146.6/ogo/iceCreamApi/changeNotiSound?user_id="+this.usrid+"&sound_status="+a).map(res => res.json()).subscribe(data => {
        this.sound_status=a;
        if(data.status=='Success'){
            this.storage.set('soundstatus',this.sound_status);
        }
      })
  }

 notify(a){
     this.http.get("http://192.169.146.6/ogo/iceCreamApi/changeNotiStatus?user_id="+this.usrid+"&noti_status="+a).map(res => res.json()).subscribe(data => {
        console.log(data);
         this.noti_status=a;
         if(data.status=='Success'){
           this.storage.set('notificstatus',this.noti_status)
         }
    })
  }


  toggleDetails(data) {
    var curid = data.id;
    for (let i = 0; i < 4; i++) {
      if (this.data[i] != curid) {
        this.data[i].showDetails = false;
      }
    }
    if (data.showDetails) {
      data.showDetails = false;
      data.img = data.img;
    } else {

      data.showDetails = true;
      data.img = data.img;
    }
    if(data.details=='vendor'){
      this.navCtrl.push(BecomevendorPage);
    }
  }

  updatepass(curntpass, newpass, confnewpass) {
    this.storage.get('userid').then((userid) => {
      this.usrrid = userid;
      if (newpass == confnewpass) {

        this.http.get("http://192.169.146.6/ogo/iceCreamApi/changePassword?user_id=" + this.usrrid + "&currentPasswd=" + curntpass + "&newPasswd=" + newpass + "&confPasswd=" + confnewpass).map(res => res.json()).subscribe(data => {
          this.changepass = data;
          if (this.changepass.status == "Success") {
            //alert("Your updation submitted successfully");
            window.plugins.toast.show("Your updation submitted successfully","long","center");
            this.navCtrl.setRoot(this.navCtrl.getActive().component);
          }
          else {
            if(this.changepass.msg == "Invalid Current Password")
            {
                //alert("Your current password is invalid");
                window.plugins.toast.show("Your current password is invalid","long","center");
            }
            else{
              //alert("invalid");
              window.plugins.toast.show("invalid","long","center");

            }            
          }
        })

      } else {
          //alert("confirm password not matched");
          window.plugins.toast.show("confirm password not matched","long","center");
      }
    
    })
  }
  backpage() {
    this.navCtrl.push(MainHomePage);
  }
 notlogout(){
   this.navCtrl.push(MainHomePage);
 }
  logout() {
    this.storage.clear();
    this.storage.set("userid",'');
    this.navCtrl.push(HomePage);
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
