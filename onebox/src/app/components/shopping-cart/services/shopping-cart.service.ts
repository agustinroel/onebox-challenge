import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShoppingCartService {
  private selectedTickets = new BehaviorSubject<any[]>([]);
  selectedTickets$ = this.selectedTickets.asObservable();

  constructor(private _toastrSvc: ToastrService) { }

  /**
   * Agrega nuevos tickets al carrito. Si ya hay tickets seleccionados, suma la cantidad solicitada a la cantidad previa.
   * @param newTicket 
   */
  addTickets(newTicket: any) {
    const currentTickets = this.selectedTickets.value;
    const existingTicketIndex = currentTickets.findIndex(
      t => t.event.id === newTicket.event.id && t.selectionInfo.date === newTicket.selectionInfo.date
    );

    if (existingTicketIndex !== -1) {
      const existingTicket = currentTickets[existingTicketIndex];
      const totalSelected = existingTicket.selectionInfo.selected + newTicket.selectionInfo.selected;
      if (totalSelected > existingTicket.selectionInfo.availability) {
        // Límite de tickets excedido para esta fecha en este evento
        this._toastrSvc.error('Se ha excedido el límite disponible de tickets para este evento', 'Error')
        return false;
      } else {
        // Actualizamos la cantidad de tickets
        this._toastrSvc.success('Se han agregado tickets correctamente', '¡Exito!')
        existingTicket.selectionInfo.selected = totalSelected;
      }
    } else {
      if (newTicket.selectionInfo.selected > newTicket.selectionInfo.availability) {
        // Se superó el límite de tickets disponibles
        this._toastrSvc.error('Se ha excedido el límite disponible de tickets para este evento', 'Error')
        return false;
      } else {
        // Se agrega el nuevo ticket
        this._toastrSvc.success('Se han agregado tickets correctamente', '¡Exito!')
        currentTickets.push(newTicket);
      }
    }

    this.selectedTickets.next(currentTickets);
    return true;
  }

  removeTicket(ticket: any) {
    ticket.selectionInfo.selected -= 1;
    if (ticket.selectionInfo.selected === 0) {
      const currentTickets = this.selectedTickets.value.filter(t =>
        !(t.event.id === ticket.event.id && t.selectionInfo.date === ticket.selectionInfo.date && t.selectionInfo.selected === 0));
      this.selectedTickets.next(currentTickets);
    } else {
      this.selectedTickets.next([...this.selectedTickets.value]);
    }
  }

  getGroupedTickets() {
    const groupedTickets = this.selectedTickets.value.reduce((acc: any, ticket: any) => {
      const eventId = ticket.event.id;
      if (!acc[eventId]) {
        acc[eventId] = { event: ticket.event, tickets: [] };
      }
      acc[eventId].tickets.push(ticket.selectionInfo);
      return acc;
    }, {});
    return groupedTickets;
  }
}
