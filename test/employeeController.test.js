const mongoose = require("mongoose");
const { connectDB } = require("../db");
const Employee = require("../models/employee");

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe("Employee Model Test", () => {
  it("create & save employee successfully", async () => {
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

    const validEmployee = new Employee(employeeData);
    const savedEmployee = await validEmployee.save();

    expect(savedEmployee._id).toBeDefined();
    expect(savedEmployee.EmployeeID).toBe(employeeData.EmployeeID);
    expect(savedEmployee.Name).toBe(employeeData.Name);
    expect(savedEmployee.Email).toBe(employeeData.Email);
    expect(savedEmployee.EquityOverview).toEqual(employeeData.EquityOverview);
    expect(savedEmployee.DocumentAccess.toObject()).toEqual(
      employeeData.DocumentAccess
    ); // Convert to plain array
    expect(savedEmployee.VestingSchedule).toEqual(employeeData.VestingSchedule);
    expect(savedEmployee.TaxCalculator).toEqual(employeeData.TaxCalculator);
  });
});
