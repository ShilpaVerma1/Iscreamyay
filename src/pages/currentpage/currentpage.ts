import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, NavParams,MenuController, AlertController } from 'ionic-angular';
import {MainHomePage } from '../mainhome/mainhome';
import { Geolocation } from 'ionic-native';
import { Http } from '@angular/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';

declare var google;
declare var window: any;
@Component({
  selector: 'page-currentpage',
  templateUrl: 'currentpage.html'
})

export class CurrentPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  origin: any;
  destination: any;
  latt: any;
  longg: any;
  directionsService: any;
  directionsDisplay: any;
  lati: any;
  longi: any;
  originn: any;
  destinationn: any;
  time: any;
  timee: any;
  miless: any;
  addresss: any;
  tlat: any;
  tlong: any;
  dest: any;
  latLng: any;
  distancetxt: any;
  durationtxt: any;
  timee1:any;
  eventid:any;
  usrid:any;loc:any;
  markerArray :any= [];
  markerA:any;
  markerB:any;
  af:any;
  constructor(public navCtrl: NavController,public menu:MenuController,private storage:Storage,private http:Http, private navParams: NavParams, private geolocation: Geolocation, private platform: Platform, public alertCtrl:AlertController) {
    this.lati = this.navParams.get("latt");
    this.longi = this.navParams.get("longg");
    this.eventid = this.navParams.get("evntid");

  }
  ionViewDidLoad() {
    this.loadMap();
  }


 loadMap() {

this.storage.get('userid').then((userid) => {
    this.usrid = userid;
  Geolocation.getCurrentPosition().then((position) => {
      this.tlat = position.coords.latitude;
      this.tlong = position.coords.longitude;
      //   this.tlat=9.0765;
      // this.tlong=7.3986;
      // Instantiate a directions service.
      this.directionsService = new google.maps.DirectionsService();
      this.latLng = new google.maps.LatLng(this.tlat, this.tlong);
      let mapOptions = {
        center: this.latLng,
        zoom: 20,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        views: google.maps.traffic,
        disableDefaultUI: true
      }

      this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);


      if(this.lati == null && this.longi == null){
      
              var marker = new google.maps.Marker({
                position: this.latLng,
                map: this.map,
                icon: 'http://2.mediaoncloud.com/Richa/icon7.png',
                animation: google.maps.Animation.DROP
              });
            
      }

      // Create a renderer for directions and bind it to the map.
      this.directionsDisplay = new google.maps.DirectionsRenderer({
        map: this.map,
        suppressMarkers : true ,
        polylineOptions: {
          strokeColor: "red",
          strokeWeight: 5,
          strokeOpacity: 0.9
        }
      });
     

      // Display the route between the initial start and end selections.
      this.calculateAndDisplayRoute(this.directionsDisplay, this.directionsService, this.map);
      const watch = Geolocation.watchPosition().subscribe(pos => {
      this.tlat = pos.coords.latitude;
      this.tlong = pos.coords.longitude;
      // this.tlat=9.0765;
      // this.tlong=7.3986;
      this.latLng = new google.maps.LatLng(this.tlat, this.tlong);

        if(this.timee1 <= 100){
        let alert = this.alertCtrl.create({
          title: 'Confirmation',
          message: 'You have successfully completed your ride',
          buttons: [
            {
              text: 'Ok',
              handler: () => {
                
                this.storage.get('userid').then((userid) => {
                this.usrid = userid;
                this.eventid = this.navParams.get("evntid");
                this.http.get("http://192.169.146.6/ogo/iceCreamApi/removeEvent?id="+this.eventid+"&userid="+this.usrid).map(res => res.json()).subscribe(data => {
                this.navCtrl.setRoot(this.navCtrl.getActive().component);
                })
                })
              }
            }
          ]
        });
        alert.present();
          watch.unsubscribe();

        } else {
               
               this.calculateAndDisplayRoute(this.directionsDisplay, this.directionsService,this.map);
               
        }
      });
    }) 
    }) 
  
  }
     
  calculateAndDisplayRoute(directionsDisplay, directionsService,map) {
    this.dest = new google.maps.LatLng(this.lati, this.longi);   
    var x = this;

    directionsService.route({
      origin: this.latLng,
      destination: this.dest,
      travelMode: 'DRIVING'
    }, function (response, status) {
      // Route the directions and pass the response to a function to create
      // markers for each step.

      if (status == google.maps.DirectionsStatus.OK) {
          let legs = response.routes[0].legs[0];
  
        if ( x.markerA ) { 
             x.markerA.setMap(null);
             x.markerA = new google.maps.Marker({
              position: legs.start_location,
              map: map,
              icon: 'http://2.mediaoncloud.com/Richa/icon7.png'
            }); 
          }
          else{
                x.markerA = new google.maps.Marker({
                    position: legs.start_location,
                    map: map,
                    icon: 'http://2.mediaoncloud.com/Richa/icon7.png'
                  }); 
          }
        x.markerB = new google.maps.Marker({
          position: legs.end_location,
          map: map,
          icon:'http://2.mediaoncloud.com/Shilpa/desticon.png'
        }); 
       
        directionsDisplay.setDirections(response);
        var dis = legs.distance.value;
        this.distance = (dis * 0.00062137).toFixed(2);
        this.time = legs.duration.value;
        x.miless = this.distance + ' ' + 'Miles and' + ' ';
        x.timee = legs.duration.text + ' ' + 'away';
        x.timee1 = legs.distance.value;
      } else {
            console.log('Directions request failed due to ' + status);
      }
      
    });
  }

  backpage() {
    this.navCtrl.push(MainHomePage);
  }

  movetogoogle() {

    window.open('https://www.google.com/maps/dir/' + this.tlat + ',' + this.tlong + '/' + this.lati + ',' + this.longi + '/am=t');

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

