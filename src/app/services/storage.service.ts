import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(
    private storage: AngularFireStorage,
  ) { }

  getRef(path: string) {
    return this.storage.ref(path)
  }
}
