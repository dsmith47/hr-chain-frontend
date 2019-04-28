export class TimeCard {
  creation_timestamp: string;
  empKey: string;
  date: string;
  minutes_worked: number;

  // Valid statuses:
  // "in progress", "submitted for approval", "rejected", "approved"
  status: string;
}
