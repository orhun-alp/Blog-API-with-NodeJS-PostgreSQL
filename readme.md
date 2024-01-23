# NodeJs, Express, PostgreSQL Blog API

I developed a Blog API using ExpressJS and PostgreSQL. You can create users, add posts and comment on other users' posts. Then you can change your comments or delete your posts's comments

## Installation and Start

Use the package manager [npm](https://www.npmjs.com/) and add your .env file

```bash
npm install dependencies && npm run dev
```
## Some Endpoints
```
// Register
POST 0.0.0.0:3000/users/register 
// Login
POST 0.0.0.0:3000/users/login
// Update comment 
PUT 0.0.0.0:3000/posts/comments/:id
// Get posts by title
GET 0.0.0.0:3000/posts/:title
```

## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.


## License

[MIT](https://choosealicense.com/licenses/mit/)
