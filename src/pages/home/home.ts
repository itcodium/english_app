import { Network } from '@ionic-native/network';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Category } from '../../model/phrase';
import { EnglishService } from '../../app/services/english.service';
import { SlidePage } from '../slides/slide';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})



export class HomePage {
  categories: Category[];
  selectedItem: Category;
  loading: boolean;
  online: boolean;
  categoriesCount:number;
  error:string;

  constructor(public navCtrl: NavController,private englishService: EnglishService,private network: Network) {}
  
  disconnectSubscription = this.network.onDisconnect().subscribe(() => {
    window.localStorage.setItem('online', "false");
    this.online=false;
    this.getCategories()
  });

  connectSubscription = this.network.onConnect().subscribe(() => {
    this.error='';
    window.localStorage.setItem('online', "true");
    this.online=true;
    this.getCategories()
  });


  stateChange(){
    console.log("CHANGED",this.online)
    window.localStorage.setItem( 'online', this.online.toString());
    this.getCategories()
  }
  ngOnInit() {

    try {
           this.online=(window.localStorage.getItem('online') == 'true');
           console.log("ngOnInit this.online",this.online)
    }catch(err) {
        this.error= err.message;
    }
    
    this.categoriesCount=undefined;
    this.getCategories();
    
  }
  getCategoriesCallService(){
     this.englishService.getCategories()
              .subscribe(categories => {
                    this.loading=false;
                    console.log("Load ok",typeof categories)
                    if(categories["ok"] ==false){
                      this.categories=[];
                      this.categoriesCount=undefined;
                    }else{
                      this.categories = categories;
                      this.categoriesCount=this.categories.length;
                      window.localStorage.setItem('categories', JSON.stringify(categories));
                    }
          })
  }
  getCategories(){
    this.loading=true;
    this.categoriesCount=undefined;
    console.log("+ this.online +",this.online)
    if(this.online){
         this.getCategoriesCallService();
      }else{
          try{
              var obj = JSON.parse(window.localStorage.getItem('categories'));
              console.log("- categories obj -> ",obj)
              this.categories = obj;
              this.categoriesCount=this.categories.length;
              this.loading=false;
              this.error="";
          }catch(err) {
            this.error= err.message;
          }
      }
    }
    itemSelected(selectedItem: Category){
      console.log("Item",selectedItem)
      this.navCtrl.push(SlidePage, selectedItem);
    }
}
