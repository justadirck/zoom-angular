import { Component, OnInit, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { DOCUMENT } from '@angular/common'

import ZoomMtgEmbedded from '@zoomus/websdk/embedded'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    signatureEndpoint = 'http://localhost:4000'
    sdkKey = 'qsC0It0gIcqS3UPgvW6V2MaREcuraPCqFiyn'
    meetingNumber = '6167781812'
    role = 0
    userName = 'justadirck'
    userEmail = ''
    passWord = 'Pv8v1t'
    registrantToken = ''

    client = ZoomMtgEmbedded.createClient()

    constructor(public httpClient: HttpClient, @Inject(DOCUMENT) document) {

    }

    ngOnInit(): any {
      const meetingSDKElement = document.getElementById('meetingSDKElement')

      this.client.init({
        debug: true,
        zoomAppRoot: meetingSDKElement,
        language: 'en-US',
        customize: {
          meetingInfo: ['topic', 'host', 'mn', 'pwd', 'telPwd', 'invite', 'participant', 'dc', 'enctype'],
          toolbar: {
            buttons: [
              {
                text: 'Approve',
                className: 'CustomButton',
                onClick: () => {
                  console.log('custom button')
                }
              }
            ]
          }
        }
      })
    }

    getSignature(): any {
      this.httpClient.post(this.signatureEndpoint, { meetingNumber: this.meetingNumber, role: this.role })
        .toPromise().then((data: any) => {
          if (data.signature) {
            console.log(data.signature)
            this.startMeeting(data.signature)
          } else {
            console.log(data)
          }
        }).catch((error) => {
          console.log(error)
        })
    }

    startMeeting(signature: any): any {
      this.client.join({
        signature,
        sdkKey: this.sdkKey,
        meetingNumber: this.meetingNumber,
        password: this.passWord,
        userName: this.userName,
        userEmail: this.userEmail,
        tk: this.registrantToken
      })
    }
}
