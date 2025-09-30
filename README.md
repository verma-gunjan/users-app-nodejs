# Users API (Node.js + Express)

This is a Node.js Express application implementing a **Users module** with CRUD operations and **permission-based access control**. Users can belong to groups and have roles that determine what actions they can perform.

## Table of Contents

* [Predefined Data](#predefined-data)
* [Installation](#installation)
* [Running the Application](#running-the-application)
* [Endpoints](#endpoints)
* [Permission Middleware](#permission-middleware)
* [Example Requests](#example-requests)

## Predefined Data

### Users

```js
[
  { id: 1, name: "John Doe", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 2, name: "Grabriel Monroe", roles: ["PERSONAL"], groups: ["GROUP_1", "GROUP_2"] },
  { id: 3, name: "Alex Xavier", roles: ["PERSONAL"], groups: ["GROUP_2"] },
  { id: 4, name: "Jarvis Khan", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_2"] },
  { id: 5, name: "Martines Polok", roles: ["ADMIN", "PERSONAL"], groups: ["GROUP_1"] },
  { id: 6, name: "Gabriela Wozniak", roles: ["VIEWER", "PERSONAL"], groups: ["GROUP_1"] }
]

### Groups

```js
["GROUP_1", "GROUP_2"]
```

### Roles

```js
["ADMIN", "PERSONAL", "VIEWER"]
```

## Installation

1. Clone the repository:

```bash
git clone https://github.com/verma-gunjan/users-app-nodejs
```

2. Install dependencies:

```bash
npm install express nodemon
```

3. Run the application:

```bash
npm start
```

The server runs on `http://localhost:3000`.

---

## Endpoints

### GET `/users`

Retrieve all users.

### GET `/users/managed/:id`

Retrieve users managed by the given user ID. Only users with `ADMIN` role can manage others in their groups.

### POST `/users`

Create a new user.

**DTO Validation:**

* `name`: string, required, max 100 characters
* `roles`: array, required, at least one role from predefined roles
* `groups`: array, required, at least one group from predefined groups

### PATCH `/users/:id`

Partially update a user.

### DELETE `/users/:id`

Delete a user.

---

## Permission Guard

The application includes a **Permission Guard** that restricts endpoints based on user roles.

| Permission | Endpoint                                |
| ---------- | --------------------------------------- |
| CREATE     | POST `/users`                           |
| VIEW       | GET `/users` & GET `/users/managed/:id` |
| EDIT       | PATCH `/users/:id`                      |
| DELETE     | DELETE `/users/:id`                     |

**User ID** is provided via the `Authorization` header.

**Roles and Permissions:**

```js
[
  { name: "Admin", code: "ADMIN", permissions: ["CREATE", "VIEW", "EDIT", "DELETE"] },
  { name: "Personal", code: "PERSONAL", permissions: [] },
  { name: "Viewer", code: "VIEWER", permissions: ["VIEW"] }
]
```
## Example Requests

#  POST 'http://localhost:3000/users'
{
  "name": "Jane Doe",
  "roles": ["ADMIN", "PERSONAL"],
  "groups": ["GROUP_1"]
}


### Not Allowed Request (VIEWER trying to create a user)

```bash
POST 'http://localhost:3000/users' \
--header 'Authorization: 6' \
--header 'Content-Type: application/json' \
--data '{
  "name": "Test User",
  "roles": ["PERSONAL"],
  "groups": ["GROUP_1"]
}'
```

**Response:**

```
ERROR: Not allowed to perform action due to insufficient permissions.
```

---

## Notes
* User IDs are auto-incremented.
* Only users with `ADMIN` role can manage other users within their groups.