import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header'
import { Footer } from './components/footer/footer'
import { ItemCard } from './components/item-card/item-card'
@Component({
  imports: [RouterOutlet, Header,ItemCard, Footer],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  title = ('My app with Angular');
}
