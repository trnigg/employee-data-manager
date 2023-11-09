/* Department Seed Data */
INSERT INTO departments (id, name)
VALUES (1, 'Human Resources'),
       (2, 'Sales'),
       (3, 'Finance'),
       (4, 'Legal'),
       (5, 'Engineering');

/* Role Seed Data */
INSERT INTO roles (id, title, salary, department_id)
VALUES (1, 'HR Manager', 75000, 1),
       (2, 'Sales Manager', 80000, 2),
       (3, 'Financial Analyst', 60000, 3),
       (4, 'Legal Counsel', 85000, 4),
       (5, 'Software Engineer', 100000, 5),
       (6, 'Sales Representative', 60000, 2),
       (7, 'Financial Manager', 90000, 3),
       (8, 'Legal Assistant', 55000, 4);

/* Employee Seed Data */
INSERT INTO employees (id, first_name, last_name, role_id, manager_id)
VALUES (1, 'Elena', 'Gomez', 1, NULL),
       (2, 'Hiroshi', 'Yamada', 2, 1),
       (3, 'Fatima', 'Abdullah', 3, 7),
       (4, 'Lucas', 'Silva', 4, NULL),
       (5, 'Mehmet', 'Kaya', 5, 1),
       (6, 'Yuan', 'Chen', 6, 2),
       (7, 'Maria', 'Santos', 7, 1),
       (8, 'Aisha', 'Khan', 8, 4);


