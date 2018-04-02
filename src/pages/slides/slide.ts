import { Component } from '@angular/core'; // ,ViewChild 
import { NavController, NavParams } from 'ionic-angular';
import { Phrase } from '../../model/phrase';
import { EnglishService } from '../../app/services/english.service';
import { ToastController } from 'ionic-angular';
//import { Slides } from 'ionic-angular';


@Component({
  selector: 'page-slide',
  templateUrl: 'slide.html'
})
export class SlidePage {
  title:string;
  text: string;
  loading: boolean;
  phrases: Phrase[];
  slideCount: number;
  currentIndex : number;
  error:string;
  data:string;
  sPost:string;
  message:string;
  online:boolean;
  selected:object;
  learnedStyle:string; 
  learnedLoading: boolean;
  /*
  @ViewChild(Slides) slides: Slides;
   slideChanged() {
    this.currentIndex = this.slides.getActiveIndex()+1;
  }
  */
  
  constructor(private englishService: EnglishService,public navCtrl: NavController, public navParams: NavParams,private toastCtrl: ToastController) {
        this.title=navParams.data.category;
        this.sPost="";
        this.message="";
        this.learnedStyle="danger"
        this.learnedLoading=false;
  }
  presentToast(message:string) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000,
      position: 'top'
    });

    toast.onDidDismiss(() => {
      console.log('Dismissed toast');
    });

    toast.present();
  }

  mostrar(){
    this.selected["show"]=true;
    console.log("this.selected",this.selected)
  }
prev(){
    this.learnedStyle="danger"
    var curInd=this.currentIndex-1;
    if(curInd>=0){
      this.selected=this.phrases[--this.currentIndex];
    }
  }
  next(){
    this.learnedStyle="danger"
    var curInd=this.currentIndex+1;
    if(curInd<this.phrases.length){
      this.selected=this.phrases[++this.currentIndex];
    }
  }
 ngOnInit() {
    this.slideCount=0;
    this.currentIndex=0;
    this.selected={};
    try {
        this.online=(window.localStorage.getItem('online') == 'true');
        if(this.online){
          this.getPhrases(this.title);    
        }else{
            var obj = JSON.parse(window.localStorage.getItem(this.title));
            this.loading= false;
            this.currentIndex = 0;
            this.phrases = obj;
            this.slideCount=this.phrases.length;
            this.selected=this.phrases[0];
        }
        
    }
    catch(err) {
        this.error= err.message;
    }
 }

  learned(){
    var user_id=window.localStorage.getItem('user_id');
    var params="u="+user_id+"&w="+this.selected["_id"]+"&category="+this.selected["category"];
    this.learnedLoading=true;
    this.englishService.learnedWord(params)
              .subscribe(response => {
                this.learnedLoading=false;
                if(response["status"].toUpperCase()=="ERROR"){
                    this.presentToast(response["message"]);
                }else{
                  this.presentToast("El registro se ha modificado correctamente.");
                  this.learnedStyle="secondary" 
                }
          })
  }

 mostratTexto(){
    try{
      this.phrases[this.currentIndex-1].show=true;
    }catch(err){
        console.log(err.message);
    }
 }

 getPhrases(filter:string ): void {
        this.loading= true;
        this.slideCount=undefined;
        this.englishService.getPhrases(filter)
            .subscribe(phrases => {
                console.log("phrases[status]",phrases["status"])
              if(typeof phrases!='undefined' && typeof phrases["status"]!='undefined'){
                  this.message=phrases["message"];
                  this.loading= false;
              }else{
              
                  this.loading= false;
                  this.currentIndex = 0;
                  this.selected = phrases[this.currentIndex];
                  this.phrases = phrases;
                  this.slideCount=phrases.length;
                  console.log("+ phrases +",this.currentIndex ,this.slideCount,this.phrases );
                  window.localStorage.setItem(this.title, JSON.stringify(phrases));
              }
    });
   }

}
