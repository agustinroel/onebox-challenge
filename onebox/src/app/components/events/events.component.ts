import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Observable, map } from 'rxjs';
import { CardComponent } from '../card/card.component';
import { HeaderComponent } from '../header/header.component';
import { EventsService } from './services/events.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [AsyncPipe, RouterModule, DatePipe, JsonPipe, CardComponent, HeaderComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.scss'
})
export class EventsComponent {

  events$: Observable<any> = this._eventsSvc.getEvents().pipe(
    map(events => events.sort((a: any, b: any) => parseInt(a.endDate) - parseInt(b.endDate)))
  );

  constructor(private _eventsSvc: EventsService) { }

}
