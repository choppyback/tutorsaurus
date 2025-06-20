CREATE DATABASE tutorsaurus;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('student', 'tutor', 'admin')),
    faculty TEXT,
    gender TEXT,
    year_of_study INTEGER,
    profile_pic TEXT,
    modules_taught TEXT[],
    hourly_rate NUMERIC(6,2)
);
