import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class HrApiService {
  baseUrl = 'https://api.simbachain.com/v1/HR_Chain_V3';
  apiKey = 'e50c20bc126c1226d98a6026044109417b11351f7efba17d109d6015870917a3';

  getEmployeesEndpoint = '/employee_create/';
  createTimecardEndpoint = '/time_card_create/';
  modifyProjectTimeEndpoint = '/time_card_modify_time/';

  // Later on we could make state variables observable if we want to update components in real time
  // https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/

  // {pubKey:Name}
  private employees = {};

  // {pubKey: {date: minutes_worked}}
  private time_cards = {};

  constructor(private http: Http) {
    this.updateData();
  }

  updateData() {
    console.log('Initializing API employee data');
    this.updateEmployeesData();
    this.updateTimeCardData();
  }

  public getTicketIds(): Observable<any> {
    console.log(this.baseUrl);
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey
      }),
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

  public modifyProjectTime(assetId: string, pubKey: string,
                           date: string, minutes_worked: string
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
        'APIKEY': this.apiKey
      })
    });

    return this.http.get(this.baseUrl + this.modifyProjectTimeEndpoint,
      options);
  }

  // ##########################################
  // Methods to create object on the blockchain
  // ##########################################

  public createTimecard(fromStr: string, dateStr: string, employeeStr: string): Observable<any> {
    const body = {
      from: fromStr,
      date: dateStr,
      employee: employeeStr,
    };

    const options = new RequestOptions({
      headers: new Headers({
      'APIKEY': this.apiKey,
      }),
      body: body,
    }); 

    //return this.http.post(this.baseUrl + this.createTimecardEndpoint, body, options);
    return this.http.post(this.baseUrl + this.createTimecardEndpoint, options);
    //return this.http.get(this.baseUrl + this.createTimecardEndpoint, options);
  }



  // ###########################################
  // Methods to update data from the block chain
  // ###########################################
  public updateEmployeesData() {
    const options = new RequestOptions({
        headers: new Headers({
        'APIKEY': this.apiKey
      })
    });

    this.http.get(this.baseUrl + this.getEmployeesEndpoint, options).subscribe((data) => {
      console.log('Updating employee list');

      const d = JSON.parse(data['_body']);
      const results = d.results;
      for (let i = 0; i < d['count']; i++) {
        const result = results[i].payload.inputs;
        this.employees[result.public_key] = result.name;
      }

      console.log('Done updating employee list');
    });
  }

  public updateTimeCardData() {
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey
      })
    });

    this.http.get(this.baseUrl + this.modifyProjectTimeEndpoint, options).subscribe((data) => {
      console.log('Updating time card data');

      const d = JSON.parse(data['_body']);
      const results = d.results;
      console.log(d);

      // It's important that this reads from most recent to least recent
      for (let i = 0; i < d['count']; i++) {
        const result = results[i].payload.inputs;
        if (!(result.employee in this.time_cards)){
          this.time_cards[result.employee] = {};
        }

        if (!(result.date in this.time_cards[result.employee])) {
          this.time_cards[result.employee][result.date] = result.minutes_worked;
        }
        else {
          // We already have a more recent copy of this timecard, so do nothing.
        }
      }

      console.log('Done updating time card data');
    });
  }

  // ###########################################
  // Accessor methods
  // ###########################################
  public getEmployees() {
    return this.employees;
  };

  public getAllTimeCards() {
    return this.time_cards;
  }

  public getTimeCardForEmployee(pubKey: string) {
    if (!(pubKey in this.time_cards)) {
      return null;
    }
    return this.time_cards[pubKey];
  }

  public getTimeCardForEmployeeOnDate(pubKey: string, date: string) {
    if (!(pubKey in this.time_cards) && !(date in this.time_cards[pubKey])) {
      return null;
    }
    return this.time_cards;
  }

}
