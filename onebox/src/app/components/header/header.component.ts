import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})

export class HeaderComponent {

  //Variables
  @Input('title') title!: string;
  @Input('showBackButton') showBackButton!: boolean;

  constructor(private _router: Router) {

  }

  /**
   * Navegación hacia la página anterior
   */
  goBack() {
    this._router.navigate(['..'])
  }
}
