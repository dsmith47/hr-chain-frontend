import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TimeCard } from './models/time_card.model';
import { Employee } from './models/employee.model';

@Injectable()
export class HrApiService {
  baseUrl = 'https://api.simbachain.com/v1/HR_Chain_V3';
  apiKey = 'e50c20bc126c1226d98a6026044109417b11351f7efba17d109d6015870917a3';

  getEmployeesEndpoint = '/employee_create/';
  createTimecardEndpoint = '/time_card_create/';
  modifyProjectTimeEndpoint = '/time_card_modify_time/';
  transactionsEndpoint = '/transaction';

  // Later on we could make state variables observable if we want to update components in real time
  // https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/

  // {pubKey:Employee}
  private employees = {};

  constructor(private http: Http) {
    this.updateData();
  }

  updateData() {
    console.log('Initializing API employee data');
    this.updateState();
  }

  public getTicketIds(): Observable<any> {
    console.log(this.baseUrl);
    const options = new RequestOptions({
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


  // ###########################################
  // Methods to update data from the block chain
  // ###########################################
  public updateState() {
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey
      })
    });

    // Find all time card creations
    this.http.get(this.baseUrl + this.transactionsEndpoint, options).subscribe((data) => {
      this.employees = {};

      const d = JSON.parse(data['_body']);
      const results = d.results;
      console.log(results);
      for ( let i = d['count'] - 1; i >= 0; i--) {
        const result = results[i];
        const method = result.payload.method;

        switch (method) {
          case 'employee_create':
            this.processCreateEmployee(result);
            break;
          case 'employee_remove':
            // TODO
            break;
          case 'time_card_create':
            this.processCreateTimeCard(result);
            break;
          case 'time_card_modify_time':
            this.processModifyTimeCard(result);
            break;
          case 'time_card_submit_for_approval':
            // TODO
            break;
          case 'time_card_approve':
            // TODO
            break;
          case 'time_card_reject':
            // TODO
            break;
          default:
            break;
        }
      }
    });
  };

  private processCreateEmployee(result) {
    const inputs = result.payload.inputs;

    const employee = new Employee();
    employee.creation_timestamp = result.timestamp;
    employee.pubKey = inputs.public_key
    employee.name = inputs.name;
    employee.supervisorPubKey = inputs.supervisor;
    employee.time_cards = {};

    this.employees[inputs.public_key] = employee;
  }

  private processCreateTimeCard(result) {
    const inputs = result.payload.inputs;

    const time_card = new TimeCard();
    time_card.creation_timestamp = result.timestamp;
    time_card.empKey = inputs.employee;
    time_card.date = inputs.date;
    time_card.status = 'in progress';

    if (inputs.employee in this.employees) {
      this.employees[inputs.employee].time_cards[inputs.date] = time_card;
    } else {
      console.log('Read time_card_create for non-existent employee.');
    }
  }

  private processModifyTimeCard(result) {
    const inputs = result.payload.inputs;

    if (!(inputs.employee in this.employees)) {
      // Needs to be created by a time_card_create
      console.log('Read time_card_modify for non-existent employee.');
      return;
    }

    if (!(inputs.date in this.employees[inputs.employee])) {
      // Needs to be created by a time_card_create
      console.log('Read time_card_modify for non-existent time card.');
      return;
    }

    // Could put a timestamp check here, but I assume we process from oldest to newest
    this.employees[inputs.employee].time_cards[inputs.date].minutes_worked = inputs.minutes_worked;
  }

  // ###########################################
  // Accessor methods
  // ###########################################
  public getEmployees() {
    return this.employees;
  };

  public getTimeCardsForEmployee(pubKey: string) {
    if (!(pubKey in this.employees)) {
      return null;
    }
    return this.employees[pubKey].time_cards;
  }

  public getTimeCardsForEmployeeOnDate(pubKey: string, date: string) {
    if (!(pubKey in this.employees) && !(date in this.employees[pubKey])) {
      return null;
    }
    return this.employees[pubKey].time_cards[date];
  }

}
