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

  DatabaseInsert(): void
  {
    // Get form values
    const fName = this.emailGroup.value.firstName;
    const lName = this.emailGroup.value.lastName;
    let email = this.emailGroup.value.email;
    const database = this.firebase.database;

    const name = `${fName} ${lName}`;

    // Check database for name.
    database.ref('email-list/' + name).once('value').then(snapshot => {
      const result = snapshot.val();

      // Name exists, so add to emails associated with that name.
      // This way people with the same name can easily have their emails added.
      if (result) {
        let emails = result.split(', ');

        let found = false;
        for (let i = 0; i < emails.length; ++i){
          if (emails[i] == email){
            found = true;
          }
        }

        // Email doesn't already exist.
        if (!found) {
          email += `, ${result}`;
        }
      }

      // Add email to the database.
      database.ref('email-list/' + name).set(email).then((value) => {
        this.emailGroup.reset();
        this.submitSuccess = true;
      });
    });
  }

}
