import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap  } from 'rxjs';

export interface SigninResponse {
  login: string;
  token?: string;
  userRole?: string;
}

@Injectable({
  providedIn: 'root'
})
export class Auth {
  private apiUrl = '/api/v1.0/signin';

  constructor(private http: HttpClient) {}

 signin(credentials: {
  username: string;
  password: string;
}): Observable<SigninResponse> {
  return this.http.post<SigninResponse>(
    this.apiUrl,
    credentials
  ).pipe(
    tap((response) => {
      if (response.token) {
        localStorage.setItem('token', response.token);
      }

      if (response.userRole) {
        localStorage.setItem('userRole', response.userRole);
      }
    })
  );
}
  logout(): void {
  localStorage.removeItem('token');
  localStorage.removeItem('userRole');
}
}