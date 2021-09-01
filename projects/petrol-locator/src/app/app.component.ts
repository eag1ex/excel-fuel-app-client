import { Component } from '@angular/core';
import { ApiPetrolListHttpService } from '@pl/http';
import { log } from 'x-utils-es';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'petrol-locator';
  constructor(private listHttpService: ApiPetrolListHttpService){
    this.listHttpService.list(undefined).subscribe(n => {
      log({locationList: n})
    })
  }
}
