const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

const runCobolProgram = (inputContent) => {
  return new Promise((resolve, reject) => {
    const inputPath = path.join(process.cwd(), "src/cobol/input.txt");
    const outputPath = path.join(process.cwd(), "src/cobol/output.txt");

    fs.writeFileSync(inputPath, inputContent);

    exec(
      "cobc -x -o src/cobol/process_transactions src/cobol/process_transactions.cbl && ./src/cobol/process_transactions",
      (err) => {
        if (err) return reject(err);
        const outputContent = fs.readFileSync(outputPath, "utf-8");
        resolve(outputContent);
      }
    );
  });
};

module.exports = { runCobolProgram };
