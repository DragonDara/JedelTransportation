import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable, combineLatest, of  } from 'rxjs';


//TODO fix route /userproduct/33/profile --> user can view other users' products
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private db: AngularFireDatabase, 
    private http: HttpClient
  ) { 
    
  }

  getMessages(userid) {
		var chats =  this.db
			.list('chats/' + userid + '/messages', ref => {
				return ref.orderByChild('timeStamp');
			})
      .valueChanges()
      .pipe(
        map((c1) => {
          return c1.map(c2 => {
              var test = Object.keys(c2["message"]).map((value,index)=>{
                return {message: c2["message"][value], "meta-data":c2["meta-data"]}
              })
              return test
            })
        })
      );
    return chats;
  }
  
  getTwoUsersConversation(userid, userTo){
    let first: Observable<Object> = this.db.list('chats/' + userid + '/messages/' + userTo, ref =>{	return ref.orderByChild('timeStamp');} ).valueChanges().pipe(
      map((c1) => {
       if(c1.length === 0){
        return [];
       } 
      return Object.keys(c1[0]).map((value,index)=>{
        return {message: c1[0][value], "meta-data":c1[1]}
      })
      })
    ); ; 
    let second: Observable<Object> = this.db.list('chats/' + userTo + '/messages/' + userid, ref =>{
      return ref.orderByChild('timeStamp');
    }).valueChanges().pipe(
      map((c1) => {
        if(c1.length === 0){
          return [];
        } 
        return Object.keys(c1[0]).map((value,index)=>{
          return {message: c1[0][value], "meta-data":c1[1]}
        })
      })
    );;

    
    return combineLatest([first, second]);

    // .pipe(
    //   map((c1) => {
    //     return Object.keys(c1["message"]).map((value,index)=>{
    //       return {message: c1["message"][value], "meta-data":c1["meta-data"]}
    //     })
    //   })
    // );
  }

  getSecondUserMessages(userid, userTo): Observable<any> {
		return this.db.object('chats/' + userid + '/messages/' + userTo).valueChanges().pipe(
      map((c1) => {
        return Object.keys(c1["message"]).map((value,index)=>{
          return {message: c1["message"][value], "meta-data":c1["meta-data"]}
        })
      })
    );
	}

  sendMessage(user, message, senderid, receiverid) {
		const messageData = {
      senderid: senderid,
      receiverid: receiverid,
			messageBody: message,
      senderName: user.name,
      receiverName: '',
			timeStamp: new Date().getTime()
		};
		const agentMeta = {
			name: user.name,
			new: true
		};
		const userMeta = {
			new: false
    };

    //const chatid = senderid + '-' + receiverid
    //console.log(messageData, agentMeta,userMeta, chatid)
		this.db.list(`chats/${receiverid}/messages/${senderid}/message/`).push(messageData);
		this.db.database.ref(`chats/${receiverid}/messages/${senderid}/meta-data/agent`).update(agentMeta);
    this.db.database.ref(`chats/${receiverid}/messages/${senderid}/meta-data/user`).update(userMeta);
    
	}

}
