import { Component } from '@angular/core';
import { NavController, LoadingController,MenuController, Platform,NavParams} from 'ionic-angular';
import { FbRegPage } from '../fbreg/fbreg';
import { HomePage } from '../home/home';
import { VendorregisterPage } from '../vendorregister/vendorregister';
import { MainHomePage } from '../mainhome/mainhome';
import { GoogleRegPage } from '../googlereg/googlereg';
import { Facebook, NativeStorage } from 'ionic-native';
import { GooglePlus } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { Network } from 'ionic-native';
import { Http } from '@angular/http';
declare var window: any;

@Component({
  selector: 'page-fblog',
  templateUrl: 'fblog.html'
})
export class FbPage {
HomePage = HomePage;
MainHomePage = MainHomePage;
GoogleRegPage = GoogleRegPage;
FB_APP_ID: number =1295611150530130;
data:any;
FbRegPage = FbRegPage;
response:any;
usrid:any;
dvcid:any;
tokenid:any;
notideviceid:any;
dvctokn:any;


  constructor(public navCtrl: NavController,public menu:MenuController, public navParams:NavParams, public loadingCtrl:LoadingController, private storage: Storage, private http: Http, public platform: Platform) {
    Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
     Network.onConnect().subscribe(()=> {

     });
// get device user id for notification 
this.notideviceid =this.navParams.get("deviceidd");

Facebook.browserInit(this.FB_APP_ID, "v2.8");
this.data={};
this.data.email = '';
this.data.pass = '';
}

login(){
this.storage.set("logintype",'default');
    this.http.get("http://192.169.146.6/ogo/iceCreamApi/login?email="+this.data.email+"&password="+this.data.pass).map(res =>res.json()).subscribe(data =>{
         this.response = data;
         if(this.response.status != "Failed"){

            this.storage.set("userid",this.response.id);         
            this.storage.set("user_detail",this.response);
            this.storage.set("sound_status",this.response.sound_status);
            this.storage.set("noti_status",this.response.noti_status);

            this.storage.get('userid').then((userid) => {
              this.usrid = userid;  
                this.http.get("http://192.169.146.6/ogo/iceCreamApi/saveToken?token="+this.notideviceid+"&userid="+this.usrid).map(res =>res.json()).subscribe(data =>{

                })
               //alert("You have login successfully");
                    window.plugins.toast.show("You have logged in successfully","short","center");
                    this.navCtrl.push(MainHomePage);  
            })
          }
          else{
                 //alert("Please enter appropriate details");
                window.plugins.toast.show("Please enter appropriate details","long","center");
              }
              
    }) 


}

register(){
  this.navCtrl.push(VendorregisterPage);
}

forgetpass(){
  
}

//facebook login.........
loginfb(){
   let permissions = new Array();
    let nav = this.navCtrl;
    //the permissions your facebook app needs from the user
    permissions = ["public_profile"];

    Facebook.login(permissions)
    .then(function(response){
      let userId = response.authResponse.userID;
      let params = new Array();

      //Getting name and gender properties
      Facebook.api("/me?fields=name,gender,email", params)
      .then(function(user) {
        user.picture = "https://graph.facebook.com/" + userId + "/picture?type=large";
        // alert(user.picture);
        //now we have the users info, let's save it in the NativeStorage
        NativeStorage.setItem('user',
        {
          name: user.name,
          gender: user.gender,
          picture: user.picture,
          email:user.email,
          usrid:userId
        })
        .then(function(){
          //alert(user.email);
          nav.push(MainHomePage,{
            type:'facebook',
            name: user.name,
            picture: user.picture,
            email:user.email,
            usrid:userId
          });
        }, function (error) {
          //console.log(error);
        })
      })
    }, function(error){
      //console.log(error);
    });
  }

 //google login........
  doGoogleLogin(){
  let nav = this.navCtrl;
  let loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });
  loading.present();
  GooglePlus.login({
    'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
    'webClientId': '684030846136-247tbdfl7mdl3f5np0blcudturfdamls.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
    'offline': true
  })
  .then(function (user) {
    loading.dismiss();
    //alert(JSON.stringify(user));
      NativeStorage.setItem('user', {
      name: user.displayName,
      email: user.email,
      picture: user.imageUrl
    })
    .then(function(){
      nav.push(GoogleRegPage,{
        type:'google',
        name: user.displayName,
        email: user.email,
        picture: user.imageUrl
      });
    }, function (error) {
      console.log(error);
    })
  }, function (error) {
    loading.dismiss();
  });
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
