# Bunnch

next generation social media application.

# Stack

- [typescript](https://www.typescriptlang.org/)
- [typeorm](https://typeorm.io/)
- [redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Firebase Authentication](https://firebase.google.com/docs/auth)

# Requirements

- [NodeJs (v8 and above)](https://nodejs.org/en/)
- [Yarn](https://yarnpkg.com/)

# Getting started

- Create the `.env` file by copying the content of `.env.sample`.
- Run `yarn install` to install packages and dependencies locally.
- [Create a PostgreSQl database](https://www.postgresql.org/docs/9.0/sql-createdatabase.html) and insert url in .env file.
- Start a redis server and insert url in .env file
- Read [here](https://enappd.com/blog/google-login-in-react-native-android-apps-with-firebase/90/) and follow the steps. 
- Copy `client id` and `secret key` and paste them into the .env file

## Starting Api

```
yarn start
```

Then open browser and go to [http://localhost:9000/health](http://localhost:9000/health).
