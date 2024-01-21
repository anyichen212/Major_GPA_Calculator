import React, { useState } from 'react'
import SingleClassContainer from './SingleClassContainer';

const AllClassContainer = (props) => {
    const [majorClasses, setMajorClasses] = useState(true)

    function handleMajorButton() {
        setMajorClasses(true)
    }

    function handleAllButton() {
        setMajorClasses(false)
    }



  return (
    <div className="AllClassContainer">

        <div className='classButtons'>
            <button className={ majorClasses ? 'active' : 'notActive' } onClick={handleMajorButton}>Major Classes</button>
            <button className={ majorClasses ? 'notActive' : 'active' } onClick={handleAllButton}>All Classes</button>
        </div>
        
        {/* classHeader */}
        <div className="class1 classHeader" style={{padding:'5px', minHeight:0}}>
            <div className='class_name' style={{marginTop:'auto', marginBottom:'auto'}}>CLASS</div>
            <div className='class_description' style={{fontWeight:'bold'}}>DESCRIPTION</div>
            <div className='class_credit' style={{fontWeight:'bold'}}>CREDIT</div>
            <div className='class_grade'>GRADE</div>
        </div>



        {/* list of major classes */}
        {majorClasses && props.allClasses.map(item => {
            if (item?.class.match("(CS|CISC|MTH|MAT|CSC).*")){
                return <SingleClassContainer 
                    class={item?.class} 
                    description={item?.description} 
                    credits={item?.credits} 
                    grade={item?.grade}
                    cssClass={item.class.match("(MTH|MAT).*") ? 'class1' : 'class2'}

                    />
            }
        })}

        {/* list of all classes, only show if all class button is click */}
        {!majorClasses && props.allClasses.map(item => {
            if (item?.class.match("(CS|CISC|MTH|MAT|CSC).*")){
                return <SingleClassContainer 
                    class={item?.class} 
                    description={item?.description} 
                    credits={item?.credits} 
                    grade={item?.grade}
                    cssClass={item.class.match("(MTH|MAT).*") ? 'class1' : 'class2'}

                    />
            } else {
                return <SingleClassContainer 
                    class={item?.class} 
                    description={item?.description} 
                    credits={item?.credits} 
                    grade={item?.grade}
                    cssClass={'class3'}

                    />
            }
        })}
    </div>
  )
}

export default AllClassContainer