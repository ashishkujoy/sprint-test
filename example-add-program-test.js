const { ConsoleReporter } = require("./src/console-reporter");
const { runTestForAllInterns } = require("./src/sprint-test");

const codeMapper = code => {
  // replacing placeholder a and b, this is just an example.
  return code.replace(/a/g, "100").replace(/b/g, "200");
}

runTestForAllInterns(
  process.argv[2],
  [
    {
      name: "sum should be at cell 15",
      codeMapper,
      expectedCellIdToValues: {
        15: 300
      }
    },
    {
      name: "sum of negative values",
      codeMapper: (code) => {
        // does not make much sense here, at time you want to run test against different set of inputs
        return code.replace(/a/g, "-100").replace(/b/g, "-200");
      },
      expectedCellIdToValues: {
        15: -300
      }
    },
    {
      name: "Input a should not be clobbered",
      codeMapper,
      expectedCellIdToValues: {
        2: 100
      },
    },
  ],
  new ConsoleReporter(),
);