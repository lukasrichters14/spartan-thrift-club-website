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

    // Separate name.
    let name = params.substring(0, params.indexOf('&'));
    name = name.substring(name.indexOf('=') + 1);

    // Remove html space characters.
    let temp = '';
    for (let i = 0; i < name.length; ++i) {
      if (name[i] != "%" && name[i] != "2" && name[i] != "0") {
        temp += name[i];
      } else {
        if (name[i] == '%') {
          temp += ' ';
        }
      }
    }
    name = temp;

    // Separate email.
    let email = params.substring(params.indexOf('&') + 1);
    email = email.substring(email.indexOf('=') + 1);

    let database = this.firebase.database;

    // Check database for name.
    database.ref('email-list/' + name).once('value').then(snapshot => {
      // Get emails from database.
      let result = snapshot.val();

      // Separate emails.
      let emails = result.split(', ');

      // Add all emails that aren't the one we're trying to remove.
      result = '';
      for (let i = 0; i < emails.length; ++i) {
        if (emails[i] != email) {
          result += emails[i] + ', '
        }
      }

      // Remove trailing ', '
      result = result.substring(0, result.length - 2);

      // Write to the database.
      database.ref('email-list/' + name).set(result).then((value) => {
        console.log("Removed");
      });
    });
  }

}
