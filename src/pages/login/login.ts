import { Component } from '@angular/core';
import { NavController,LoadingController, Loading, AlertController} from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../model/phrase';
//import { Observable } from 'rxjs/Observable';
import { Network } from '@ionic-native/network';
import { HomePage } from '../home/home';
import { EnglishService } from '../../app/services/english.service';

// @IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})


export class LoginPage {

  myForm: FormGroup;
  
  public loading:Loading;
  public user: User;
  public message:string;
  public online: boolean;
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private englishService: EnglishService,
    private network: Network

  ) {
    var user_id=window.localStorage.getItem('user_id');
    if(typeof user_id!='undefined' && user_id!=null){
        this.navCtrl.push(HomePage);
        console.log("2")
    }
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.user=new User();
  }


  disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    window.localStorage.setItem('online', "false");
    this.online=false;
  });
  connectSubscription = this.network.onConnect().subscribe(() => {
    window.localStorage.setItem('online', "true");
    this.online=true;
  });
  stateChange(){
    window.localStorage.setItem( 'online', this.online.toString());
  }

  loginUser(){
    this.user.email=this.myForm.value.email;
    this.user.password=this.myForm.value.password;

    this.englishService.login(this.user)
              .subscribe(user => {
                console.log("Login -> ",user)
                if(user["status"].toUpperCase()=="ERROR"){
                    this.message =user["message"] 
                    console.log("Login error -> ",user)
                }else{
                    console.log("Login ok -> ",user._id["$oid"])
                    window.localStorage.setItem('user_id', user._id["$oid"]);
                    this.navCtrl.push(HomePage);
                }
                
          })
  }
  

  goToSignup(){
    this.navCtrl.push('SignupPage');
  }

  goToResetPassword(){
    this.navCtrl.push('ResetPasswordPage');
  }

}
