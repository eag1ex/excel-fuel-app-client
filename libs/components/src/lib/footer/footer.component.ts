import { Component, OnInit } from '@angular/core';
import { appTitle } from '@excel/data';

@Component({
  selector: 'lib-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  footerTitle = appTitle
  constructor() { }

  ngOnInit(): void {
  }

}
