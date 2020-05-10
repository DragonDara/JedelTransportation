import { OnInit, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from './product.model';
import { map, tap, finalize } from 'rxjs/operators';
import { Observable, combineLatest, of, empty } from 'rxjs';
import { AngularFireDatabase } from '@angular/fire/database';
import { IRespondedProduct } from './products.component';
import { AngularFireStorage } from '@angular/fire/storage';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({providedIn:'root'})
export class ProductService implements OnInit{

    constructor(
        private http: HttpClient,
        private firestore: AngularFireDatabase,
        private storage: AngularFireStorage,
        private firecloud: AngularFirestore
    ) {

    }

    ngOnInit(): void{

    }

    saveProduct(product, files){
        var percentage:  Observable<number>;
        const allPercentage: Observable<number>[] = []; 
        const filePath = `images/${product.userid}/${product.productid}/`;
        for (const file of files) {
            const path = filePath + new Date().getTime();;
            const ref = this.storage.ref(path);
            const task = this.storage.upload(path, file);
            percentage = task.percentageChanges();
            allPercentage.push(percentage);
        
            const _t = task.then((f) => {
                f.ref.getDownloadURL().then((url) => {
                    product.images.push(url);
                    this.addProduct(product);
                }).catch(err => console.log(err))
            })
        }
    }

    private addProduct(product) {
        // return this.http.post(
        //     'https://ng-complete-guide-8c51b.firebaseio.com/products.json',
        //     product,
        // );
        //return this.firestore.list('/products').push(product);

        return this.firecloud.collection('products').add(product);
    }

        
    getProducts()  {
        // return this.http.get(
        //     'https://ng-complete-guide-8c51b.firebaseio.com/products.json'
        // );
        //return this.firestore.collection("products").snapshotChanges();
        return this.firecloud.collection("products").snapshotChanges();
    }

    addRespondProduct(respondedProduct) {
        // return this.http.post<any>(
        //     'https://ng-complete-guide-8c51b.firebaseio.com/respondedproduct.json',
        //     respondedProduct,
        // )
        console.log("before adding")
        return this.firecloud.collection("respondedproduct").add(respondedProduct)
    }

    getRespondedProducts(): Observable<any> {
        //return this.firestore.list('/respondedproduct').valueChanges();
        // return this.firestore.object('/respondedproduct' 
        // ).valueChanges();
        return this.firecloud.collection("respondedproduct").valueChanges();
    }

    getRespondedProductsPromise(): any {
        //return this.firestore.list('/respondedproduct').valueChanges();
        // return this.firestore.object('/respondedproduct' 
        // ).valueChanges();
        var respondedproducts = this.firecloud.collection("respondedproduct").valueChanges();
        return new Promise<any>((resolve, reject) => {
            respondedproducts.subscribe(res => resolve(res), err => reject(err))
        })
    }

    getRespondedProductsSnap(): Observable<any> {
        //return this.firestore.list('/respondedproduct').valueChanges();
        // return this.firestore.object('/respondedproduct' 
        // ).valueChanges();
        return this.firecloud.collection("respondedproduct").snapshotChanges();
    }

    async getRespondProduct(userproductid:any): Promise<any>{
        // let respondedproduct =  this.firestore.list<IRespondedProduct>('/respondedproduct', 
        //     ref => ref.orderByChild('product/productid').equalTo(userproductid)).snapshotChanges()
        //     .pipe(
        //         map(changes => changes.map(c => ({
        //             unique: c.payload.key, ...c.payload.val()
        //         })))
        //     );
        let respondedproduct =  this.firecloud.collection<any>("respondedproduct", ref => ref.orderBy('product')).snapshotChanges().pipe(
            map(actions => actions.map(a => {
                const data = a.payload.doc.data();
                const id = a.payload.doc.id;
                return { unique: id, ...data }
              }))
        );
           
        return await new Promise<any>((resolve, reject) => {
            respondedproduct.subscribe(
                res => {
                    resolve(res);
                },
                err => {
                    reject(err);
                },
                () => {
                    console.log("fuckin complete")
                }
            )
        })
    }

   
    //TODO rewrite this ,ethid. it must be find the respondedproducts by product id
    getRespondProduct1(product:any): Promise<any>{
      
        let respondedproduct =  this.firecloud.collection<any>('respondedproduct').snapshotChanges()
            .pipe(
                map(actions => actions.map(a => {
                    const data = a.payload.doc.data();
                    const id = a.payload.doc.id;
                    return { unique: id, ...data };
                  }))
                );
        return new Promise<any>((resolve, reject) => {
            respondedproduct.subscribe(
                res => {
                    resolve(res)
                },
                err => reject(err)
            )
        });
    
    }

    updateRespondeProudct(product){
        // return this.firecloud.collection('respondedproduct').doc(docid).set(id, {respondedbyusers: data.respondedbyusers, respondeduserid: data.respondeduserid });
        console.log(product.unique)
        return this.firecloud.collection('respondedproduct').doc(product.unique).set(product);
    }
    getUserProducts(email: string): Observable<Product[]> {
        var userproducts = this.firecloud.collection<Product>('/products', ref => ref.where('user','==', email)).valueChanges();
        return userproducts;
    }
    getUserProduct(email: string, productid: number): Observable<Product[]> {
        var userproducts = this.firecloud.collection<Product>('products', ref => ref.where('user', '==', email) && ref.where('productid', '==', productid)).valueChanges();
        return userproducts;
    }

    addAcceptedUserForProduct(acceptedProduct){
        return this.http.post<any>(
            'https://ng-complete-guide-8c51b.firebaseio.com/acceptedproduct.json',
            acceptedProduct,
        )
    }

    getAcceptedUserForProduct(id: number | string){
        let respondedproduct: Observable<any>;
        if( typeof id === 'string'){
            respondedproduct = this.firestore.list<IRespondedProduct>('/acceptedproduct', 
            ref => ref.orderByChild('acceptedbyuser').equalTo(id)).snapshotChanges()
            .pipe(
                map(changes => changes.map(c => ({
                    unique: c.payload.key, ...c.payload.val()
                })))
            );
        }
        else{
            respondedproduct = this.firestore.list<IRespondedProduct>('/acceptedproduct', 
                ref => ref.orderByChild('productid').equalTo(id)).snapshotChanges()
                .pipe(
                    map(changes => changes.map(c => ({
                        unique: c.payload.key, ...c.payload.val()
                    })))
                );
        }
        return new Promise<any>((resolve, reject) => {
            respondedproduct.subscribe(
                res => {
                    resolve(res)
                },
                err => reject(err)
            )
        });
    }

    deleteUserProduct(productid, docid, responddocid){
        this.firecloud.collection("products").doc(docid).delete();
        if(responddocid !== ''){
            this.firecloud.collection('respondedproduct').doc(responddocid).delete();
            this.firestore.list("acceptedproduct", ref => ref.orderByChild('productid').equalTo(productid)).remove();
        }
    }
}