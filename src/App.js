import './App.css';
import React, { useState } from 'react';

import extractTextFromPDF from "pdf-parser-client-side";

import { GpaScore } from './components/GpaScore';



function App() {
  const [averageGPA, setAverageGPA] = useState(null);
  const [allclasses, setallclasses] = useState([]);
  const [fileName, setFileName] = useState("")
  const [collegename, setCollegename] = useState("")
  const [cumulativetot, setCumlativetot] = useState("")

  // regEx pattern to match and push into array
  // [A-Z]+ -> 1 or more char from A-Z, 
  // \.? -> optional '.',
  // \s -> space
  // d+ -> 1 or more digit
  // 
  // \s+ -> 1 or more space
  // (\d+\.\d+) -> one or more digit + . + one or more digit
  // \s+
  // (\w+) -> one or more char(a-z, A-Z, 1-9, and _ )

  const classPattern = /\b([A-Z]+\.?\s\d+)\s+(.+?)\s+(\d+\.\d+)\s+(\w+\+?\-?)/g;
  const cumulativeTotalsPattern = /Cumulative Totals.*?Cum GPA:\s+(\d+\.\d+)\s+.*?Cum Total:\s+(\d+\.\d+)\s+(\d+\.\d+)/s;

  function extractClassesCreditsGrades(data) {
    // cut off everything before "Beginning of Undergraduate Record"
    const data2 = data.split("Beginning of Undergraduate Record")
    console.log(data.split("Beginning of Undergraduate Record")[0])
    console.log(data2)
    const classes = [];
    let match;
    const collegeMatch = /\b(Brooklyn|Medgar Evers) Student\b/g.exec(data2[0])
    console.log(collegeMatch) 
    setCollegename(collegeMatch[1])

    while ((match = classPattern.exec(data2[1])) !== null) {
      const [, classInfo, description, credits, grade] = match;
      classes.push({ class: classInfo, description, credits, grade });
    }

    // Match cumulative totals
    const cumulativeTotalsMatch = cumulativeTotalsPattern.exec(data);
    const [, cumGPA, cumTotal, transferTotal] = cumulativeTotalsMatch;
    console.log(cumGPA)
    setCumlativetot(cumGPA)

    return { classes, cumulativeTotals: { cumGPA, cumTotal, transferTotal } };
  }

  // Function to calculate GPA from letter grade
  function calculateGPA(letterGrade) {
    switch (letterGrade) {
      case 'A+':
        return 4.0;
      case 'A':
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
      case 'F':
        return 0.0;  
      default:
        return null; 
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
      if ((className.startsWith('CSC') || className.startsWith('CS') || className.startsWith('CISC')|| className.startsWith('MTH')|| className.startsWith('MAT')) 
          || className.startsWith('MATH')&& grade != "CR" )
        {
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

  return (
    <div className='App'>

      <h1 className="Title">CUNY CS Major GPA Calculator</h1>
      <h4 className="Note">Disclaimer: Only tested with the following CUNY's transcript</h4>
      <h4 className="Note">(Brooklyn College, John Jay College, and Medgar Evers college)</h4>
      
      <label htmlFor="file-selector" className="file-selector"> 
        <div className="boxUL bold">Upload Transcript File (.pdf)</div>
        <div>File Name : {fileName ? fileName : "N/A"}</div>
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
                setFileName(file.name)
                const result = extractClassesCreditsGrades(data);
                console.log(result);
                const avgGPA = calculateAverageGPA(result.classes);
                console.log('Average GPA for CSC, CS, CISC classes:', avgGPA);
                setAverageGPA(avgGPA);
                setallclasses(result.classes)
              
                
                
              });
            }
          }}
        />
      </label>
      {collegename + "College"}    
      {averageGPA && <GpaScore averageGPA={averageGPA} />}
      <div>Average GPA for CSC, CS, CISC, MTH, MATH, MAT classes: {averageGPA}</div>
      {cumulativetot}
      {allclasses.map(item => {
        if (item?.class.match("(CS|CISC|MTH|MAT|CSC).*"))
          return <div>{item?.class} {item?.description} {item?.credits} {item?.grade}</div>;
        })}
      
    </div>
  );
}

export default App;
