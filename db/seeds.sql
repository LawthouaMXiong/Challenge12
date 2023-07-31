INSERT INTO department (name)
    VALUES  ("Kitchen"),
            ("Front-House"),
            ("Management"),
            ("Entertainment");

INSERT INTO role (title, salary, department_id)
    VALUES  ("Head Cook", 35000, 1),
            ("Cashier", 20000, 2),
            ("Greeter", 19000, 2),
            ("Front Manager", 40000, 3),
            ("Game Manager", 125000, 3),
            ("Clown", 23000, 4),
            ("Actor", 30000, 4);


INSERT INTO employee (first_name, last_name, role_id, manager_id) 
    VALUES ("Billy", "Brown", 1, 1),
            ("Johnny", "Johnson", 2, 1),
            ("Janie", "Bill", 2, 1),
            ("Autumn", "Stun", 3, 1),
            ("Kendra", "Youngs", 4, 2);