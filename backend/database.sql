CREATE DATABASE tutorsaurus;

-- USERS TABLE (shared by students, tutors, admins)
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  gender TEXT,
  year_of_study INTEGER,
  faculty TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'tutor', 'admin')),
  profile_pic TEXT
);

-- TUTORS TABLE (only for tutor-specific fields)
CREATE TABLE tutors (
  user_id INTEGER PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
  bio TEXT,
  availability TEXT
);

-- MODULES TABLE (list of module codes)
CREATE TABLE modules (
  module_id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL
);

-- TUTOR_MODULES TABLE (many-to-many tutor-module relationships with hourly rate)
CREATE TABLE tutor_modules (
  user_id INTEGER REFERENCES tutors(user_id) ON DELETE CASCADE,
  module_id INTEGER REFERENCES modules(module_id) ON DELETE CASCADE,
  hourly_rate NUMERIC(6,2) NOT NULL,
  PRIMARY KEY (user_id, module_id)
);

-- RATINGS TABLE
CREATE TABLE ratings (
  rating_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES tutors(user_id) ON DELETE CASCADE,
  rater_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  score INTEGER CHECK (score >= 1 AND score <= 5),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- REVIEWS TABLE
CREATE TABLE reviews (
  review_id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES tutors(user_id) ON DELETE CASCADE,
  reviewer_id INTEGER REFERENCES users(user_id) ON DELETE CASCADE,
  review TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);