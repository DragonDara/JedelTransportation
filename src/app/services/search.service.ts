import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore/';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  constructor(
    private firedb: AngularFireDatabase,
    private firecloud: AngularFirestore
  ) { }

  
  searchByDeparture(terms: Observable<string>): any {
   
    return terms.pipe(
        // debounceTime(400): waits until there’s no new data for the provided amount of time
        debounceTime(400),
        // distinctUntilChanged():
        //      will ensure that only distinct data passes through
        //      will only send the data once
        distinctUntilChanged(),
        // switchMap():
        //      combines multiple possible observables received from the searchEntries method into one,
        //      which ensures that we use the results from the latest request only.
        switchMap((term: string) => this.searchEntries(term, 'wherefrom'))
    );
  }

  searchByDate(terms: Observable<any>): any {
   
    return terms.pipe(
        // debounceTime(400): waits until there’s no new data for the provided amount of time
        debounceTime(400),
        // distinctUntilChanged():
        //      will ensure that only distinct data passes through
        //      will only send the data once
        distinctUntilChanged(),
        // switchMap():
        //      combines multiple possible observables received from the searchEntries method into one,
        //      which ensures that we use the results from the latest request only.
        switchMap((term: string) => this.searchEntries(term, 'when'))
    );
  }

  searchByDestination(terms: Observable<string>): any {
   
    return terms.pipe(
        // debounceTime(400): waits until there’s no new data for the provided amount of time
        debounceTime(400),
        // distinctUntilChanged():
        //      will ensure that only distinct data passes through
        //      will only send the data once
        distinctUntilChanged(),
        // switchMap():
        //      combines multiple possible observables received from the searchEntries method into one,
        //      which ensures that we use the results from the latest request only.
        switchMap((term: string) => this.searchEntries(term, 'whereto'))
    );
  }
  searchEntries(term: string, key: string): Observable<object> {
    if (term === '') {
        return this.firecloud.collection('products').snapshotChanges();
    }

    switch (key) {
      case 'wherefrom':
        return this.firecloud.collection('products', ref =>ref.orderBy('wherefrom').startAt(term).endAt(term +'\uf8ff')).snapshotChanges();
      case 'whereto':
        return this.firecloud.collection('products', ref =>ref.orderBy('whereto').startAt(term).endAt(term +'\uf8ff')).snapshotChanges();
      case 'when':
        return this.firecloud.collection('products', ref =>ref.where('when', '==', term)).snapshotChanges();
      default:
        break;
    }
  }

  searchByMultipleProperties(properties){
    return this.firecloud.collection('products', 
      ref => ref
            .where('wherefrom','==',properties.value.searchbydepature)
            .where('whereto', '==', properties.value.searchbydestination)
            .where('when', '==', properties.value.searchbydate))
    .snapshotChanges();
  }
}
