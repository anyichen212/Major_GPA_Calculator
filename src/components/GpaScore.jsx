import React from 'react'

export const GpaScore = (props) => {
  return (
    <div className="GpaScoreContainer">
        <h2>Your Average Major GPA is :</h2> 
        <div className="MajorGPAScore">{props.averageGPA}</div>
    </div>
  )
}
