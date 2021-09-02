import { Component, OnInit } from '@angular/core';
import { appTitle } from '@pl/data';

@Component({
  selector: 'lib-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  title = appTitle
  constructor() { }

  ngOnInit(): void {
  }

}
