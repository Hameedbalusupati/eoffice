CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password TEXT,
  role VARCHAR(20)
);

CREATE TABLE faculty (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100),
  department VARCHAR(100),
  designation VARCHAR(100),
  salary NUMERIC
);

CREATE TABLE salary (
  id SERIAL PRIMARY KEY,
  faculty_id INT REFERENCES faculty(id),
  basic NUMERIC,
  hra NUMERIC,
  deductions NUMERIC,
  net_salary NUMERIC,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);