```bash
# install all dependencies
npm install
```

```bash
# run app in dev mode
npm run start:dev
```

```bash
# build and run single .js file
npm run start:prod
```

```bash
# run app in prod mode (build and run single .js file)
npm run start:prod
```

```bash
# run app in cluster mode using Round-robin algorithm
npm run start:multi
```

- Endpoints
  - **GET** `api/users` is used to get all persons
    - Server server will responde with `status code` **200** and all users records
  - **GET** `api/users/{userId}`
    - Server server will responde with `status code` **200** and record with `id === userId` if it exists
    - Server server will responde with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server server will responde with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
  - **POST** `api/users` is used to create record about new user and store it in database
    - Server server will responde with `status code` **201** and newly created record
    - Server server will responde with `status code` **400** and corresponding message if request `body` does not contain **required** fields
  - **PUT** `api/users/{userId}` is used to update existing user
    - Since there are no clear requirements for this method in the assignment, I made the fields in the body required: `{ username, age, hobbies }`.
    - Server server will responde with` status code` **200** and updated record
    - Server server will responde with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server server will responde with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
  - **DELETE** `api/users/{userId}` is used to delete existing user from database
    - Server server will responde with `status code` **204** if the record is found and deleted
    - Server server will responde with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
    - Server server will responde with `status code` **404** and corresponding message if record with `id === userId` doesn't exist

## 500 Internal Server Error

- Since the 500th error is difficult to reproduce, I suggest adding a comment `// @ts-ignore-next-line` before `line 74` in the `UserService.deleteUser` method and replacing the line `this._users = this._users.filter((user) => user.id !== id);` with `this._users = null`, then use the `UserService.createUser` method, then the 500th error will occur.
