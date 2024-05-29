const colors = require("colors/safe");

const displayFailingTests = (failingTestResults, passingTestCount) => {
  failingTestResults.forEach((testResult, index) => {
    console.log(`  ${passingTestCount + index + 1})`, colors.red(testResult.testName));
    testResult.assertionFailures.forEach((failure, index) => {
      console.log(`     ${index + 1})`, colors.red(`Cell ${failure.cellId} expected ${failure.expectedValue} but got ${failure.actualValue}`));
    });
  });
};

const displayPassingTests = (passingTestResults) => {
  passingTestResults.forEach((testResult, index) => {
    console.log(`  ${index + 1})`, colors.green(testResult.testName));
  });
};

const displayInternName = (internName) => {
  console.log(colors.underline(colors.bold(internName)));
  console.log();
};

const displaySummary = (passingTestCount, failingTestCount) => {
  console.log();
  console.log("   ", colors.bold("Summary:"), `${colors.green(passingTestCount)} passing, ${colors.red(failingTestCount)} failing`);
  console.log();
};

const consoleReporter = (fileName, testResults) => {
  const [passingTests, failingTests] = partitionBy(testResults, testResult => testResult.isPassing);

  displayInternName(fileName);
  displayPassingTests(passingTests);
  displayFailingTests(failingTests, passingTests.length);
  displaySummary(passingTests.length, failingTests.length);
};


const partitionBy = (elements, predicate) => {
  const partitions = [[], []];

  for (const element of elements) {
    const partitionIndex = predicate(element) ? 0 : 1;
    partitions[partitionIndex].push(element);
  };

  return partitions;
};

class ConsoleReporter {
  #testReports;
  constructor() {
    this.#testReports = [];
  }

  report(internName, testResults) {
    this.#testReports.push(testResults);
    const [passingTests, failingTests] = partitionBy(testResults, testResult => testResult.isPassing);

    displayInternName(internName);
    displayPassingTests(passingTests);
    displayFailingTests(failingTests, passingTests.length);
    displaySummary(passingTests.length, failingTests.length);
  }

  finalise() {
    // display overall summary in tabular format.
  }
}

module.exports = {
  ConsoleReporter,
};