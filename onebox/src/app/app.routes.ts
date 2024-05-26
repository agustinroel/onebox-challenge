import { Routes } from '@angular/router';
import { EventDetailComponent } from './components/event-detail/event-detail.component';
import { EventsComponent } from './components/events/events.component';
import { ShoppingCartComponent } from './components/shopping-cart/shopping-cart.component';

export const routes: Routes = [
    { path: '', redirectTo: 'events', pathMatch: 'full' },
    { path: 'events', component: EventsComponent },
    { path: 'event-detail/:id', component: EventDetailComponent },
    { path: 'shopping-cart', component: ShoppingCartComponent }
];