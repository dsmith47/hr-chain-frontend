import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HrApiService {
  baseUrl = 'https://api.simbachain.com/v1/HR_Chain_V3';
  apiKey = 'e50c20bc126c1226d98a6026044109417b11351f7efba17d109d6015870917a3';

  getEmployeesEndpoint = '/employee_create/';
  modifyProjectTimeEndpoint = '/time_card_modify_time/';

  constructor(private http: Http) {}

  public getTicketIds(): Observable<any> {
    console.log(this.baseUrl)
    let options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey
      })
    });
    return this.http.get(this.baseUrl + this.getEmployeesEndpoint, options);
  }

  public getEmployee(pubKey: string): Observable<any> {
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey
      })
    });

    return this.http.get(this.baseUrl + this.getEmployeesEndpoint,
                         options);
  }

  public modifyProjectTime(assetId: string,
                           pubKey: string,
			   date: string,
			   minutes_worked: string
  ): Observable<any> {
    console.log(this.baseUrl);
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey
      }),
    });
    const body: any = {
      'assetId': assetId,
      'from': pubKey,
      'employee': pubKey,
      'date': date,
      'minutes_worked': minutes_worked
    };
    return this.http.post(this.baseUrl + this.modifyProjectTimeEndpoint, body, options);
  }

  public getEmployeeTimeCards(pubKey: string): Observable<any> {
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey,
        'project_exact': 'hackathon',
      })
    });

    return this.http.get(this.baseUrl + this.modifyProjectTimeEndpoint,
      options);
  }

}
