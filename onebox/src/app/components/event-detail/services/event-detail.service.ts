import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

// Importa los datos mockeados directamente
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EventDetailService {

  private baseUrl = 'assets/data/';

  constructor(private http: HttpClient) { }

  /**
   * Obtenemos los eventos del servidor
   * @param id Identificador del evento
   * @returns Observable con los datos del evento
   */
  getEventInfo(id: number): Observable<any> {
    const url = `${this.baseUrl}event-info-${id}.json`;
    return this.http.get<any>(url) as Observable<any>
  }

}