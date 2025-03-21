To run this project, you have to complete the following steps:

- Create a development.env file with the database credentials, and the frontend url´s for CORS
- Create a test.env file with database credentials to use for the integrations tests
- Create a .env file on the frontend (mobile app and change password web app) with the API url and API version
- Create a init.sql with the following script:

```sql
DO
$do$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'user') THEN
      CREATE ROLE user WITH LOGIN PASSWORD 'password';
      ALTER ROLE user CREATEDB;
   END IF;
END
$do$;

CREATE DATABASE takeaticketdb OWNER user;
```

- Install Docker and run a terminal on the backend folder the following command: docker compose --env-file env/development.env up -d
- Install the postgres extension on VS Code
- Connect to the server where your database is
- On the backend file, run the following commands:
  - npm i
  - npm run knex:migrate:dev
  - npm run start:dev
  - If you want to run the tests, npm run test
- Open a terminal on the mobile app folder and run: npm i and npx expo start
- To run the change password web app, npm run dev

The application allows dark and light mode so that the user can use the application with the theme they like best.
With this steps, you can have the project on your computer without any problem. Have a great day 😄

Main Screen (Users):
![IndexUsers](https://github.com/user-attachments/assets/931773d6-0142-4eb3-89cd-c78312c992c7 | width=400)

Main Screen (Admins):
![IndexAdmins](https://github.com/user-attachments/assets/cae095de-ee4d-4b6e-af1e-1f2dcf41265b)

Ticket details (Users):
![TicketDetailsUsers](https://github.com/user-attachments/assets/2f090455-0f54-4d55-a925-681d9ac6a6f1)

Ticket details (admins):
![TicketDetails](https://github.com/user-attachments/assets/7eec03ab-71ae-4259-b359-33c47d274d04)

Edit ticket informations (Users):
![EditTicket](https://github.com/user-attachments/assets/7fd7d1b9-4642-45ab-84e7-07aec52d5ea1)

Create ticket (Users):
![CreateTicket](https://github.com/user-attachments/assets/2f6087ee-37d6-4f48-8c2a-fbd4f5585d62)

Profile:
![Profile](https://github.com/user-attachments/assets/4dbf153c-5076-4fd8-a0d6-906a3b3f043e)

Edit information profile:
![EditInforProfile](https://github.com/user-attachments/assets/45bdf2e1-cb05-480d-980b-532e1050c146)

Notifications:
![Notifications](https://github.com/user-attachments/assets/362d8beb-a4b1-4146-b182-90bd7b2d4703)

Sign up:
![Signup](https://github.com/user-attachments/assets/91aa3282-268a-4533-aac9-a8bb2614d5e1)

Sign in:
![Signin](https://github.com/user-attachments/assets/ec974fe8-aeed-4b5b-8a06-540e05555e71)

Recover Password/Send Email:
![RecoverPassword](https://github.com/user-attachments/assets/8593a909-95ca-47ff-91b3-1b732c1f59ff)

Recover Password/Change Password:
<img width="1704" alt="ChangePassword" src="https://github.com/user-attachments/assets/78687135-125d-42ab-aa1c-84a258bac111" />





