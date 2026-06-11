## Setup

---
For frontend 
move inside the frontend folder
npm i
npm run dev



For Backend 
move inside the Backend folder

create .env file 

PORT = 
DB_URI = 
JWT_SECRET = 

run npm i 
npm run dev


---

## API

### Auth
POST "/api/auth/register" - for everyone to register new user
POST "/api/auth/login" - for everyone to login 
 
### Teams

GET "/api/teams" - for everyone can see the team 
GET "/api/teams/my" - for everyone 
GET "/api/teams/:id"
POST "/api/teams" for manager only to ccreate new team 
PATCH "/api/teams" for manager and team_lead can update team_name and description only and manager can change the team_lead
DELETE "/api/teams/:id" for manager only to delete team

### Members

GET "/api/teams/:teamId/members"  for everyone to fetch all the team member
POST "/api/teams/:teamId/members" for manager/team_lead to add new members in the team 
DELETE "/api/teams/:teamId/members/:userId" for manager/team_lead to delete the member of the team


### Users (manager only)

GET "/api/users" to fetch all the employee 
GET "/api/users/:id"  to fetch particular employee
DELETE "/api/users/:id" to delete employee


## Assumptions 

-There will be two role Manager and employee. Manager has all the access like to create the team, delet the team etc.
-we have created the three model user(follows user related schema), team(follows team realted schema how the team creates and what are the information it will going to hold), member_join model depends on the user model and team model(which member will going to join at what possition like team_lead or member)
-Team lead have limited controle on the team like team lead not allow to delete the team 