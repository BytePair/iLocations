import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, ToastController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FormGroup } from "@angular/forms";
import { SetLocationPage } from "../set-location/set-location";
import { Location } from "../../models/location";
import { PlacesService } from "../../services/places";

declare var cordova: any;

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

  imageUrl: string = "";

  constructor(private modalCtrl: ModalController,
              private geoLocation: Geolocation,
              private loadCtrl: LoadingController,
              private toastCtrl: ToastController,
              private camera: Camera,
              private file: File,
              private placesService: PlacesService) {
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
    const cameraOptions: CameraOptions = {
      encodingType: this.camera.EncodingType.JPEG,
      correctOrientation: true
    };
    this.camera.getPicture(cameraOptions)
      .then(
        imageData => {
          // use regex to get file name
          const currentName = imageData.replace(/^.*[\\\/]/, '');
          // use regex to get file path
          const path = imageData.replace(/[^\/]*$/, '');
          const newFileName = new Date().getUTCMilliseconds() + '.jpg';
          // cordova.file.dataDirectory is the app storage directory on device
          this.file.moveFile(path, currentName, cordova.file.dataDirectory, newFileName)
            .then(
              (data) => {
                this.imageUrl = data.nativeURL;
                this.camera.cleanup();
              }
            )
            .catch(
              (error) => {
                this.imageUrl = "";
                this.toastCtrl.create({message: 'Could not save image. Please try again.', duration: 2500}).present();
                this.camera.cleanup();
              }
            );
        }
      )
      .catch(
        error => {
          this.toastCtrl.create({message: 'Could not take image. Please try again.', duration: 2500}).present();
        }
      );
  }

  onSubmit(form: FormGroup) {
    this.placesService.addPlace(form.value.name, form.value.description, this.location, this.imageUrl);
    this.toastCtrl.create({message: "Awesome Place Added", duration: 2000}).present();
    // reset the form
    form.reset();
    this.location = {
      lat: 26.37357,
      lng: -80.102348
    };
    this.imageUrl = "";
    this.locationIsSet = false;
  }

}
