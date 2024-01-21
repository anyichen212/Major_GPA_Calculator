import './App.css';
import React, { useState, PureComponent, Fragment } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

import extractTextFromPDF from "pdf-parser-client-side";

import { GpaScore } from './components/GpaScore';
import AllClassContainer from './components/AllClassContainer';



function App() {
  const [averageGPA, setAverageGPA] = useState(0);
  const [allclasses, setallclasses] = useState([]);
  const [fileName, setFileName] = useState("")
  const [collegename, setCollegename] = useState("")
  const [cumulativetot, setCumlativetot] = useState("")
  const [studentName,setStudentName]=useState("None");
  const [chart,setChart]=useState([])
  const ChartClasses=[];

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
    const nameRegex = /Name:\s+(.*)\s+Student ID:/;
    const matchName = data2[0].match(nameRegex);
    const studentName = matchName && matchName[1];
    setStudentName(studentName);

    const classes = [];
    let match;
    const collegeMatch = /\b(Brooklyn|Medgar Evers|COSI) Student\b/g.exec(data2[0])
    console.log(collegeMatch) 

    //if no match exit and stop running
    if(collegeMatch){
      switch(collegeMatch[1]){
        case 'COSI':
          setCollegename("College Of Staten Island")
          break;

        default:
          setCollegename(collegeMatch[1]+" College")
      }
    } else {
      return
    }
      

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

  function arrayADD( Cname, Cgpa , Cgpa2 ){
    const obj={name:Cname,avg:Cgpa,score:Cgpa2}
    ChartClasses.push(obj);
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
        return 0.0; 
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
      if ((className.startsWith('CSC') || className.startsWith('CS') || className.startsWith('CISC')|| className.startsWith('MTH')|| className.startsWith('MAT') || className.startsWith('MATH')) 
      && grade != "CR" &&  grade != "Contact")
        {
        const classGPA = calculateGPA(grade);
        const classCredits = parseFloat(credits);
        //console.log(className,classGPA,classCredits);

        totalGPA += classGPA * classCredits;
        totalCredits += classCredits;
        arrayADD(className,parseFloat((totalGPA / totalCredits).toFixed(2)), parseFloat(classGPA.toFixed(2)))
      }
    });

    //console.log("credit", totalCredits)
    //console.log("credit", totalGPA)

    // Calculate average GPA
    const averageGPA = totalCredits > 0 ? totalGPA / totalCredits : 0.0;
    console.log(ChartClasses)
    setChart(ChartClasses);
    return averageGPA.toFixed(2); // Return average GPA rounded to 2 decimal places
  }

  return (
    <div className='App'>

      <h1 className="Title">CUNY CS Major GPA Calculator</h1>
      
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
                const result = extractClassesCreditsGrades(data);
                if(!result || !file.type.endsWith('pdf')){
                  alert("Invalid File.\nPlease make sure the file you attempt to upload is a PDF file and a CUNY unofficial transcript.")
                  return
                }
                  

                setFileName(file.name)
                const avgGPA = calculateAverageGPA(result.classes);
                setAverageGPA(avgGPA);
                setallclasses(result.classes)
              
                
                
              });
            }
          }}
        />
      </label> 

      <h4 className="Note">Disclaimer: Only tested with the following CUNY transcript</h4>
      <h4 className="Note">(Brooklyn College, College of Staten Island, and Medgar Evers college)</h4>
      

      {averageGPA !== 0 && <GpaScore 
        averageGPA={averageGPA} 
        college={collegename} 
        cumGPA={cumulativetot} 
        studentName={studentName}
          
        />}

      { allclasses.length > 0 && 
        <Fragment>
          <h3 style={{marginTop:"50px", marginBottom:"0"}}>Major Class Progression</h3>
          <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:"2vh", padding:"10px 0 30px 0" }}>
            <ResponsiveContainer width="95%" height={300}>
              <LineChart
                data={chart}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                style={{maxWidth:"90vw"}}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="avg" name='Average Grade' stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="score" name='Class Grade' stroke="#028282" activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Fragment>
      }
        

      {allclasses.length > 0 && <AllClassContainer allClasses={allclasses} />}

    </div>
  );
}

export default App;
