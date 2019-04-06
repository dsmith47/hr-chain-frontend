import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from "@angular/http";
import { Observable } from "rxjs/Observable";

@Injectable()
export class HrApiService {
  baseUrl: string = "https://api.simbachain.com/v1/HR_Chain_API"; 
  apiKey: string = "6de93c447d58ef885506901e46ff4b7eed978f7eefe9cc9ab4dd6329ea0a7f41";

  getEmployeesEndpoint = "/employee_create/";
  modifyProjectTimeEndpoint = "/time_card_modify_time/";

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

  public getEmployee(pubKey:string): Observable<any> {
    let options = new RequestOptions({
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
			   project: string,
			   minutes_worked: string
  ): Observable<any> {
    console.log(this.baseUrl)
    let options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey
      }),
    });
    let body:any = {
      'assetId': assetId,
      'from': pubKey,
      'date': date,
      'project': project,
      'minutes_worked': minutes_worked
    };
    return this.http.post(this.baseUrl + this.modifyProjectTimeEndpoint, body, options);
  }

}
