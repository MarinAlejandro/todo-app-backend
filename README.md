## Instructions
### Setup database
```
docker run --name my_postgres -e POSTGRES_USER=myuser -e POSTGRES_PASSWORD=mypassword -e POSTGRES_DB=mydb -p 5432:5432 -d postgres
docker exec -it my_postgres bash
psql -U myuser mydb
CREATE DATABASE todo_db;

CREATE TABLE duties (
id SERIAL PRIMARY KEY,
name VARCHAR(255) NOT NULL
);
```


### Start server
npm run start

