
import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './components/Home/Home';
import Exercise from './components/Exercise/Exercise'

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/Exercise/:heading" component={Exercise} />
          
        </Switch>
      </div>
    </Router>
  );
}

export default App;