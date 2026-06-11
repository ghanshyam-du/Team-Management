# Team Management Service

## Setup

---

### Frontend

1. Move inside the frontend folder:

```bash
cd frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

---

### Backend

1. Move inside the backend folder:

```bash
cd backend
```

2. Create a `.env` file and add the following variables:

```env
PORT=
DB_URI=
JWT_SECRET=
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

---

## API Documentation

### Authentication

| Method | Endpoint | Description |
|----------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login user |

---

### Teams

| Method | Endpoint | Access | Description |
|----------|----------|----------|-------------|
| GET | `/api/teams` | All Users | Fetch all teams |
| GET | `/api/teams/my` | All Users | Fetch teams associated with the logged-in user |
| GET | `/api/teams/:id` | All Users | Fetch a specific team |
| POST | `/api/teams` | Manager Only | Create a new team |
| PATCH | `/api/teams/:id` | Manager / Team Lead | Update team details. Team Lead can update only `teamName` and `description`, while Manager can also change the Team Lead |
| DELETE | `/api/teams/:id` | Manager Only | Delete a team |

---

### Members

| Method | Endpoint | Access | Description |
|----------|----------|----------|-------------|
| GET | `/api/teams/:teamId/members` | All Users | Fetch all members of a team |
| POST | `/api/teams/:teamId/members` | Manager / Team Lead | Add a member to a team |
| DELETE | `/api/teams/:teamId/members/:userId` | Manager / Team Lead | Remove a member from a team |

---

### Users

> **Manager Only**

| Method | Endpoint | Description |
|----------|----------|-------------|
| GET | `/api/users` | Fetch all employees |
| GET | `/api/users/:id` | Fetch a specific employee |
| DELETE | `/api/users/:id` | Delete an employee |

---

## Assumptions

- The system supports two roles:
  - **Manager**
  - **Employee**

- Managers have full access to the system, including:
  - Creating teams
  - Updating teams
  - Deleting teams
  - Managing employees

- The application consists of the following models:

  ### User Model
  Stores user-related information such as:
  - Name
  - Email
  - Password
  - Role

  ### Team Model
  Stores team-related information such as:
  - Team Name
  - Description
  - Team Lead

  ### Member Join Model
  Acts as a bridge between the **User** and **Team** models and stores:
  - User ID
  - Team ID
  - Position in the team (`team_lead` or `member`)

- Team Leads have limited control over teams:
  - Can update team name and description
  - Can manage team members
  - Cannot delete teams
  - Cannot assign another Team Lead

---