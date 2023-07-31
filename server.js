require("dotenv").config();
const mysql = require("mysql2");
const inquirer = require("inquirer");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "business_db",
  },
  console.log(`Connected to the business_db database.`)
);

const options = [
  {
    type: "list",
    name: "options",
    message: "Please select an option:",
    choices: [
      "View All Departments",
      "View All Roles",
      "View All Employees",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Update Employee Role",
      "Quit",
    ],
  },
];

const goQuery = (query, values) => {
  return new Promise((resolve, reject) => {
    db.query(query, values, (err, results) => {
      if (err) throw err;
      resolve(results);
    });
  });
};

const viewDepart = async () => {
  const allDepartments = await goQuery("SELECT * FROM department");
  console.table(allDepartments);
  select();
};

const viewRole = async () => {
  const allRoles = await goQuery(`
  SELECT 
      role.id,role.title,role.salary,department.name AS department
  FROM role
  INNER JOIN department on role.department_id = department.id;`);
  console.table(allRoles);
  select();
};

const viewEmp = async () => {
  const allEmployees = await goQuery(`
  SELECT 
      employee.id,
      employee.first_name,
      employee.last_name,
      role.title AS title,
      department.name AS department,
      role.salary,  
      CONCAT(manager.first_name, ' ', manager.last_name) AS \`manager\` 
  FROM employee 
  LEFT JOIN role on employee.role_id = role.id 
  LEFT JOIN department ON role.department_id = department.id 
  LEFT JOIN employee manager on employee.manager_id= manager.id;`);
  console.table(allEmployees);
  select();
};

const addDepart = async () => {
  const newDepart = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "Enter Department Name: ",
    },
  ]);

  await goQuery("INSERT INTO department (name) VALUES (?)", [newDepart.name]);
  console.log(`Successfully added ${newDepart.name} as a department!`);
  select();
};

const addRole = async () => {
  const newRole = await inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "Enter Role Title: ",
    },
    {
      type: "input",
      name: "salary",
      message: "Enter Role Salary: ",
    },
    {
      type: "input",
      name: "department_id",
      message: "Enter Corresponding Department ID: ",
    },
  ]);
  await goQuery(
    "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
    [newRole.title, newRole.salary, newRole.department_id]
  );
  console.log(`Successfully added ${newRole.title} as a Role!`);
  select();
};

const addEmp = async () => {
  const newEmp = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the employee first name: ",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the employee last name: ",
    },
    {
      type: "number",
      name: "role_id",
      message: "Enter the role ID: ",
    },
    {
      type: "input",
      name: "department_id",
      message: "Enter the department name ID: ",
    },
  ]);
  await goQuery(
    "INSERT INTO employee (first_name, last_name, role_id, department_id) VALUES (?, ?, ?, ?)",
    [newEmp.first_name, newEmp.last_name, newEmp.role_id, newEmp.department_id]
  );
  console.log(
    `Successfully added ${newEmp.first_name} ${newEmp.last_name} as a Employee!`
  );
  select();
};

const updateEmp = async () => {
  const update = await inquirer.prompt([
    {
      type: "input",
      name: "first_name",
      message: "Enter the employee first name: ",
    },
    {
      type: "input",
      name: "last_name",
      message: "Enter the employee last name: ",
    },
    {
      type: "input",
      name: "old_role_id",
      message: "Enter old role ID for employee: ",
    },
    {
      type: "input",
      name: "new_role_id",
      message: "Enter new role ID for employee: ",
    },
  ]);
  await goQuery("UPDATE employee SET role_id = ? WHERE id = ?", [
    update.old_role_id,
    update.new_role_id,
  ]);
  console.log(
    `${update.first_name} ${update.last_name} has been updated to the new role id of ${update.new_role_id}`
  );
  select();
};

const quit = () => {
  console.log("Exiting application!");
  process.exit();
};

const select = () => {
  inquirer.prompt(options).then((selected) => {
    switch (selected.options) {
      case "View All Departments":
        return viewDepart();
      case "View All Roles":
        return viewRole();
      case "View All Employees":
        return viewEmp();
      case "Add Department":
        return addDepart();
      case "Add Role":
        return addRole();
      case "Add Employee":
        return addEmp();
      case "Update Employee Role":
        return updateEmp();
      case "Quit":
        return quit();
    }
  });
};

select();