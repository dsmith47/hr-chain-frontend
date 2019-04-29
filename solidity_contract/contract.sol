pragma solidity ^0.4.24;

contract Application {
    function Application() public {}
    enum Assets {
        TimeCard, Employee
    }
    Assets _time_card_reject = Assets.TimeCard;
    Assets _time_card_approve = Assets.TimeCard;
    Assets _time_card_submit_for_approval = Assets.TimeCard;
    Assets _employee_remove = Assets.Employee;
    Assets _employee_set_supervisor = Assets.Employee;
    Assets _time_card_modify_time = Assets.TimeCard;
    Assets _time_card_create = Assets.TimeCard;
    Assets _employee_create = Assets.Employee;

    function time_card_reject (
        string assetId, /* parameter needed for linking assets and transactions */
        string date, /* optional parameter */
        address employee)   /* optional parameter */
    public {}

    function time_card_approve (
        string assetId, /* parameter needed for linking assets and transactions */
        string date, /* optional parameter */
        address employee)   /* optional parameter */
    public {}

    function time_card_submit_for_approval (
        string assetId, /* parameter needed for linking assets and transactions */
        string date, /* optional parameter */
        address employee)   /* optional parameter */
    public {}

    function employee_remove (
        string assetId, /* parameter needed for linking assets and transactions */
        address public_key)   /* optional parameter */
    public {}

    function employee_set_supervisor (
        string assetId, /* parameter needed for linking assets and transactions */
        address employee, /* optional parameter */
        address supervisor)   /* optional parameter */
    public {}

    function time_card_modify_time (
        string assetId, /* parameter needed for linking assets and transactions */
        string date, /* optional parameter */
        address employee, /* optional parameter */
        uint minutes_worked)   /* optional parameter */
    public {}

    function time_card_create (
        string assetId, /* parameter needed for linking assets and transactions */
        string date, /* optional parameter */
        address employee)   /* optional parameter */
    public {}

    function employee_create (
        string assetId, /* parameter needed for linking assets and transactions */
        string name, /* optional parameter */
        address public_key, /* optional parameter */
        address supervisor, /* optional parameter */
        uint dollars_per_hour)   /* optional parameter */
    public {}
}
