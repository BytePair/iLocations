import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Form } from "@angular/forms";
import { SetLocationPage } from "../set-location/set-location";
import { Location } from "../../models/location";


@IonicPage()
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {

  location: Location = {
    lat: 26.37357,
    lng: -80.102348
  };
  locationIsSet: boolean = false;

  constructor(private modalCtrl: ModalController,
              private geoLocation: Geolocation,
              private loadCtrl: LoadingController,
              private toastCtrl: ToastController) {
  }

  onLocate() {
    const loader = this.loadCtrl.create({
      content: 'Retrieving location'
    });
    loader.present();
    this.geoLocation.getCurrentPosition()
      .then(
        location => {
          loader.dismiss();
          this.location.lat = location.coords.latitude;
          this.location.lng = location.coords.longitude;
          this.locationIsSet = true;
        }
      )
      .catch(
        error => {
          loader.dismiss();
          this.toastCtrl.create({
            message: "Could not fetch location. Please select manually.",
            duration: 2000
          }).present();

        }
      );
  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet: this.locationIsSet});
    modal.present();
    modal.onDidDismiss(
      data => {
        if (data) {
          this.location = data.location;
          this.locationIsSet = true;
        }
      }
    )
  }

  onTakePhoto() {

  }

  onSubmit(form: Form) {

  }

}
