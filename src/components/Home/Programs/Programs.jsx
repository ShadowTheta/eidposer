import React from 'react'
import './Programs.css'
import {programsData} from '../../../data/programsData';
import {Link} from 'react-router-dom';

const Programs = () => {
    return(
        <div className="Programs" id="programs">
            <script type = "text/javascript" src = "Exercise.js"></script>
            {/* header */}
            <div className="programs-header">
                <span className='stroke-text'>Most Popular</span>
                <span>Programs</span>
                <span className='stroke-text'>to shape you</span>
            </div>
            <div className="program-categories">
                {programsData.map((program)=>(
                    <div className="category">
                        {program.image}
                        <span><h3>{program.heading}</h3></span>
                        <span>{program.details}</span>
                        <div className="join-now">
                        <Link to={`/Exercise/${program.heading}`}><button className='joinbutton'>Start Now</button></Link>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Programs