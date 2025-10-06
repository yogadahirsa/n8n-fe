drop table if exists users;
create table users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(200) NOT NULL,
  role_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
insert into users (email,password,role_id) values ('admin@admin.com','$2b$10$W7l/SJS6oZfQ7XsAYbI4oeAA.R.cYXOuFwuEnfBOaJVlpvwZvEggC',1);
