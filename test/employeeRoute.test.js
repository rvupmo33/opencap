const request = require("supertest");
const mongoose = require("mongoose");
const app = require("../app"); // Ensure this imports your Express app correctly
const Employee = require("../models/employee");
const { connectDB, disconnectDB } = require("../db");

beforeAll(async () => {
  await connectDB(); // Connect to the database
});

afterAll(async () => {
  await mongoose.connection.dropDatabase(); // Clean up database
  await mongoose.connection.close(); // Close connection
});

describe("Employee Routes", () => {
  beforeEach(async () => {
    await Employee.deleteMany({}); // Clear the Employee collection before each test
  });

  describe("GET /employees", () => {
    it("should GET all the employees", async () => {
      const employee = new Employee({
        EmployeeID: "E12345",
        Name: "John Doe",
        Email: "john.doe@example.com",
        EquityOverview: {
          TotalEquity: 1000,
          VestedEquity: 500,
          UnvestedEquity: 500,
        },
        DocumentAccess: [],
        VestingSchedule: {
          StartDate: new Date(),
          CliffDate: new Date(),
          VestingPeriod: 12,
          TotalEquity: 1000,
        },
        TaxCalculator: {
          TaxBracket: 30,
          TaxLiability: 300,
        },
      });
      await employee.save();

      const response = await request(app).get("/employees");
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBe(1);
      expect(response.body[0].Name).toBe("John Doe");
    });
  });

  describe("POST /employees", () => {
    it("should POST a new employee", async () => {
      const employeeData = {
        EmployeeID: "E12345",
        Name: "John Doe",
        Email: "john.doe@example.com",
        EquityOverview: {
          TotalEquity: 1000,
          VestedEquity: 500,
          UnvestedEquity: 500,
        },
        DocumentAccess: [],
        VestingSchedule: {
          StartDate: new Date(),
          CliffDate: new Date(),
          VestingPeriod: 12,
          TotalEquity: 1000,
        },
        TaxCalculator: {
          TaxBracket: 30,
          TaxLiability: 300,
        },
      };

      const response = await request(app)
        .post("/employees")
        .send(employeeData)
        .expect(201);

      expect(response.body).toMatchObject({
        EmployeeID: employeeData.EmployeeID,
        Name: employeeData.Name,
        Email: employeeData.Email,
        EquityOverview: employeeData.EquityOverview,
        DocumentAccess: employeeData.DocumentAccess,
        VestingSchedule: employeeData.VestingSchedule,
        TaxCalculator: employeeData.TaxCalculator,
      });
    });
  });
});
