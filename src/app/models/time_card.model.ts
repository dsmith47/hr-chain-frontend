const Status = {
  IN_PROGRESS: 'In Progress',
  SUBMITTED: 'Awaiting Approval',
  REJECTED: 'Rejected',
  APPROVED: 'Approved'
};

export class TimeCard {
  public static readonly Status = Status;

  creation_timestamp: string;
  empKey: string;
  date: string;
  minutes_worked: number;
  status: string;
}
