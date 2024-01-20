import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';

import extractTextFromPDF from "pdf-parser-client-side";

function App() {
  const [averageGPA, setAverageGPA] = useState(null);
  const [classesss,setClasses]=useState([]);
  
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
              console.log("result",result);
              const avgGPA = calculateAverageGPA(result.classes);
              console.log('Average GPA for CSC, CS, CISC classes:', avgGPA);
              setAverageGPA(avgGPA);
              setClasses(result.classes);
              
            });
          }
        }}
      />
      <div>Average GPA for CSC, CS, CISC classes: {averageGPA}</div>
      <div>{classesss[0]?.class}</div>
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

// Function to calculate GPA from letter grade
function calculateGPA(letterGrade) {
  switch (letterGrade) {
    case 'A' || 'A+':
      return 4.0;
    case 'A-':
      return 3.7;
    case 'B+':
      return 3.3;
    case 'B':
      return 3.0;
    case 'B-':
      return 2.7;
    case 'C+':
      return 2.3;
    case 'C':
      return 2.0;
    case 'C-':
      return 1.7;
    case 'D+':
      return 1.3;
    case 'D':
      return 1.0;
    default:
      return 0.0; // E&F or other grades
  }
}

// Function to filter and calculate average GPA for specific prefixes
function calculateAverageGPA(classes) {
  let totalGPA = 0;
  let totalCredits = 0;

  // Filter and calculate GPA for specific prefixes
  classes.forEach((classInfo) => {
    const { class: className, credits, grade } = classInfo;

    // Check if the class has a specific prefix
    if (className.startsWith('CSC') || className.startsWith('CS') || className.startsWith('CISC')) {
      const classGPA = calculateGPA(grade);
      const classCredits = parseFloat(credits);
      console.log(className,classGPA,classCredits);
      totalGPA += classGPA * classCredits;
      totalCredits += classCredits;
    }
  });

  // Calculate average GPA
  const averageGPA = totalCredits > 0 ? totalGPA / totalCredits : 0.0;

  return averageGPA.toFixed(2); // Return average GPA rounded to 2 decimal places
}




export default App;
