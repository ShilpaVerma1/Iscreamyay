import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, ViewController,MenuController, NavParams, PopoverController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { MainHomePage } from '../mainhome/mainhome';
import { CurrentPage } from '../currentpage/currentpage';
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import{AngularFire} from 'angularfire2';
import * as GeoFire from "geofire";
import {MainscreenPage } from '../mainscreen/mainscreen';

declare var google;
declare var window: any;
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html'
})

export class GoogleMapPage {
  map: any;
  CurrentPage: any;
  response: any;
  lat: any;
  longt: any;
  length: any;
  infopopup: any;
  time: any;
  miles: any;
  usrid:any;
  userref:any;
  watchId:any;
  marker:any;
  af:any;
  constructor(af:AngularFire,public navCtrl: NavController, public menu: MenuController, private storage:Storage,public popoverCtrl: PopoverController, private navParams: NavParams, private geolocation: Geolocation, private platform: Platform, private http: Http) {
    var that=this;
    this.af=af;
    Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {

        window.plugins.toast.show("You are offline", "long", "center");
      });

    });
    Network.onConnect().subscribe(() => {
    
    });

  }
  ionViewDidLoad() {
    this.loadMap();
  }

loadMap() {

this.storage.get('userid').then((userid) => {
 this.usrid = userid;
    this.http.get("http://192.169.146.6/ogo/iceCreamApi/getEvent?userid="+this.usrid).map(res => res.json()).subscribe(data => {
      this.response = data;
      var options={enableHighAccuracy: true};
      this.length = data.length;
      Geolocation.getCurrentPosition(options).then((resp) => {
           var lat = resp.coords.latitude;
           var lng = resp.coords.longitude;
          
              let latLng = new google.maps.LatLng(lat, lng);
              let mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
              }
  let map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var firebaseRef = firebase.database().ref('/Drivers/Profiles');
  var geoFire = new GeoFire(firebaseRef);
  var geoQuery = geoFire.query({
      center: [lat,lng],
      radius:16.0934,
    })
/********Adding markers on Drivers position *********/
geoQuery.on("key_entered", function(key, location, distance) {  
        addDriversToMap(location);
});
/****Moves vehicles markers on the map when their location within the query changes****/
geoQuery.on("key_moved", function(key, location, distance) {
    if(that.marker){
      that.marker.setMap(null);
      addDriversToMap(location);
    }
});
geoQuery.on("key_exited", function(location) {

      if (location !== true) {
        geoQuery.cancel();
        that.marker.setMap(null);
      }
 });
var center=geoQuery.center();

/********Create a circle centered on the map************/
  var circle = new google.maps.Circle({
    strokeColor: "#D8D8D8",
    fillColor: "#B650FF",
    map: map,
    center:center,
    radius:16093,
  });
/**********Funtion for Creating multiple markers for drivers ***********/
function addDriversToMap(location){
    var LatLng = new google.maps.LatLng(location[0],location[1]);       
          that.marker = new google.maps.Marker({
            position: LatLng,
            map: map,
            icon: { url: 'http://2.mediaoncloud.com/Richa/icon7.png' },
          }); 
        circle.bindTo('center',that.marker, 'position');

}

 /**********Updating current location and save it to realtime DB***********/
         
          this.watchId = Geolocation.watchPosition();
          this.storage.set('watch',this.watchId);
            this.watchId.subscribe((data) => {
              var latt=data.coords.latitude;
              var long=data.coords.longitude;
              var firebaseRef = firebase.database().ref('/Drivers/Profiles');
              var geoFire = new GeoFire(firebaseRef);
              geoFire.set(this.usrid, [latt,long]).then(function() {
                  
              }, function(error) {
              
              });
          }) 
/*********Placing multiple markers for events************/ 
 
          if (this.response.status != "Failed") {
 
            for (var i = 0; i < this.length; i++) {

                    var data = this.response[i];
                    let latLng = new google.maps.LatLng(data.lat, data.longt);
                    // Creating a marker and putting it on the map
                    var markerr = new google.maps.Marker({
                      position: latLng,
                      map: map,
                      title: data.id,
                      icon: { url: 'http://2.mediaoncloud.com/Shilpa/desticon.png' }
                    });

                    var that = this;
                    google.maps.event.addListener(markerr, 'click', (function (markerr, data) {
                      return function () {
                        that.showdata(data);

                      }
                    })(markerr, data));
            }
          } 
       })
    })
  })  
} 
 showdata(eventdata) {
 
    Geolocation.getCurrentPosition().then((resp) => {
      var lat = resp.coords.latitude;
      var lng = resp.coords.longitude;
      // var lat=9.0765;
      // var lng=7.3986;
      this.http.get("http://maps.googleapis.com/maps/api/distancematrix/json?origins=" + lat + "," + lng + "&destinations=" + eventdata.lat + "," + eventdata.longt + "&language=en-EN&sensor=false").map(res => res.json()).subscribe(data => {
        var dis = data.rows[0].elements[0].distance.value;
        this.miles = dis * 1.60934;
        this.time = data.rows[0].elements[0].duration.text;
        let popover = this.popoverCtrl.create(PopoverPage, { eventid: eventdata, miles: this.miles, time: this.time });

        popover.present({
          ev: PopoverPage
        });
      })
    })
  }

  backpage() {
    this.navCtrl.push(MainscreenPage);
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

@Component({

  template: `<ion-card style=" margin: auto; width: 100%; height: 100%;">
  <ion-card-content style="padding:1em 2em!important;">
   <ion-icon name="close" (click)="close()" style="float: right; margin-top: 7px;font-size: 1.8em;color: #ff0000;font-weight: bold;"></ion-icon>
   <p> <b>Name:</b> <span> {{data.company_name}}</span></p>
   <p> <b>Event:</b> <span>{{data.event_name}}</span></p>
   <p> <b>Type of Event:</b> <span>{{data.event_type}}</span></p>
   <p> <b>Type of Crowd:</b> <span>{{data.crowd_type}}</span></p>
   <p> <b>Address:</b> <span>{{data.address}},{{data.city}},{{data.state}}</span></p>
   <p> <b>Number of People Expected:</b> <span>{{data.num_people}}</span></p>
   <p> <b>Time:</b> <span>{{data.day}}</span></p>
   <p> <b>Start time:</b> <span>{{data.starttime}}</span></p>
   <p> <b>End time:</b> <span>{{data.endtime}}</span></p>
  <p><b>Distance:</b><span>{{time}} away</span></p>
  <p><b>Miles:</b><span>{{miles}} miles away</span></p>
   <ion-row><button class="btn1" (click)="getdirection(data.lat,data.longt,data.id)">Get Direction</button></ion-row>
   <ion-row><button  class="btn2" (click)="close()">Cancel</button></ion-row>
   </ion-card-content> 
</ion-card>`,

})
export class PopoverPage {
  data: any = {};
  test: any = {};
  miles: any = {};
  time: any = {};
  longg: any = {};
  lat: any = {};
  adress: any;
  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private navParams: NavParams, public popoverCtrl: PopoverController, private geolocation: Geolocation, private platform: Platform, private http: Http) {
    this.data = this.navParams.get('eventid');
    this.miles = this.navParams.get('miles');
    this.time = this.navParams.get('time');
    this.longg = this.navParams.get('longt');
    this.lat = this.navParams.get('lat');

  }
  getdirection(a, b,c) {
    this.viewCtrl.dismiss();
    this.navCtrl.push(CurrentPage, {
      latt: a,
      longg: b,
      evntid:c
    });

  }
  close() {
    this.viewCtrl.dismiss();
  }

}
