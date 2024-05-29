const Sprint = require("@ashishkuoy/sprint");
const fs = require("node:fs/promises");


const runTest = (code, expectedCellIdToValues) => {
  const sprint = Sprint.getInstance(1000, 300, code, () => 0);
  sprint.execute();
  const { cells } = sprint.cells;

  return Object.entries(expectedCellIdToValues)
    .filter(([cellId, expectedValue]) => cells[+cellId - 1].value !== expectedValue)
    .map(([cellId, expectedValue]) => ({
      cellId: +cellId,
      expectedValue,
      actualValue: cells[+cellId - 1].value
    }));
};

const runTests = async (filePath, tests) => {
  const code = await fs.readFile(filePath, "utf-8");

  return tests
    .map(({ name, expectedCellIdToValues, codeMapper }) => {
      const assertionFailures = runTest(codeMapper(code), expectedCellIdToValues)
      return {
        testName: name,
        assertionFailures,
        isPassing: assertionFailures.length === 0,
      }
    });
};

/***
 * @param {string} testDir, the directory containing the programs submitted by interns
 * @param {Array} tests, each element contain testName, codeMapper, expectedCellIdToValues
 * @param {Object} reporter, an reporter to generate the report of the test results
 */
const runTestForAllInterns = async (testDir, tests, reporter) => {
  const filePaths = await fs.readdir(testDir);

  Promise.all(
    filePaths.map(fileName => {
      runTests(`${testDir}/${fileName}`, tests)
        .then(testResults => reporter.report(fileName, testResults));
    })
  ).then(() => reporter.finalise());
};

module.exports = {
  runTestForAllInterns,
};

