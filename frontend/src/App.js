import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './stylesheets/App.css';
import FormView from './views/FormView';
import QuestionView from './views/QuestionView';
import Header from './components/Header';
import QuizView from './views/QuizView';

class App extends Component {
  render() {
    return (
      <div className='App'>
        <Router>
          <Header />
          <Switch>
            <Route path='/' exact component={QuestionView} />
            <Route path='/add' component={FormView} />
            <Route path='/play' component={QuizView} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
