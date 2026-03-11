import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private subject!: WebSocketSubject<any>;

  constructor() {
  }

  public connect() {
    this.subject = webSocket({
      // url: "wss://i4.utclconnect.com/uat/opt/blaine",
      // url: "wss://i4.utclconnect.com/api/opt/blaine",
      url:environment.socketUrl,
      openObserver: {
        next: () => {
            console.log('connexion ok');
        }
      },
      closeObserver: {
        next: () => {
           this.connect();
        }
      }
    });

    

    // this.subject.subscribe(
    //   (msg:any) =>{
    //     {
    //       return of(JSON.parse(JSON.stringify(msg)))
    //     } 
    //   },
    //   (err)=>{
    //     console.log(err)
    //   } 
    //   // () => console.log('complete')
    // );
  }

  public send(msg: string) {
    this.subject.next(msg);
    return this.subject
  }

  public disconnect() {
    this.subject.complete();
  }
}
