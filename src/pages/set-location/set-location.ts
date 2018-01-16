import { Component } from '@angular/core';
import { IonicPage, NavParams, ViewController } from 'ionic-angular';
import { Location } from "../../models/location";

/**
 * Generated class for the SetLocationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {

  location: Location;
  markerLocation: Location;

  constructor(
    private navParams: NavParams,
    private viewCtrl: ViewController) {
    this.location = this.navParams.get("location");
    if (this.navParams.get("isSet")) {
      this.markerLocation = this.navParams.get("location");
    }
  }

  setMarker(event: any) {
    this.markerLocation = new Location(event.coords.lat, event.coords.lng);
  }

  onCancel() {
    this.viewCtrl.dismiss();
  }

  onConfirm() {
    this.viewCtrl.dismiss({location: this.markerLocation})
  }

}
