import { Component, OnInit, OnDestroy } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { Subscription } from 'rxjs';
import { NgForm } from '@angular/forms';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit, OnDestroy {

  private chatsSub: Subscription;
  public user: any;
  public chats:any;
  public messages:any
  public userTo:string;

  constructor(
    private chatService: ChatService
  ) { 
    this.user = JSON.parse(localStorage.getItem('userData'));
  }

  ngOnInit(): void {
    this.chatsSub = this.chatService.getMessages(this.user.id).subscribe(
      res => {
        this.chats = res
      },
      err => {
        console.log(err)
      },
      () => {
        console.log("completed ngOnit Subscrive MessagesComponent")
      }
    )
  }

  onShowChat(userTo){
    this.userTo = userTo;
    this.chatService.getTwoUsersConversation(this.user.id, userTo).subscribe(
      (res:any) => {
        var first: {}[]  = res[0].length === 0 ? [] : res[0];
        var second: {}[] = res[1].length === 0 ? [] : res[1];
        if(first.length > second.length){
          for (let index = 0; index < second.length; index++) {
            const element:{} = second[index];
            first.push(element);
          }
          this.messages = first;
        }else{
          for (let index = 0; index < first.length; index++) {
            const element: {} = first[index];
            second.push(element);
          }
          this.messages = second;
        }
       
        this.messages.sort((a,b) => {
          return a.message.timeStamp - b.message.timeStamp
        });
        this.messages.forEach(element => {
          //element.message.timeStamp = this.timeSince(element.message.timeStamp)
          //console.log(`${element.message.messageBody} ${element.message.timeStamp} ${element.message.senderName}`)
        })
        

      },
      err => {
        console.log(err);
      },
      () => {
        console.log("completed onShowChat MessagesComponent")
      }
    )
  }

  onSendMessage(messageForm: NgForm) {
    const user = {
      id: this.user.id,
      name: this.user.email
    };
    
    this.chatService.sendMessage(user,messageForm.value.newMessage, this.user.id,this.userTo);
    messageForm.reset()
	}
  ngOnDestroy(): void {
    this.chatsSub.unsubscribe()
  }

  private timeSince(date) {

    var seconds: any = Math.floor((new Date().getTime() - date) / 1000);
  
    var interval = Math.floor(seconds / 31536000);
  
    if (interval > 1) {
      return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
      return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
      return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
      return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
      return interval + " minutes";
    }
    return Math.floor(seconds) + " seconds";
  }
}
