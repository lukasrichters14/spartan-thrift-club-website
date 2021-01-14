import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-connect',
  templateUrl: './connect.component.html',
  styleUrls: ['./connect.component.css']
})
export class ConnectComponent implements OnInit {

  submitSuccess = false;
  submitFailure = false;

  // Forms.
  emailGroup = new FormGroup({
    firstName : new FormControl('', Validators.required),
    lastName : new FormControl('', Validators.required),
    email : new FormControl('', [Validators.required, Validators.email])
  });

  constructor(private firebase: AngularFireDatabase) { }

  ngOnInit(): void {
  }


  OnSubmit(): void
  {
    if (this.emailGroup.valid) {
      this.DatabaseInsert();
    }
  }

  DatabaseInsert(): void {
    // Get form values
    const fName = this.emailGroup.value.firstName;
    const lName = this.emailGroup.value.lastName;
    let email = this.emailGroup.value.email;
    const database = this.firebase.database;

    const name = `${fName} ${lName}`;

    // Format email so it can be properly added to the database.
    let tempEmail = '';
    for (let i = 0; i < email.length; i++) {
      if (email[i] == '.') {
        tempEmail += '~';
      } else {
        tempEmail += email[i];
      }
    }

    email = tempEmail;

    // Check database for email.
    database.ref('email-list/' + email).once('value').then(snapshot => {
      const result = snapshot.val();

      // Email doesn't exist, add it.
      if (!result) {
        // Add email to the database.
        database.ref('email-list/' + email).set(name).then((value) => {
          this.emailGroup.reset();
          this.submitSuccess = true;
        });
      }
      else {
        this.submitFailure = true;
      }
    });
  }

}
