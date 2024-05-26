import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  private baseUrl = 'assets/data/events.json';

  constructor(private http: HttpClient) { }

  /**
   * Obtenemos los eventos del servidor
   * @returns Observable con los datos de los eventos
   */
  getEvents(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }
}
