import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import firebase from 'firebase';
import{AngularFire,FirebaseListObservable} from 'angularfire2';


@Injectable()
export class Markers {
af:any;
_latlng:number;
rawlist:any=[];test:any=[];
  constructor(af:AngularFire,public http: Http) {
  this.af=af;
      var ref=this.af.database.list('/Drivers/');
                  ref.subscribe((data)=>{
                    data.forEach(minispanshot =>{
                    var keys = minispanshot.$key;   
                    var reff = this.af.database.list('/Drivers/'+keys);
                              reff.subscribe((data) => {
                              this.rawlist=data;
                        });     
                    })
                  })            

  }
set latlng(value:any){
    this.rawlist=value;
}
get latlng(){
    return this.rawlist;
}
}
