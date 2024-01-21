import React from 'react'

const SingleClassContainer = (props) => {
  return (
    <div className={props.cssClass}>
        <div className='class_name'>{props.class}</div>
        <div className='class_description'>{props.description}</div>
        <div className='class_credit'>{props.credits}</div>
        <div className='creditEarn'> Credits</div>
        <div className='class_grade'>{props.grade}</div>
    </div>
  )
}

export default SingleClassContainer