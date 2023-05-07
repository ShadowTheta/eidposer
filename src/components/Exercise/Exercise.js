import React from 'react';
// import './Header.css'
import { BrowserRouter as Route, Switch } from "react-router-dom";
import Exercises from './Exercises/Exercises';
import Pushups from './Pushups/Pushups'
// import Pushups from './Pushups/Pushups';
import Situps from './Situps/Situps';
import Squats from './Squats/Squats';

function Exercise() {
    return(
        
        <div >
            
            <Switch>
                <Route exact path="/Exercise">
                    <Exercises />
                </Route>
                <Route path="/Exercise/Pushups">
                    <Pushups/>
                </Route>
                <Route path="/Exercise/Situps">
                    <Situps />
                </Route>
                <Route path="/Exercise/Squats">
                    <Squats />
                </Route>
            </Switch>
        </div>
    )
}

export default Exercise;