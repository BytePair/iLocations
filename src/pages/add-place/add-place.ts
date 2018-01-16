import { Component } from '@angular/core';
import { IonicPage, ModalController} from 'ionic-angular';
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

  constructor(private modalCtrl: ModalController) {
  }

  onLocate() {

  }

  onOpenMap() {
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location});
    modal.present();
  }

  onTakePhoto() {

  }

  onSubmit(form: Form) {

  }

}
