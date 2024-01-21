import React from 'react'
import CountUp from "react-countup";

export const GpaScore = (props) => {
  return (
    <div className="GpaScoreContainer">
        <h2>{props.college}</h2>
        <h2>Your Average Major GPA is :</h2> 
        <div className="MajorGPAScore">
            <CountUp
                start={0}
                end={Math.floor(props.averageGPA)}
                duration={1}
                />
            .
            <CountUp
                start={0}
                end={(props.averageGPA*100)%100}
                duration={1.2}
                />
        </div>
    </div>
  )
}
