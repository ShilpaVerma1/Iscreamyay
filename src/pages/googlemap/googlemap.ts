import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, Platform, ViewController,MenuController,LoadingController, NavParams, PopoverController } from 'ionic-angular';
import { Geolocation } from 'ionic-native';
import { CurrentPage } from '../currentpage/currentpage';
import { HomePage } from '../home/home';
import { Http } from '@angular/http';
import { Network } from 'ionic-native';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import{AngularFire} from 'angularfire2';
import * as GeoFire from "geofire";
import {MainHomePage } from '../mainhome/mainhome';
import * as jQuery from 'jquery';
import * as $ from 'jquery';
import { Diagnostic } from '@ionic-native/diagnostic';

declare var google;
declare var window: any;
@Component({
  selector: 'page-googlemap',
  templateUrl: 'googlemap.html'
})

export class GoogleMapPage {
  @ViewChild('map') mapElement: ElementRef;
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
  af:any;marker1:any;
  devicenotid:any;
  temperature:any;
  weathericon:any;
  usrname:any;
  weather:any;
  fbt:any;Name:any;Email:any;img:any;
  apiurl:string;
  constructor(private diagnostic:Diagnostic,af:AngularFire,public navCtrl: NavController,public loadingCtrl:LoadingController, public menu: MenuController, private storage:Storage,public popoverCtrl: PopoverController, private navParams: NavParams, private geolocation: Geolocation, private platform: Platform, private http: Http) {
       this.apiurl="http://ec2-54-204-73-121.compute-1.amazonaws.com/ogo/iceCreamApi/";

     Network.onDisconnect().subscribe(() => {
        window.plugins.toast.show("You are offline", "long", "center");
    });
    Network.onConnect().subscribe(() => {
    
    });
      this.platform.ready().then((readySource) => {

      this.diagnostic.isLocationEnabled().then((isAvailable) => {
        if(isAvailable==false){
         window.plugins.toast.show("Your location services are disabled.Please turn on your location to continuee", "long", "center");
         this.navCtrl.push(MainHomePage);
        }

      }).catch( (e) => {
         window.plugins.toast.show(e, "short", "center");

      });


       });

     this.fbt=this.navParams.get('type');
     this.storage.set("logintype",this.fbt);
     if(this.fbt == 'facebook' ){
          this.storage.set("logintype",'facebook');
          this.Name=this.navParams.get('name');
          this.img = this.navParams.get('picture');
          this.Email=this.navParams.get('email');  
          var uid = this.navParams.get('usrid');
          this.storage.set("usrname",this.Name);
          this.http.get(this.apiurl+"fbLogin?name="+this.Name+"&email="+this.Email+"&type="+this.fbt+ "&fbuserid="+uid+ "&img=" +this.img).map(res =>res.json()).subscribe(data => {
                this.response = data;
              this.storage.set("userid",this.response.id);      
              this.storage.get('userid').then((userid) => {
                this.usrid = userid;  
                  this.storage.get('deviceid').then((deviceid) => {
                    this.devicenotid = deviceid;
                     if(this.devicenotid){
                      this.http.get(this.apiurl+"saveToken?token="+this.devicenotid+"&userid="+this.usrid).map(res =>res.json()).subscribe(data =>{
                      })  
                     }
                  })
              })          
          });   
      }
    if(this.fbt=='google'){
      this.storage.set("logintype",'google');
      this.Name=this.navParams.get('name');
      this.Email=this.navParams.get('email');
      this.img=this.navParams.get('picture');
      this.storage.set("usrname",this.Name);
      this.http.get(this.apiurl+"googleLogin?name="+this.Name+"&email="+ this.Email+"&type="+this.fbt+"&img="+this.img).map(res =>res.json()).subscribe(data => {
        this.response = data;
         this.storage.set("userid",this.response.id);   
           this.storage.get('userid').then((userid) => {
              this.usrid = userid;  
                this.storage.get('deviceid').then((deviceid) => {
                  this.devicenotid = deviceid;
                  if(this.devicenotid){
                    this.http.get(this.apiurl+"saveToken?token="+this.devicenotid+"&userid="+this.usrid).map(res =>res.json()).subscribe(data =>{

                    })
                  }     
                 })
             })         
       }) 
    } 
  let loading = this.loadingCtrl.create({
    cssClass:'spin',
    spinner: 'hide',
    content:  `<img src="http://2.mediaoncloud.com/Shilpa/load.gif" />`
  });
  loading.present(); 
  setTimeout(() => {
    loading.dismiss();
  }, 4000); 
    this.loadMap();
    
  }

loadMap() {
var that=this;

this.storage.get('userid').then((userid) => {
 this.usrid = userid;
/*************Updating Background Geolocation*************/
    // let config: BackgroundGeolocationConfig = {
    //       desiredAccuracy: 0,
    //       stationaryRadius: 10,
    //       distanceFilter: 10,
    //       debug: false,
    //       interval: 4000,
    //       stopOnTerminate: true, 
    // };
    // this.backgroundGeolocation.configure(config).subscribe((location: BackgroundGeolocationResponse) => {
    //    var firebaseRef = firebase.database().ref('/Drivers/Profiles');
    //    var geoFire = new GeoFire(firebaseRef);
    //         geoFire.set(that.usrid,[location.latitude,location.longitude]).then(function() {
                                    
    //         }, function(error) {
                                
    //         });
    // });
    // this.backgroundGeolocation.start();
    
    this.storage.get('toggleid').then((toggleid)=>{
     var eventtoogleid=toggleid;
     this.storage.get('togglevnt').then((toggleevent)=>{
       var toggleeventid=toggleevent;
       var options={enableHighAccuracy: true,accuracy:10};


    Geolocation.getCurrentPosition(options).then((resp) => {
           var lat = resp.coords.latitude;
           var lng = resp.coords.longitude;
           let latLng = new google.maps.LatLng(lat, lng);    
    this.http.get(this.apiurl+"getEvent?userid="+this.usrid+"&lat="+lat+"&lng="+lng).map(res => res.json()).subscribe(data => {
      this.response = data;
      this.length = data.length;
     
/******For eventtoogle clicked or not ******/
     if(toggleeventid=='1' && eventtoogleid<this.length){
          var eventlatlng=new google.maps.LatLng(this.response[eventtoogleid].lat,this.response[eventtoogleid].longt);

              var mapOptions = {
                    center: eventlatlng,
                    zoom: 15,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    disableDefaultUI: true
                }
            
     }else{
            var mapOptions = {
                center: latLng,
                zoom: 15,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                disableDefaultUI: true
            }
     }    
        let map = new google.maps.Map(this.mapElement.nativeElement, mapOptions); 
           
/*********Placing multiple markers for events************/ 
 
          if (this.response.status != "Failed") {
 
            for (var i = 0; i < this.length; i++) {

                    var data = this.response[i];
                    let latLng = new google.maps.LatLng(data.lat, data.longt);
                    // Creating a marker and putting it on the map
                    that.marker = new google.maps.Marker({
                      position: latLng,
                      map: map,
                      title: data.id,
                      icon: { url: 'http://2.mediaoncloud.com/Shilpa/desticon.png' }
                    });

                    // google.maps.event.addListener(that.marker, 'click', (function (markerr, data) {
                    //   return function () {
                    //     that.showdata(data);

                    //   }
                   // })(that.marker, data));
                     var infoWindow = new google.maps.InfoWindow();
 
                    google.maps.event.addListener(that.marker, 'click', (function (markerr, data) {
                      return function () {
                        var milesdis=Math.round(data.milesDistance);
                        infoWindow.setContent("<p style='margin-bottom: -10px;'>" + data.event_name + "</p>"
                        +"<p style='margin-bottom: -9px;'>"+data.num_people+" people expected"+"</p>"+"<p style='margin-bottom: -10px;'>"+data.city+"</p>"+"<p>"+milesdis+" miles away"+"</p>"
                        + "<img id='btnnn' src='img/addnew.png'/>"); 
                        infoWindow.open(map,markerr);
                            google.maps.event.addListenerOnce(infoWindow, 'domready', () => {
                            document.getElementById('btnnn').addEventListener('click', () => {                                 
                                  that.showdata(data);
                                  infoWindow.close();
                            });
                          });
                      jQuery('.gm-style-iw').prev('div').remove(); 
                    }
                    
                    })(that.marker, data));   
            }
    }  
    

  var firebaseRef = firebase.database().ref('/Drivers/Profiles');
  var geoFire = new GeoFire(firebaseRef);
  var geoQuery = geoFire.query({
      center: [lat,lng],
      radius:16.0934,
    })
this.storage.set('geoq',geoQuery);

/********Adding markers on Drivers position *********/
geoQuery.on("key_entered", function(key, location, distance) { 
        addDriversToMap(location);
});

/****Moves vehicles markers on the map when their location within the query changes****/
 geoQuery.on("key_moved", function(key, location, distance) {
    if(that.marker1){
      that.marker1.setMap(null);
      addDriversToMap(location);
    }
 });
geoQuery.on("key_exited", function(location) {
      if (location !== true) {
      geoQuery.cancel();
        that.marker1.setMap(null);
      }
 });

/********Create a circle centered on the map acoording to eventtoggle clicked or not************/
 if(eventtoogleid!='1'){
  var circle = new google.maps.Circle({
    strokeColor: "#D8D8D8",
    fillColor: "#b8c4b4",
    map: map,
    center:latLng,
    radius:16093,
  });
 }else{
    var circle = new google.maps.Circle({
    strokeColor: "#D8D8D8",
    fillColor: "#b8c4b4",
    map: map,
    center:eventlatlng,
    radius:16093,
  });
 }
/**********Funtion for Creating multiple markers for drivers ***********/
function addDriversToMap(location){
    var LatLng = new google.maps.LatLng(location[0],location[1]);       
          that.marker1 = new google.maps.Marker({
            position: LatLng,
            map: map,
            icon: { url: 'http://2.mediaoncloud.com/Richa/icon7.png' },
          }); 

}

 /**********Updating current location and save it to realtime DB***********/    
          this.watchId = setInterval(() => {  
            Geolocation.getCurrentPosition(options).then((pos) => {
              var latt=pos.coords.latitude;
              var long=pos.coords.longitude;
              var firebaseRef = firebase.database().ref('/Drivers/Profiles');
              var geoFire = new GeoFire(firebaseRef);
              geoQuery.on("key_entered", function(key, location, distance) {  
                    if(key==that.usrid){
                      if(location[0]!=latt && location[1]!=long){
                          geoFire.set(that.usrid, [latt,long]).then(function() {
                              
                          }, function(error) {
                          
                          });
                      }
                  }   
              });
            })
            
          },2000);
         })
      })
    }) 
  })
}) 

} 
eventtoggle(togglevnt){
  this.storage.set('togglevnt',togglevnt);
  this.storage.get('toggleid').then((x)=>{
    if(x==null && x==''){
      this.storage.set('toggleid',0);
    }else{
      var toggleid=x+1;
      this.storage.set('toggleid',toggleid);
    }   
  })
    this.storage.get('geoq').then((geoq)=>{
      geoq.cancel()
    })

    // this.storage.get('watch').then((watch)=>{
    //   watch.unsubscribe();
    // })
  this.loadMap();

  let loading = this.loadingCtrl.create({
    cssClass:'spin',
    spinner: 'hide',
    content:  `<img src="http://2.mediaoncloud.com/Shilpa/load.gif" />`
  });
  loading.present(); 
  setTimeout(() => {
      loading.dismiss();
  }, 4000);
 

}
eventtogglee(){
    this.storage.set('toggleid',null);
    this.storage.set('togglevnt','');
    this.storage.get('geoq').then((geoq)=>{
      geoq.cancel()
    })

    // this.storage.get('watch').then((watch)=>{
    //   watch.unsubscribe();
    // })
  this.loadMap();

  let loading = this.loadingCtrl.create({
    cssClass:'spin',
    spinner: 'hide',
    content:  `<img src="http://2.mediaoncloud.com/Shilpa/load.gif" />`
  });
  loading.present(); 
  setTimeout(() => {
    loading.dismiss();
  }, 3000);
  

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
        let loading = this.loadingCtrl.create({
          cssClass:'spin',
          spinner: 'ios',
          content: 'Loading...'
        });
        popover.present({
          ev: PopoverPage
        });
           loading.dismiss();
      })
    })
  }

  backpage(wat) {
    this.storage.set('toggleid',null);
    this.storage.set('togglevnt','');

    this.storage.get('geoq').then((geoq)=>{
      geoq.cancel()
    })
      clearInterval(wat);
    // this.storage.get('watch').then((watch)=>{
    //   watch.unsubscribe();
    // })
    this.storage.get("logintype").then((logintype)=>{   

          this.navCtrl.push(MainHomePage,{
            type:logintype,
            watchid:wat
          });
    })

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
  constructor(public navCtrl: NavController,public loadingCtrl:LoadingController,public storage:Storage, public viewCtrl: ViewController, private navParams: NavParams, public popoverCtrl: PopoverController, private geolocation: Geolocation, private platform: Platform, private http: Http) {

    this.data = this.navParams.get('eventid');
    this.miles = this.navParams.get('miles');
    this.time = this.navParams.get('time');
    this.longg = this.navParams.get('longt');
    this.lat = this.navParams.get('lat');

  }
  getdirection(a, b,c) {
    this.storage.set('toggleid',null);
    this.storage.set('togglevnt','');
    this.storage.get('geoq').then((geoq)=>{
        geoq.cancel()
    })
    this.storage.get('watch').then((watch)=>{
      watch.unsubscribe();
    })
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




