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
              console.log(data);
            });
          }
        }}
      />
    </div>
  );
}
   



export default App;
