
import React from 'react'
import '../App.css'

const Courses = (props) => {

    // valitaan näytettävät radat suodattimen mukaan (...includes(props.filter))
    const coursesToShow = props.courses.filter(course => course.City.toLowerCase().includes(props.filter))

    // API:sta haettujen ratojen määrä on todella suuri ( > 4000), asetetaan rajat milloin ratoja näytetään
    if(coursesToShow.length > 30) 
    {
        return (
        <div>
            <header className="App-header">
                <h1>Find disc golf courses in Finland</h1>
            </header>
            <div>
                <p>Filter by city </p><input value={props.filter} onChange={props.handleFilter}/>
            </div>
            <div>
                <p>Too many matches, specify another filter</p>
            </div>
            <div id="Footer">
                <p>Courses API provided by disc golf metrix</p>
                <a href="https://discgolfmetrix.com/?u=rule&ID=37">Metrix API</a>
            </div>
        </div>        
        )
    }
    else if(coursesToShow.length <= 30 && coursesToShow.length >= 1) // <-- kun annetaan tarpeeksi hyvä suodatin, näytetään radoista, nimi, kaupunki, maakunta.
    {
        return (
            <div>
                <header className="App-header">
                    <h1>Find disc golf courses in Finland</h1>
                </header>
                <div>
                    <p>Filter by city </p><input value={props.filter} onChange={props.handleFilter}/>
                </div>
                <div>
                    {coursesToShow.map((course, i) =>
                        <div key={i} id="courseInfo"> 
                            <h3 key={course.Fullname}> {course.Fullname}</h3>
                            <p key={course.ID}> {course.Area}, {course.City} </p>
                        </div>
                    )}
                </div>
                <div id="Footer">
                    <p>Courses API provided by disc golf metrix</p>
                    <a href="https://discgolfmetrix.com/?u=rule&ID=37">Metrix API</a>
                </div>
            </div>  
        )
    }
    else
    {
        return (
            <div>
                <header className="App-header">
                    <h1>Find disc golf courses in Finland</h1>
                </header>
                <div>
                <p>Filter by city </p><input value={props.filter} onChange={props.handleFilter}/>
                </div>
                <div>
                    <p>No matches found</p>
                </div>
                <div id="Footer">
                    <p>Courses API provided by disc golf metrix</p>
                    <a href="https://discgolfmetrix.com/?u=rule&ID=37">Metrix API</a>
                </div>
            </div>        
            )
    }

}

export default Courses;