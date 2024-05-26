import { AsyncPipe, JsonPipe, KeyValuePipe } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Observable, map } from 'rxjs';
import { ShoppingCartService } from './services/shopping-cart.service';

interface Event {
  id: string;
  title: string;
  subtitle: string;
  image: string;
}

interface SelectionInfo {
  date: string;
  availability: string;
  selected: number;
}

interface GroupedTickets {
  [title: string]: {
    event: Event;
    tickets: SelectionInfo[];
  };
}

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [AsyncPipe, JsonPipe, KeyValuePipe, MatCardModule],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})

export class ShoppingCartComponent {
  groupedTickets$!: Observable<GroupedTickets>;

  constructor(private _shoppingCartSvc: ShoppingCartService) { }

  async ngOnInit() {
    this.groupedTickets$ = this._shoppingCartSvc.selectedTickets$.pipe(
      map(tickets => this.groupTicketsByEvent(tickets))
    );
  }

  groupTicketsByEvent(tickets: any[]): GroupedTickets {
    return tickets.reduce((acc: any, ticket: any) => {
      const eventTitle = ticket.event.title;
      if (!acc[eventTitle]) {
        acc[eventTitle] = { event: ticket.event, tickets: [] };
      }
      acc[eventTitle].tickets.push(ticket.selectionInfo);
      return acc;
    }, {} as GroupedTickets);
  }

  removeTicket(event: Event, selectionInfo: SelectionInfo) {
    this._shoppingCartSvc.removeTicket({ event, selectionInfo });
  }

}
