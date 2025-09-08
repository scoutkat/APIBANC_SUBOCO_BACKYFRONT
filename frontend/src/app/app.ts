import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CardGeneratorComponent } from './components/card-generator.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CardGeneratorComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Banco Inc - Frontend');
}
