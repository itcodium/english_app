import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CacheService } from "ionic-cache";

// import { TabsPage } from '../pages/tabs/tabs';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { EnglishService } from './services/english.service';

@Component({
  templateUrl: 'app.html',
  providers: [EnglishService] // ,PouchDBService
})
export class MyApp {
  rootPage:any;

  // rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,cache: CacheService) {
    //cache.setDefaultTTL(60 * 60); //set default cache TTL for 1 hour
    cache.setDefaultTTL(0); //set default cache TTL for 1 hour
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      var user_id=window.localStorage.getItem('user_id');
      
      if(typeof user_id!='undefined' && user_id!=null){
        this.rootPage=HomePage;
      }else{
        this.rootPage=LoginPage;
      }

      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
