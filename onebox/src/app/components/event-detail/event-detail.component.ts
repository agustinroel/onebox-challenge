import { AsyncPipe, DatePipe, JsonPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import moment from 'moment';
import { Observable, tap } from 'rxjs';
import { HeaderComponent } from '../header/header.component';
import { ShoppingCartService } from '../shopping-cart/services/shopping-cart.service';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { EventDetailService } from './services/event-detail.service';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [HeaderComponent, AsyncPipe, JsonPipe, DatePipe, FormsModule, ReactiveFormsModule, MatInputModule,
    MatButtonModule, MatFormFieldModule, MatCardModule, ShoppingCartComponent],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.scss']
})
export class EventDetailComponent implements OnInit {

  title!: string;
  eventId!: string;
  event$!: Observable<any>;
  eventSessions!: any;
  sessionForms: FormGroup[] = [];

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _eventDetailSvc: EventDetailService,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private _shoppingCartSvc: ShoppingCartService) { }

  ngOnInit(): void {
    //Obtenemos el id del evento de la url
    this._activatedRoute.paramMap.subscribe(params => {
      this.eventId = params.get('id') || '';
      if (this.eventId) {
        //Hacemos llamado Http para la obtención del a información del evento
        this.event$ = this._eventDetailSvc.getEventInfo(+this.eventId).pipe(
          tap((data: any) => {
            this.title = data.event.title;
            this.eventSessions = data.sessions;
            //Inicializamos los formularios dinámicos basados en las sesiones del evento
            this.initSessionForms();
            this.cd.detectChanges();
          }),
        );
      }
    });
  }

  /**
   * Ordena las sesiones y crea dinámicamente los formularios para cada sesión con sus validadores.
   * 
   */
  initSessionForms(): void {
    // Ordenar las sesiones por fecha de manera ascendente
    this.eventSessions.sort((a: any, b: any) => parseInt(a.date) - parseInt(b.date));

    this.eventSessions.forEach((session: any) => {
      const formattedDate = moment(parseInt(session.date)).format('DD/MM/YYYY');
      this.sessionForms.push(this.fb.group({
        date: [formattedDate, Validators.required],
        availability: [session.availability, [Validators.required, Validators.min(0)]],
        selected: [0, [Validators.required, Validators.min(1), Validators.max(session.availability)]]
      }));
    });
  }

  /**
   * Agrega los tickets al carrito
   * @param event 
   * @param sessionForm 
   */
  onSubmit(event: any, sessionForm: any) {

    const eventTicketSelection = {
      event: event.event,
      selectionInfo: sessionForm
    }

    this._shoppingCartSvc.addTickets(eventTicketSelection);
  }

}
