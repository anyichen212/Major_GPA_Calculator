import logo from './logo.svg';
import './App.css';
import React from "react";
import extractTextFromPDF from "pdf-parser-client-side";

function App() {
  return (
    <div>
      <input
        type="file"
        name=""
        id="file-selector"
        accept=".pdf"
        onChange={(e) => {
          // Selecting the first file
          const file = e.target.files[0];
          //   If file exists then we will call our function
          if (file) {
            extractTextFromPDF(file).then((data) => {
              const result = extractClassesCreditsGrades(data);
              console.log(result);
            });
          }
        }}
      />
    </div>
  );
}
const classPattern = /\b([A-Z]+\s\d+)\s+(.+?)\s+(\d+\.\d+)\s+(\w+)\b/g;
const cumulativeTotalsPattern = /Cumulative Totals.*?Cum GPA:\s+(\d+\.\d+)\s+.*?Cum Total:\s+(\d+\.\d+)\s+(\d+\.\d+)/s;

function extractClassesCreditsGrades(data) {
  const classes = [];
  let match;

  
  while ((match = classPattern.exec(data)) !== null) {
    const [, classInfo, description, credits, grade] = match;
    classes.push({ class: classInfo, description, credits, grade });
  }

  // Match cumulative totals
  const cumulativeTotalsMatch = cumulativeTotalsPattern.exec(data);
  const [, cumGPA, cumTotal, transferTotal] = cumulativeTotalsMatch;

  return { classes, cumulativeTotals: { cumGPA, cumTotal, transferTotal } };
}



export default App;
