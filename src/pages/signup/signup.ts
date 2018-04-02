import { Component } from '@angular/core';
import { IonicPage, NavController,LoadingController, 
  Loading, 
  AlertController } from 'ionic-angular';



import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HomePage } from '../home/home';
import { EnglishService } from '../../app/services/english.service';
import { User } from '../../model/phrase';
@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
})
export class SignupPage {

  myForm: FormGroup;
  public loading:Loading;
  public user: User;
  public message:string;
  constructor(
    public navCtrl: NavController,
    public formBuilder: FormBuilder,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    private englishService: EnglishService
  ) {
    this.myForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.user=new User();
  }

  signup(){
    /* console.log("this.user:" , this.user);
    console.log("Email:" + this.myForm.value.email);
    console.log("Password:" + this.myForm.value.password); */
    this.user.email=this.myForm.value.email;
    this.user.password=this.myForm.value.password;

    this.englishService.signUp(this.user)
              .subscribe(user => {
                console.log("+ user +",user)
                if(user["status"]=="error"){
                    this.message =user["message"] 
                }else{
                    window.localStorage.setItem('user_id', user["id"]);
                    this.navCtrl.push(HomePage);
                }
          })
  }
}
