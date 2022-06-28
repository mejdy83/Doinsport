
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders , HttpParams} from '@angular/common/http';
import { tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Storage } from '@ionic/storage'; 
const ACCESS_TOKEN_KEY = 'my-access-token';
const REFRESH_TOKEN_KEY = 'my-refresh-token';
 
@Injectable({
  providedIn: 'root'
})
export class AuthentificationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
  currentAccessToken = null;
  url = environment.URL_API;
 
  constructor(private http: HttpClient, private router: Router,private storage:Storage) {
    this.loadToken();
  }
 
  // Load accessToken on startup
  async loadToken() {
    const token = await this.storage.get('ACCESS TOKEN KEY');    
    if (token) {
      this.currentAccessToken = token;
      console.log(token)
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }
 async remember(login,password){
  this.storage.set("username", login);
  this.storage.set("password",password);
 }
  // Get our secret protected data
  getSecretData() {
    return this.http.get(`${this.url}me`);
  }
 
  // Create new user
  signUp(credentials: {username, password}): Observable<any> {
    return this.http.post(`${this.url}/users`, credentials);
  }
 
  // Sign in a user and store access and refres token
  login(credentials: {username, password}): Observable<any> {
    return this.http.post(`${this.url}/auth/signin`, credentials).pipe(
      switchMap((tokens: {accessToken, refreshToken }) => {
        this.currentAccessToken = tokens.accessToken;
        const storeAccess = this.storage.set(ACCESS_TOKEN_KEY, tokens.accessToken);
        const storeRefresh = this.storage.set(REFRESH_TOKEN_KEY, tokens.refreshToken);
        console.log(storeAccess,storeRefresh)
        return from(Promise.all([storeAccess, storeRefresh]));
      }),
      tap(_ => {
        this.isAuthenticated.next(true);
      })
    )
  }
  
  todoFilter(){
    const refreshToken = from(this.storage.get(REFRESH_TOKEN_KEY ));
    return refreshToken.pipe(
      switchMap(token => {
        if (token) {
          const httpParam={page:'1',limit:'10',search:'Salut'}
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }),httpParam
          }
          
          this.http.get(`${this.url}todos`, httpOptions).subscribe((res)=>console.log(res))
          return this.http.get(`${this.url}todos`, httpOptions);
        } else {
          // No stored refresh token
          return of(null);
        }
      })
    );
  }
  // Load the refresh token from storage
  // then attach it as the header for one specific API call
  getUserInfo() {
    const refreshToken = from(this.storage.get(REFRESH_TOKEN_KEY ));
    return refreshToken.pipe(
      switchMap(token => {
        if (token) {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            })
          }
          this.http.get(`${this.url}/me`, httpOptions).subscribe((res)=>console.log(res))
          return this.http.get(`${this.url}/me`, httpOptions);
        } else {
          // No stored refresh token
          return of(null);
        }
      })
    );
  }
  getTodo() {
    const refreshToken = from(this.storage.get(REFRESH_TOKEN_KEY ));
    return refreshToken.pipe(
      switchMap(token => {
        if (token) {
          
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            }),
          }
          this.http.get(`${this.url}todos/`, httpOptions).subscribe((res)=>console.log(res))
          return this.http.get(`${this.url}todos/`, httpOptions);
        } else {
          // No stored refresh token
          return of(null);
        }
      })
    );
  }

  postTodo(body) {
    const refreshToken = from(this.storage.get(REFRESH_TOKEN_KEY ));
    return refreshToken.pipe(
      switchMap(token => {
        if (token) {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            })
          }
          this.http.post(`${this.url}todo`,body, httpOptions).subscribe((res)=>console.log(res))
          return this.http.post(`${this.url}todo/`, httpOptions);
        } else {
          // No stored refresh token
          return of(null);
        }
      })
    );
  }
  deleteTodo(id) {
    const refreshToken = from(this.storage.get(REFRESH_TOKEN_KEY ));
    return refreshToken.pipe(
      switchMap(token => {
        if (token) {
          const httpOptions = {
            headers: new HttpHeaders({
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            })
          }
          //this.http.delete(`${this.url}todo/`+id, httpOptions).subscribe((res)=>console.log(res))
          return this.http.delete(`${this.url}todo/`+id, httpOptions);
        } else {
          // No stored refresh token
          return of(null);
        }
      })
    );
  }
  // Store a new access token
  storeAccessToken(accessToken) {
    this.currentAccessToken = accessToken;
    return from(this.storage.set(ACCESS_TOKEN_KEY, accessToken ));
  }
}