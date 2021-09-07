import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Observable } from 'rxjs'
import { filter, map, tap } from 'rxjs/operators'
import { log } from 'x-utils-es'

@Component({
    selector: 'lib-error',
    templateUrl: './error.component.html',
    styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
    constructor(private activatedRoute: ActivatedRoute) {}

    get error$(): Observable<string> {
        return this.activatedRoute.queryParams
        .pipe(tap(n => {
            log('error route', n)
        }))
        .pipe(map((n: { message?: string }) => n?.message)).pipe(filter((n) => !!n))
    }
    ngOnInit(): void {}
}
