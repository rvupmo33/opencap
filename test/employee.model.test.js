const mongoose = require("mongoose");
const Employee = require("../models/employee");

describe("Employee Model", () => {
  beforeAll(async () => {
    mongoose.set("useCreateIndex", true);
    await mongoose.connect("mongodb://localhost/testDB", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to test database");

    // Clear the collection before each test
    await Employee.deleteMany({});
  });

  afterAll((done) => {
    mongoose.connection.close(done);
  });

  it("should create a new employee", (done) => {
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

    employee.save((err, savedEmployee) => {
      expect(err).toBeNull();
      expect(savedEmployee).toBeInstanceOf(Object);
      expect(savedEmployee.Name).toBe("John Doe");
      done();
    });
  }, 60000);
});
