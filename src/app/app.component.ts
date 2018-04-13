import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  title = 'Instagram Clone';

  ngOnInit(): void {

    var config = {
      apiKey: "AIzaSyAAZckKkjZ6V02Tv_GqKYGSqJw3y2czMs0",
      authDomain: "jta-instagram-clone-e0fb4.firebaseapp.com",
      databaseURL: "https://jta-instagram-clone-e0fb4.firebaseio.com",
      projectId: "jta-instagram-clone-e0fb4",
      storageBucket: "jta-instagram-clone-e0fb4.appspot.com",
      messagingSenderId: "370605115922"
    };

    firebase.initializeApp(config);

  }

}
