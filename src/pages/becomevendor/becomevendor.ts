import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {MainHomePage } from '../mainhome/mainhome';


@IonicPage()
@Component({
  selector: 'page-becomevendor',
  templateUrl: 'becomevendor.html',
})
export class BecomevendorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }
Backtohome(){
  this.navCtrl.push(MainHomePage);
}

}
