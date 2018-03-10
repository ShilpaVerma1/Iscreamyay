import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MainHomePage } from '../mainhome/mainhome';
import {UserstatusPage } from '../userstatus/userstatus';
import { UserProfilePage } from '../userprofile/userprofile';
import { GoogleMapPage} from '../googlemap/googlemap';

@IonicPage()
@Component({
  selector: 'page-vehicleform',
  templateUrl: 'vehicleform.html',
})
export class VehicleformPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

home(){
  this.navCtrl.push(MainHomePage);
}
status(){
    this.navCtrl.push(UserstatusPage);
}
profile(){
    this.navCtrl.push(UserProfilePage);
}
go(){
    this.navCtrl.push(GoogleMapPage); 
}
}
