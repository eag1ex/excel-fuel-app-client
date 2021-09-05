import { Component } from '@angular/core';
import { ExcelItemHttpService } from '@excel/http';
import { log } from 'x-utils-es';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'excel-fuel';
  constructor(private excelItemHttpService: ExcelItemHttpService){
    log('app loaded?')
    this.excelItemHttpService.getStation$.subscribe(n => {
      log({getStation: n})
    })

    // static ids
   // 61335ac2faf7da2be5d966db
   // 61335ac2faf7da2be5a0dad3

    this.excelItemHttpService.sub$.next('61335ac2faf7da2be5d966db')

  }
}
