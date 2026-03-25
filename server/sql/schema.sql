-- Users (synced with Firebase UID)
CREATE TABLE users (
  id UUID PRIMARY KEY,               -- Firebase UID
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  role VARCHAR(20) DEFAULT 'staff',  -- admin | staff
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projects
CREATE TABLE projects (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  location VARCHAR(200),
  start_date DATE,
  end_date DATE,
  status VARCHAR(30) DEFAULT 'ongoing', -- ongoing | completed | paused
  budget NUMERIC(15,2),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workers per Project
CREATE TABLE workers (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  name VARCHAR(100),
  role VARCHAR(100),        -- mason, electrician, supervisor, etc.
  daily_wage NUMERIC(10,2),
  joined_date DATE,
  contact VARCHAR(15)
);

-- Daily Expenses per Project
CREATE TABLE daily_expenses (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  category VARCHAR(100),   -- labour, material, equipment, misc
  description TEXT,
  amount NUMERIC(12,2),
  added_by UUID REFERENCES users(id)
);

-- Tenders
CREATE TABLE tenders (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id),
  tender_number VARCHAR(100),
  title VARCHAR(200),
  issued_by VARCHAR(150),
  submission_date DATE,
  status VARCHAR(30) DEFAULT 'pending', -- pending | submitted | won | lost
  amount NUMERIC(15,2),
  notes TEXT
);

-- Accounts / Transactions
CREATE TABLE accounts (
  id SERIAL PRIMARY KEY,
  project_id INT REFERENCES projects(id),
  type VARCHAR(10),          -- credit | debit
  category VARCHAR(100),
  amount NUMERIC(15,2),
  date DATE,
  description TEXT,
  added_by UUID REFERENCES users(id)
);

-- Salary Records
CREATE TABLE salary (
  id SERIAL PRIMARY KEY,
  worker_id INT REFERENCES workers(id),
  project_id INT REFERENCES projects(id),
  month INT,
  year INT,
  days_worked INT,
  total_amount NUMERIC(12,2),
  paid BOOLEAN DEFAULT FALSE,
  paid_on DATE
);

-- Contractors
CREATE TABLE contractors (
  id SERIAL PRIMARY KEY,
  name VARCHAR(150),
  specialization VARCHAR(150),   -- civil, electrical, plumbing, etc.
  contact VARCHAR(15),
  location VARCHAR(200),
  rating NUMERIC(2,1),
  past_projects INT DEFAULT 0,
  available BOOLEAN DEFAULT TRUE
);
