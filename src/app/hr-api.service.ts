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
  approveTimecardEndpoint = '/time_card_approve/';
  rejectTimecardEndpoint = '/time_card_reject/';
  transactionsEndpoint = '/transaction/';
  submitTimecardEndpoint = '/time_card_submit_for_approval/';

  // Later on we could make state variables observable if we want to update components in real time
  // https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/

  // {pubKey:Employee}
  public employees = {};
  private _lastReadResultId = null; // TODO: Planning to use local storage so this is useful

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
      'assetId': '0',
      'from': fromStr,
      'date': dateStr,
      'employee': employeeStr,
    };

    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey,
      }),
    });

    return this.http.post(this.baseUrl + this.createTimecardEndpoint, body, options);
  }

  public submitTimecard(fromStr: string, dateStr: string, employeeStr: string): Observable<any> {
    const body = {
      'assetId': '0',
      'from': fromStr,
      'date': dateStr,
      'employee': employeeStr,
    };

    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey,
      }),
    });

    return this.http.post(this.baseUrl + this.submitTimecardEndpoint, body, options);
  }

  public postApproveTimecard(date: string, employee: string, from: string) {
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey,
      })
    });
    const body = {
      'from': from,
      'date': date,
      'employee': employee,
      'assetId': '0',
    };

    return this.http.post(this.baseUrl + this.approveTimecardEndpoint, body, options);
  }

  public postRejectTimecard(date: string, employee: string, from: string) {
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey,
      })
    });
    const body = {
      'from': from,
      'date': date,
      'employee': employee,
      'assetId': '0',
    };

    return this.http.post(this.baseUrl + this.rejectTimecardEndpoint, body, options);
  }
  // ###########################################
  // Methods to update data from the block chain
  // ###########################################

  public getTransactions(): Observable<any> {
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey
      })
    });

    // Read ALL transactions on the blockchain to determine the current state
    return this.http.get(this.baseUrl + this.transactionsEndpoint, options);
  }

  public updateState() {
    const options = new RequestOptions({
      headers: new Headers({
        'APIKEY': this.apiKey
      })
    });

    // Read ALL transactions on the blockchain to determine the current state
    this.http.get(this.baseUrl + this.transactionsEndpoint, options).subscribe((data) => {
      this.processData(data);
    });
  };

  // Processes the entirety of the blockchain
  public processData(data) {
    this.employees = {};

    const d = JSON.parse(data['_body']);
    const results = d.results.sort(function(a, b){
      const date1 = Date.parse(a.timestamp);
      const date2 = Date.parse(b.timestamp);
      return date1 < date2;
    });
    console.log(results);

    // So that we don't need to re-process the whole blockchain each time
    // TODO: Planning to use local storage so that this is useful
    let reached_last_read_transaction = false;
    if (this._lastReadResultId === null) {
      reached_last_read_transaction = true;
    }

    // Note that this processes transactions from oldest to newest
    for ( let i = d['count'] - 1; i >= 0; i--) {
      const result = results[i];
      const method = result.payload.method;

      // TODO: Planning to use local storage so this is useful
      // Check if we have already processed this data
      if (reached_last_read_transaction) {
        this._lastReadResultId = result.id;
      } else {
        if (result.id === this._lastReadResultId) {
          reached_last_read_transaction = true;
        }
        console.log('Already read this transaction, skipping.');
        continue;
      }
      this._lastReadResultId = result.id;

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

    return this.employees;
  }

  // Create a new employee object and add it to this.employees
  private processEmployeeCreate(result) {
    const inputs = result.payload.inputs;

    const employee = new Employee();
    employee.creation_timestamp = result.timestamp;
    employee.pubKey = inputs.public_key;
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
    time_card.minutes_worked = 0;

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

    this.employees[inputs.employee].time_cards[inputs.date].status = TimeCard.Status.SUBMITTED;
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
    console.log(this.employees);

    if (this.employees === undefined) {
      console.log('HrApiService.employees is undefined');
      return new TimeCard();
    };

    if (!(pubKey in this.employees)) {
      console.log('pubKey doesn\'t exist in HrApiService.employees');
      return new TimeCard();
    }

    if (!(date in this.employees[pubKey].time_cards)) {
      console.log('time card for this date doesn\'t exist in HrApiService.employees');
      return new TimeCard();
    }

    return this.employees[pubKey].time_cards[date];
  }
}
