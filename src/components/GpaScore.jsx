import React from 'react'
import CountUp from "react-countup";

export const GpaScore = (props) => {
    let dec = (props.averageGPA*100)%100

  return (
    <div>
        <h1 className="college">{props.college}</h1>
        <div className="studentName">Student Name: {props.studentName}</div>
        <div className="GpaScoreContainer">
            <h3>Your Average Major GPA is :</h3> 
            <div className="MajorGPAScore">
                <CountUp
                    start={0}
                    end={Math.floor(props.averageGPA)}
                    duration={1}
                    />
                .{dec < 10 && 0}
                <CountUp
                    start={0}
                    end={dec}
                    duration={1.2}
                    />
            </div>
            <div className='cumGPA'>Cumulative GPA : {props.cumGPA}</div>
        </div>
        
    </div>
  )
}
