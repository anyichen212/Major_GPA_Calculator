import './App.css';
import React, { useState, PureComponent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import extractTextFromPDF from "pdf-parser-client-side";
import { GpaScore } from './components/GpaScore';



function App() {
  const [averageGPA, setAverageGPA] = useState(null);
  const [allclasses, setallclasses] = useState([]);
  // const [chartclasses, setChartclasses] = useState([]);
  const [fileName, setFileName] = useState("")
  const [collegename, setCollegename] = useState("None")
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
    const beggining=data.split("Beginning of Undergraduate Record")[0];
    const nameRegex = /Name:\s+(.*)\s+Student ID:/;
    const matchName = beggining.match(nameRegex);
    const studentName = matchName && matchName[1];
    setStudentName(studentName);
    const classes = [];
    let match;
    const collegeMatch = /\b(Brooklyn|Medgar Evers|COSI) Student\b/g.exec(data2[0])
    
    console.log(collegeMatch) 
    if(collegeMatch[1]=="COSI"){
      setCollegename("College of Staten Island");
    }
    else{
    setCollegename(collegeMatch[1])
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
  function arrayADD( Cname, Cgpa ){
    const obj={name:Cname,avg:Cgpa}
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
        arrayADD(className,parseFloat((totalGPA / totalCredits).toFixed(2)))
      }
    });

    // Calculate average GPA
    const averageGPA = totalCredits > 0 ? totalGPA / totalCredits : 0.0;
    console.log(ChartClasses)
    setChart(ChartClasses);
    return averageGPA.toFixed(2); // Return average GPA rounded to 2 decimal places
  }

  return (
    <div className='App'>

      <h1 className="Title">CUNY CS Major GPA Calculator</h1>
      <h4 className="Note">Disclaimer: Only tested with the following CUNY's transcript</h4>
      <h4 className="Note">(Brooklyn College, College of Staten Island, John Jay College, and Medgar Evers college)</h4>
      
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
                setallclasses(result.classes);
              });
            }
          }}
        />
      </label>
       <div>College: {collegename}  </div>
       <div>Student Name: {studentName}</div>
      {averageGPA && <GpaScore averageGPA={averageGPA} />}
      
      
      <div className="MajorGPAScore">Your Overall GPA is: {cumulativetot}</div>

      {allclasses.map(item => {
    if (item?.class.match("(CS|CISC|MTH|MAT|CSC).*")) {
      return (
        <div key={item?.class} style={{ display: 'flex', justifyContent: 'space-between', width: 500,margin: '0 auto'}}>
          <span>{item?.class}</span>
          <span>{item?.description}</span>
          <span>{item?.grade}</span>
        </div>
      );
    }
  })}
  <h3 style={{marginTop:"2vh"}}>Students Progression thought the major classes.</h3>
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center',marginTop:"2vh" }}>
  <LineChart
    width={800} 
    height={400} 
    data={chart}
    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
  >
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="name" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Line type="monotone" dataKey="avg" stroke="#8884d8" activeDot={{ r: 8 }} />
  </LineChart>
  </div>
    </div>
  );
}

export default App ;
