import { Component, OnInit, Inject } from '@angular/core';
import { appTitle } from '@excel/data';
import { PLUser } from '@excel/interfaces';

@Component({
  selector: 'lib-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {
  title = appTitle
  userName: string
  constructor( @Inject('USER') protected USER: PLUser) {
    this.userName = this.USER?.username
  }

  ngOnInit(): void {
  }

}
