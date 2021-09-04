import { Component } from '@angular/core';
import { PetrolItemHttpService } from '@pl/http';
import { log } from 'x-utils-es';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'petrol-locator';
  constructor(private petrolItemHttpService: PetrolItemHttpService){
    log('app loaded?')
    this.petrolItemHttpService.getStation$.subscribe(n => {
      log({getStation: n})
    })

    // static ids
   // 61335ac2faf7da2be5d966db
   // 61335ac2faf7da2be5a0dad3

    this.petrolItemHttpService.sub$.next('61335ac2faf7da2be5d966db')

  }
}
