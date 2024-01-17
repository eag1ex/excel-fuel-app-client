/**
 * @description excel/stations api calling our excel/server, to get static data
 */
import { HttpClient } from '@angular/common/http'
import { log } from 'x-utils-es'
import { Observable } from 'rxjs'
import { timeout, retry } from 'rxjs/operators'
import { Inject, Injectable } from '@angular/core'
import { ENV, ExcelStationsResp } from '@excel/interfaces'

@Injectable({
    providedIn: 'root',
})
export class ExcelStationsHttpService {
    private apiBaseUrl: string
    constructor(private http: HttpClient, @Inject('ENVIRONMENT') protected ENVIRONMENT: ENV) {
        this.apiBaseUrl = this.ENVIRONMENT.apiBaseUrl
    }

    /**
     * (GET) /api/excel/stations
     * list all stations for current user
     */
    stations(): Observable<ExcelStationsResp> {
        const url = this.apiBaseUrl + `/excel/stations`
        log(`-- calling ${url}`)
        return this.http.get<any>(`${url}`).pipe(timeout(10000), retry(1))
    }
}
