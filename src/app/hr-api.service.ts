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

    // Read ALL transactions on the blockchain to determine the current state
    this.http.get(this.baseUrl + this.transactionsEndpoint, options).subscribe((data) => {
      this.employees = {};

      const d = JSON.parse(data['_body']);
      const results = d.results;
      console.log(results);

      // Note that this processes transactions from oldest to newest
      for ( let i = d['count'] - 1; i >= 0; i--) {
        const result = results[i];
        const method = result.payload.method;

        switch (method) {
          case 'employee_create':
            this.processEmployeeCreate(result);
            break;
          case 'employee_remove':
            this.processEmployeeRemove(result);
            break;
          case 'employee_set_supervisor':
            this.processEmployeeSetSupervisor(result);
            break;
          case 'time_card_approve':
            this.processTimeCardApprove(result);
            break;
          case 'time_card_create':
            this.processCreateTimeCard(result);
            break;
          case 'time_card_modify_time':
            this.processModifyTimeCard(result);
            break;
          case 'time_card_reject':
            this.processTimeCardReject(result);
            break;
          case 'time_card_submit_for_approval':
            this.processTimeCardSubmitForApproval(result);
            break;
          default:
            break;
        }
      }
    });
  };

  // Create a new employee object and add it to this.employees
  private processEmployeeCreate(result) {
    const inputs = result.payload.inputs;

    const employee = new Employee();
    employee.creation_timestamp = result.timestamp;
    employee.pubKey = inputs.public_key
    employee.name = inputs.name;
    employee.supervisorPubKey = inputs.supervisor;
    employee.time_cards = {};

    this.employees[inputs.public_key] = employee;
  }

  // Delete the employee from this.employees
  private processEmployeeRemove(result) {
    const inputs = result.payload.inputs;

    if (inputs.employee in this.employees) {
      delete this.employees[inputs.employee];
    } else {
      console.log('Tried to delete non-existent employee');
      console.log(result);
    }
  }

  // Sets the employee supervisor
  private processEmployeeSetSupervisor(result) {
    const inputs = result.payload.inputs;

    if (inputs.employee in this.employees) {
      this.employees[inputs.employee].supervisorPubKey = inputs.supervisor;
    } else {
      console.log('Tried to set supervisor for non-existent employee');
      console.log(result);
    }
  }

  // Set the status of the time card to APPROVED iff it had been submitted for approval
  private processTimeCardApprove(result) {
    const inputs = result.payload.inputs;

    if (!(inputs.employee in this.employees)) {
      console.log('Tried to approve time card for non-existent employee');
      console.log(result);
      return;
    }

    const employee = this.employees[inputs.employee];
    if (!(inputs.date in employee.time_cards)) {
      console.log('Tried to approve non-existent time card');
      console.log(result);
      return;
    }

    const time_card = employee.time_cards[inputs.date];
    if (time_card.status !== TimeCard.Status.SUBMITTED) {
      console.log('Tried to approve time card that was not submitted for approval');
      console.log(result);
      return;
    }

    this.employees[inputs.employee].time_cards[inputs.date].status = TimeCard.Status.APPROVED;
  }

  private processCreateTimeCard(result) {
    const inputs = result.payload.inputs;

    const time_card = new TimeCard();
    time_card.creation_timestamp = result.timestamp;
    time_card.empKey = inputs.employee;
    time_card.date = inputs.date;
    time_card.status = TimeCard.Status.IN_PROGRESS;

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

    const employee = this.employees[inputs.employee];
    if (!(inputs.date in employee.time_cards)) {
      // Needs to be created by a time_card_create
      console.log('Read time_card_modify for non-existent time card.');
      return;
    }

    this.employees[inputs.employee].time_cards[inputs.date].minutes_worked = inputs.minutes_worked;
    this.employees[inputs.employee].time_cards[inputs.date].status = TimeCard.Status.IN_PROGRESS;
  }

  // Set the status of the time card to REJECTED iff it had been submitted for approval
  // This code is mostly duplicated from processTimeCardApprove, I could've made them share code but oh well
  private processTimeCardReject(result) {
    const inputs = result.payload.inputs;

    if (!(inputs.employee in this.employees)) {
      console.log('Tried to approve time card for non-existent employee');
      console.log(result);
      return;
    }

    const employee = this.employees[inputs.employee];
    if (!(inputs.date in employee.time_cards)) {
      console.log('Tried to approve non-existent time card');
      console.log(result);
      return;
    }

    const time_card = employee.time_cards[inputs.date];
    if (time_card.status !== TimeCard.Status.SUBMITTED) {
      console.log('Tried to approve time card that was not submitted for approval');
      console.log(result);
      return;
    }

    this.employees[inputs.employee].time_cards[inputs.date].status = TimeCard.Status.REJECTED;
  }

  private processTimeCardSubmitForApproval(result) {
    const inputs = result.payload.inputs;

    if (!(inputs.employee in this.employees)) {
      console.log('Tried to approve time card for non-existent employee');
      console.log(result);
      return;
    }

    const employee = this.employees[inputs.employee];
    if (!(inputs.date in employee.time_cards)) {
      console.log('Tried to approve non-existent time card');
      console.log(result);
      return;
    }

    const time_card = employee.time_cards[inputs.date];
    if (time_card.status !== TimeCard.Status.IN_PROGRESS) {
      console.log('Tried to approve time card that was not submitted for approval');
      console.log(result);
      return;
    }

    this.employees[inputs.employee].time_cards[inputs.date].status = TimeCard.Status.REJECTED;
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
