export class Employee {
  creation_timestamp: string;
  name: string;
  pubKey: string;
  supervisorPubKey: string;

  // {date: TimeCard}
  time_cards: {};
}
