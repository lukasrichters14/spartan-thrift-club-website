import { Component, OnInit } from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';

@Component({
  selector: 'app-unsubscribe',
  templateUrl: './unsubscribe.component.html',
  styleUrls: ['./unsubscribe.component.css']
})
export class UnsubscribeComponent implements OnInit {

  constructor(private firebase: AngularFireDatabase) { }

  ngOnInit(): void {
    this.UnsubscribeEmail(window.location.href);
  }

  UnsubscribeEmail(pageUrl: string): void {
    // Get query parameters.
    const params = pageUrl.substring(pageUrl.indexOf('?') + 1);
    let email = params.substring(params.indexOf('=') + 1);

    // Format email so it can query the database.
    let tempEmail = '';
    for (let i = 0; i < email.length; i++) {
      if (email[i] == '.') {
        tempEmail += '~';
      } else {
        tempEmail += email[i];
      }
    }

    email = tempEmail;

    let database = this.firebase.database;

    // Check database for email.
    database.ref('email-list/' + email).once('value').then(snapshot => {
      // Remove email from the database.
      database.ref('email-list/' + email).remove().then((value) => {
        console.log("Removed");
      });
    });
  }

}
