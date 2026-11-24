import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.css',
})
export class SearchBar {
  placeholder = input<string>('Buscar...');
  buscar = output<string>();
}