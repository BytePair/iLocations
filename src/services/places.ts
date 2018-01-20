import { Place } from "../models/place";
import { Location } from "../models/location";
import { Storage } from "@ionic/storage";
import { Injectable } from "@angular/core";
import { File} from "@ionic-native/file";

declare var cordova: any;

@Injectable()
export class PlacesService {

  constructor(private storage: Storage, private file: File) {};

  private places: Place[] = [];

  addPlace(title: string,
           description: string,
           location: Location,
           imageURL: string) {
    const place = new Place(title, description, location, imageURL);
    this.places.push(place);
    // store places as key value pair
    this.storage.set('places', this.places)
      .then()
      .catch(
        (error) => {
          this.places.splice(this.places.indexOf(place), 1);
        }
      )
  }

  getPlaces() {
    return this.places.slice();
  }

  deletePlace(index: number) {
    const place = this.places[index];
    this.places.splice(index, 1);
    this.storage.set('places', this.places)
      .then(
        () => {
          this.deleteFile(place);
        }
      )
      .catch(
        (error) => {
          console.log(error.message);
        }
      )
  }

  fetchPlaces() {
    return this.storage.get('places')
      .then(
        (places : Place[]) => {
          this.places = (places != null) ? places : [];
          return this.places.slice();
        }
      )
      .catch(
        (error) => {
          console.log(error.message);
        }
      )
  }

  deleteFile(place: Place) {
    let filename = place.imagePath.replace(/^.*[\\\/]/, '');
    this.file.removeFile(cordova.file.dataDirectory, filename)
      .then(
        () => {
          console.log('Image file deleted')
        }
      )
      .catch(
        (error) => {
          console.log(error.message);
          this.addPlace(place.title, place.description, place.location, place.imagePath);
        })
  }

}
