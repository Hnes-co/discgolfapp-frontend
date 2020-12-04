import {
  BrowserRouter as Router,
  Switch, Route, Link
} from "react-router-dom"
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Home from './components/home'
import Courses from './components/courses'
import Scores from './components/scores'
import Links from './components/links'
import './App.css';

const App = () => {

  const [courses, setCourses] = useState([])
  const [filter, setFilter] = useState('')
  const [responseData, setResponseData] = useState({})
  
  // haetaan suomen ratojen tiedot METRIX API:sta 
  useEffect(() => {
    axios.get('https://discgolfmetrix.com/api.php?content=courses_list&country_code=FI')
      .then(response => {
        setResponseData(response.data) 
      })
  }, [])

  // ratojen suodatus kaupungin mukaan
  const handleFilter = (event) => {
    setFilter(event.target.value)
  }

  // suodatetaan API:sta haetut ratojen tiedot siten, että saman radan eri versiota toistuu mahd. vähän (type === "1")
  // ja asetetaan ehto että radan tietojen kenttä City ei voi olla null, sillä ratoja filtteröidään tämän arvon perusteella.
  const handleCourses = () => {
    if(courses.length === 0)
    {
      setCourses(responseData.courses.filter(course => course.Type === "1" && course.City !== null))
    }
  }

  return (
    <Router> 
      <div className="App"> 
        <div className="Navigation">
            <Link className="button" to="/">Home</Link>
            <Link className="button" to="/courses" onClick={handleCourses}>Browse courses in Finland</Link>
            <Link className="button" to="/scores">Save your rounds </Link>
            <Link className="button" to="/links">Useful links</Link>
        </div>
        <div className="content">
          <Switch>
            <Route path="/courses">
              <Courses courses={courses} filter={filter.toLowerCase()} handleFilter={handleFilter} />
            </Route>
            <Route path="/scores">
              <Scores />
            </Route>
            <Route path="/links">
              <Links />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
