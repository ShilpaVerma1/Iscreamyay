import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MainHomePage } from '../mainhome/mainhome';
import {VehicleformPage } from '../vehicleform/vehicleform';
import { UserProfilePage } from '../userprofile/userprofile';
import { GoogleMapPage} from '../googlemap/googlemap';

@IonicPage()
@Component({
  selector: 'page-userstatus',
  templateUrl: 'userstatus.html',
})
export class UserstatusPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

home(){
  this.navCtrl.push(MainHomePage);
}
vehicleinfo(){
  this.navCtrl.push(VehicleformPage);
}
go(){
    this.navCtrl.push(GoogleMapPage); 
}
profile(){
    this.navCtrl.push(UserProfilePage);
}
}
