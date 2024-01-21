import React from 'react'
import SingleClassContainer from './SingleClassContainer';

const AllClassContainer = (props) => {
    var classColor = true

  return (
    <div className="AllClassContainer">
        
        {/* classHeader */}
        <div className="class1 classHeader" style={{padding:'5px', minHeight:0}}>
            <div className='class_name' style={{marginTop:'auto', marginBottom:'auto'}}>CLASS</div>
            <div className='class_description' style={{fontWeight:'bold'}}>DESCRIPTION</div>
            <div className='class_credit' style={{fontWeight:'bold'}}>CREDIT</div>
            <div className='class_grade'>GRADE</div>
        </div>

        {/* list of classes */}
        {props.allClasses.map(item => {
            if (item?.class.match("(CS|CISC|MTH|MAT|CSC).*")){
                classColor = !classColor
                return <SingleClassContainer 
                    class={item?.class} 
                    description={item?.description} 
                    credits={item?.credits} 
                    grade={item?.grade}
                    cssClass={classColor ? 'class1' : 'class2'}

                    />
            }
        })}
    </div>
  )
}

export default AllClassContainer