import { Injectable } from '@angular/core';

import { of } from 'rxjs/observable/of';
import { Phrase,Category,User } from '../../model/phrase';

import { HttpClient } from '@angular/common/http';


// import { Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';


import 'rxjs/add/operator/map';

import { catchError } from 'rxjs/operators';
import { CacheService } from "ionic-cache";

import { HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json' 
  })
};

@Injectable()
export class EnglishService {

  // https://github.com/Nodonisko/ionic-cache
  ///  private apiUrlPhrases = 'http://chatbot-chatbot01.7e14.starter-us-west-2.openshiftapps.com/api/ingles/phrases'
  
  // private api="http://127.0.0.1:5000/api/ingles/";
  private api="http://chatbot-chatbot01.7e14.starter-us-west-2.openshiftapps.com/api/ingles/";
  // private user_id=window.localStorage.getItem('user_id');
  
  private apiUrlPhrases =this.api+ 'phrases';
  private apiUrlCategories = this.api+'categories';
  private apiUrlSignUp = this.api+'signup';
  private apiUrlLogin = this.api+'login';
  private apiUrlLearnedWord= this.api+'learnedword';

  

  constructor(private http: HttpClient) { //, private cache: CacheService

  }

  getPhrases(filter:string): Observable<Phrase[]>{
    var id=window.localStorage.getItem('user_id');
    let cacheKey = this.apiUrlPhrases+"?category="+filter+"&u="+id;
    // console.log("filter -> ", filter,cacheKey)
     let request= this.http.get<Phrase[]>(cacheKey).pipe(
      catchError(this.handleError('getPhrases', []))
    );
    return request;
  }
  getCategories(): Observable<Category[]>{
    // let cacheKey = this.apiUrlCategories;
     let request= this.http.get<Category[]>(this.apiUrlCategories).pipe(
      catchError(this.handleError('getCategories', []))
    );
    return request;
  }

  signUp(user: User): Observable<User>{
   //let bodyString = JSON.stringify(User); 
    return this.http.post<User>(this.apiUrlSignUp, user, httpOptions)
    .pipe(
      catchError(this.handleError('addHero', user))
    );
  }

  login(user: User): Observable<User>{
   // let bodyString = JSON.stringify(User); 
    return this.http.post<User>(this.apiUrlLogin, user, httpOptions)
    .pipe(
      catchError(this.handleError('Login', user))
    );
  }

  learnedWord(params: String): Observable<object>{
    // let cacheKey = this.apiUrlPhrases+"?category="+filter+"&u="+id;
     console.log("this.apiUrlLearnedWord -> ", this.apiUrlLearnedWord)
    return this.http.post<object>(this.apiUrlLearnedWord+"?"+params, {}, httpOptions)
    .pipe(
      catchError(this.handleError('learnedWord',{} ))
    );
  }  

 

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // log to console instead
      return of(error as T);
    };
  }
}
