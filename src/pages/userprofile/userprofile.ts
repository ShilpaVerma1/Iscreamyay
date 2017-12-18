import { Component } from '@angular/core';
import { NavController, Platform,MenuController, LoadingController, Loading, ActionSheetController, ToastController  } from 'ionic-angular';
import { EditProfilepage } from '../editprofile/editprofile';
import { File } from 'ionic-native';
import { Transfer } from 'ionic-native';
import { FilePath } from 'ionic-native';
import { Camera } from 'ionic-native';
import { Storage } from '@ionic/storage';
import { Network } from 'ionic-native';
import { Crop } from 'ionic-native';
import 'rxjs/add/operator/map';
import { Http } from '@angular/http';
import {MainHomePage } from '../mainhome/mainhome';

declare var cordova: any;
declare var window: any;
@Component({
  selector: 'page-userprofile',
  templateUrl: 'userprofile.html'
})
export class UserProfilePage {
EditProfilepage = EditProfilepage;
lastImage: string = null;
  loading: Loading;
  usrid:any;
  profile:any={};
  mail:any;
  apiurl:string;
  constructor(public navCtrl: NavController,public menu:MenuController, public storage: Storage, private http:Http, public toastCtrl: ToastController,  public actionSheetCtrl: ActionSheetController, public platform: Platform, public loadingCtrl: LoadingController) {
    this.apiurl="http://ec2-54-204-73-121.compute-1.amazonaws.com/ogo/iceCreamApi/";

    Network.onDisconnect().subscribe(() => {
      this.platform.ready().then(() => {
          window.plugins.toast.show("You are offline", "long", "center");
        });

    });
     Network.onConnect().subscribe(()=> {
      // this.platform.ready().then(() => {
      //    window.plugins.toast.show("You are online", "long", "center");
      //   });
         });
    
    this.storage.get('userid').then((userid) => {
      this.usrid = userid;
          let loadingPopup = this.loadingCtrl.create({
            cssClass: 'img-blank',
            spinner: 'ios',
            // content:  `<img style="height:60px;width:60px;" class="imgprofileload" src="http://2.mediaoncloud.com/Shilpa/loading_circle.gif" />`
          });
          loadingPopup.present(); 
    
      this.http.get(this.apiurl+"getProfile?userid="+this.usrid).map(res =>res.json()).subscribe(data =>{
          setTimeout(() => {
              this.profile= data;
              if(this.profile.email=='undefined' || this.profile.email==''){
                  this.mail='';
              }
              if(this.profile.email!='undefined'){
                this.mail=this.profile.email;
              }
            loadingPopup.dismiss();
          }, 1000);
      })  
  });    
}
 public presentActionSheet()
 {
 let actionSheet = this.actionSheetCtrl.create({
    //  title: 'Select Image Source',
      buttons: [{
          text: 'Upload Picture',
          cssClass:'upload',
          handler: () => {
            this.takePicture(Camera.PictureSourceType.PHOTOLIBRARY);
          //  this.uploadImage();
          }
        },
        {
          text: 'Use Camera',
           cssClass:'camera',
          handler: () => {
           this.takePicture(Camera.PictureSourceType.CAMERA);
         //  this.uploadImage();
          }
        },
        {
          text: 'Cancel',
           cssClass:'cancel',
          role: 'cancel'
        }]
    });
    actionSheet.present();
}
public takePicture(sourceType) {
  // Create options for the Camera Dialog
  var options = {
    quality: 100,
    allowEdit: true,
    sourceType: sourceType,
    saveToPhotoAlbum: false,
    correctOrientation: true,
    destinationType: Camera.DestinationType.FILE_URI
  };
 
  // Get the data of an image
  Camera.getPicture(options).then((imagePath) => {
    // Special handling for Android library
    if (this.platform.is('android') && sourceType === Camera.PictureSourceType.PHOTOLIBRARY) {
      FilePath.resolveNativePath(imagePath)
        .then(filePath => {
          let correctPath = filePath.substr(0, filePath.lastIndexOf('/') + 1);
          let currentName = imagePath.substring(imagePath.lastIndexOf('/') + 1, imagePath.lastIndexOf('?'));
          this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
        });
    } else {
      var currentName = imagePath.substr(imagePath.lastIndexOf('/') + 1);
      var correctPath = imagePath.substr(0, imagePath.lastIndexOf('/') + 1);
      this.copyFileToLocalDir(correctPath, currentName, this.createFileName());
    }
  }, (err) => {
    this.presentToast('Error while selecting image.');
  });
}

private createFileName() {
  var d = new Date(),
  n = d.getTime(),
  newFileName =  n + ".jpg";
  return newFileName;
}
 
// Copy the image to a local folder
private copyFileToLocalDir(namePath, currentName, newFileName) {
  File.copyFile(namePath, currentName, cordova.file.dataDirectory, newFileName).then(success => {
    this.lastImage = newFileName;

 var url = "http://ec2-54-204-73-121.compute-1.amazonaws.com/ogo/ImageUpload/icecreamapp.php";
 
  // File for Upload
  var targetPath = this.pathForImage(this.lastImage);
 
  // File name only
  var filename = this.lastImage;
 
  var options = {
    fileKey: "file",
    fileName: filename,
    chunkedMode: false,
    mimeType: "multipart/form-data",
    params : {'fileName': filename}
  };
 
  const fileTransfer = new Transfer();
 
  this.loading = this.loadingCtrl.create({
    content: 'Uploading...',
  });
  this.loading.present();
 
  // Use the FileTransfer to upload the image
  fileTransfer.upload(targetPath, url, options).then(data => {
    this.loading.dismissAll()
    
    this.presentToast('Image successfully uploaded.');
    this.navCtrl.setRoot(this.navCtrl.getActive().component());
  }, err => {
    this.loading.dismissAll()
    this.presentToast('Error while uploading file.');
  });

this.storage.get('userid').then((userid) => {
      this.usrid = userid;
      //alert(this.usrid);
this.http.get(this.apiurl+"saveImage?userid="+ this.usrid+"&image="+filename).map(res =>res.json()).subscribe(data =>{

}),
err => this.presentToast(err);
})
  }, error => {
    this.presentToast('Error while storing file.');
  });
}
 
private presentToast(text) {
  let toast = this.toastCtrl.create({
    message: text,
    duration: 3000,
    position: 'top'
  });
  toast.present();
}
 
// Always get the accurate path to your apps folder
public pathForImage(img) {
  if (img === null) {
    return '';
  } else {
    return cordova.file.dataDirectory + img;
  }
}

editprofile(){
  this.navCtrl.push(EditProfilepage);
}

backpagee(){
  this.navCtrl.push(MainHomePage);
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
