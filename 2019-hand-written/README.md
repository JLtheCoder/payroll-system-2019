# Software Development Challenge

The original instructions and sample csv file can be found under `instructions` folder.

Demo: https://payroll-system-node.herokuapp.com/

## Set up

This project has two parts.


The back end server is written in Node.js with Express server. The front end app is written in React. The front end build is bundled inside `server` folder.


To run this project on localhost, run the following commands under root folder.

```
1. npm install
2. npm run dev
```

You can now navigate to http://localhost:8081 to use the app in a browser.


## Architecture

The server is written in Express framework. It is a framework that has a lot of flexibility to structure your code base.

I have designed the server with layer structure. There are
 - **Routes**: Routing request to a set of controllers
 - **Controllers**: Formatting reques data, running validation on request data, and delegating service functions and return response data based on result of service functions
 - **Services**: Contains main business logic
 - **Data Access**: Provides data access to database

 I used sqlite and `sequelize` as ORM option for database. ~~Due to time constrain and complexity, sqlite is used as choice of database instead of Postgres.~~ Postgres is used in live demo site, and sqlite is used on local development. Sequelize provides abstraction, it would take almost no code change to switch from sqlite to Postgres.


## Database

I have designed 3 database table for this project. Database models can be found under `server/data/models` folder.

**report_upload**

This table contains report Id from csv file,it contains timestamps of when the report is uploaded. Report id is store under `csv_report_id`, it has unique constrain, so we can use it to detect duplicate report id.

**payroll_data**
This table contains all parsed data from csv report. It is a part of requirements for storing all raw data.

**report_data**
This table contains parse payroll report. It is used to retrieve payroll report without parsing through csv file again.


## Design choice
I have designed 3 endpoints for this project. Definitions can be found under `server/routers/api` folder.

```
POST /api/payroll/report
GET /api/reports
GET /api/report/:reportId
```

**POST /api/payroll/report**

This endpoint follows middleware structure in Express server.

The first middleware validates csv file and format csv file from bytes to string format. The main controller performs main operation of generating report.

This endpoint takes csv file as request, format into array of data and run through business logic to produce payroll report. All of payroll data and report data are stored in database.

**GET /api/reports**

This endpoint gives a list of existing payroll report in the system.

**GET /api/report/:reportId**

This endpoint can be used to retrieve a payroll report that has previously generated.

## Separation of concerns

I have used TDD approach to develop main business logic for generating payroll report. Due to time constrain, there is no other tests in both front end and back end.

There are some design choices I used to reduce the complexity of this project.

- Layered structure
- Pipeline architecture (POST /api/payroll/report)
- ORM

## Future improvements

 - More tests in both front end and back end
 - Replace sqlite with Postgres
 - More validation on csv file
 - More validation on front end

## Project Description

Imagine that we are prototyping
a new payroll system with an early partner. Our partner is going to use our web
app to determine how much each employee should be paid in each _pay period_, so
it is critical that we get our numbers right.

The partner in question only pays its employees by the hour (there are no
salaried employees.) Employees belong to one of two _job groups_ which
determine their wages; job group A is paid $20/hr, and job group B is paid
$30/hr. Each employee is identified by a string called an "employee id" that is
globally unique in their system.

Hours are tracked per employee, per day in comma-separated value files (CSV).
Each individual CSV file is known as a "time report", and will contain:

1. A header, denoting the columns in the sheet (`date`, `hours worked`,
   `employee id`, `job group`)
1. 0 or more data rows
1. A footer row where the first cell contains the string `report id`, and the
   second cell contains a unique identifier for this report.

Our partner has guaranteed that:

1. Columns will always be in that order.
1. There will always be data in each column.
1. There will always be a well-formed header line.
1. There will always be a well-formed footer line.

An example input file named `sample.csv` is included in this repo.

### What your web-based application must do:

We've agreed to build the following web-based prototype for our partner.

1. Your app must accept (via a form) a comma separated file with the schema
   described in the previous section.
1. Your app must parse the given file, and store the timekeeping information in
   a relational database for archival reasons.
1. After upload, your application should display a _payroll report_. This
   report should also be accessible to the user without them having to upload a
   file first.
1. If an attempt is made to upload two files with the same report id, the
   second upload should fail with an error message indicating that this is not
   allowed.

The payroll report should be structured as follows:

1. There should be 3 columns in the report: `Employee Id`, `Pay Period`,
   `Amount Paid`
1. A `Pay Period` is a date interval that is roughly biweekly. Each month has
   two pay periods; the _first half_ is from the 1st to the 15th inclusive, and
   the _second half_ is from the 16th to the end of the month, inclusive.
1. Each employee should have a single row in the report for each pay period
   that they have recorded hours worked. The `Amount Paid` should be reported
   as the sum of the hours worked in that pay period multiplied by the hourly
   rate for their job group.
1. If an employee was not paid in a specific pay period, there should not be a
   row for that employee + pay period combination in the report.
1. The report should be sorted in some sensical order (e.g. sorted by employee
   id and then pay period start.)
1. The report should be based on all _of the data_ across _all of the uploaded
   time reports_, for all time.

As an example, a sample file with the following data:

|date                   |hours worked|employee id|job group|
|-----------------------|------------|-----------|---------|
|4/11/2016              |10          |1          |A        |
|                       |            |           |         |
|14/11/2016             |5           |1          |A        |
|                       |            |           |         |
|20/11/2016             |3           |1          |B        |


should produce the following payroll report:

|Employee ID  |Pay Period              |Amount Paid |
|-------------|------------------------|------------|
|1            |1/11/2016 - 15/11/2016  | $300.00    |
|             |                        |            |
|2            |16/11/2016 - 30/11/2016 | $90.00    |
|             |                        |            |

Your application should be easy to set up, and should run on either Linux or
Mac OS X. It should not require any non open-source software.

There are many ways that this application could be built; we ask that you build
it in a way that showcases one of your strengths. If you enjoy front-end
development, do something interesting with the interface. If you like
object-oriented design, feel free to dive deeper into the domain model of this
problem. We're happy to tweak the requirements slightly if it helps you show
off one of your strengths.

### Documentation:

Please modify `README.md` to add:

1. Instructions on how to build/run your application
1. A paragraph or two about what you are particularly proud of in your
   implementation, and why.

## Evaluation

Evaluation of your submission will be based on the following criteria.

1. Did you follow the instructions for submission?
1. Did you document your build/deploy instructions and your explanation of what
   you did well?
1. Were models/entities and other components easily identifiable to the
   reviewer?
1. What design decisions did you make when designing your models/entities? Are
   they explained?
1. Did you separate any concerns in your application? Why or why not?
1. Does your solution use appropriate data types for the problem as described?
