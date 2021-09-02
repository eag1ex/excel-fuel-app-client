import { Component } from '@angular/core';
import { PetrolHttpService } from '@pl/http';
import { log } from 'x-utils-es';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'petrol-locator';
  constructor(private petrolHttpService: PetrolHttpService){
    this.petrolHttpService.list(undefined).subscribe(n => {
      log({locationList: n})
    })
  }
}
