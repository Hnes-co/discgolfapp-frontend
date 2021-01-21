
import React from 'react';
import '../App.css'
import { useState, useEffect } from 'react';
import scoreService from '../services/scoreService'

const Form = (props) => {



    if(props.courseToShow.length === 0)
    {
        return null // ei renderöidä lomaketta, ellei rataa, jonka tulokset halutaan tallentaa, ole valittu.
    }
    else
    {
        const parTotal = props.courseToShow.holes.map(hole => hole.par) 

        //luodaan lomake, ja sen sisälle taulukko
        // Luodaan taulukkoon kenttiä sen mukaan, kuinka monta väylää radassa on.
        // {props.courseToShow.holes.map(hole =>  <th key={hole.id}> {hole.id} </th> )}
        return(
            <div className="scoreDiv">
                <form onSubmit={props.handleFormSubmit}>
                    Your name: <input value={props.newName} onChange={props.handleName} required/>
                        <div className="scoreForm">
                        <table className="scoreTable">
                            <tbody>
                            <tr><th id="row-header">Hole</th>
                                {props.courseToShow.holes.map(hole =>  
                                    <th key={hole.id}> {hole.id} </th>
                                )}
                                <th id="row-header">Total</th>
                            </tr>
                            <tr><td id="row-header">Par</td>
                                {props.courseToShow.holes.map(hole =>  
                                    <td key={hole.id}> {hole.par} </td>
                                )}
                                <td id="row-header"> {parTotal.reduce((s, p) => s + p)} </td> 
                            </tr>
                            <tr><td id="row-header">Result</td>
                                {props.courseToShow.holes.map((hole, i) =>  
                                    <td key={hole.id}> <input id="resultInput" name={i} onChange={props.handleScore} type="number" min="1" step="1" required/> </td>
                                )}
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    <button className="saveButton" type="submit">Save</button>
                    <button className="saveButton" onClick={props.resetCourseToShow} >Cancel</button>
                </form>
            </div>
        )
    }
}

// Komponentti ilmoitusten näyttämistä varten käyttäjälle. Ei renderöidä mitään, jos näytettävää viestiä ei ole.
const Notification = ({message}) => {
    if (message === null) {
        return null
    }
    return (
        <div className="message">
          {message}
        </div>
    )
}


const NextClick = (props) => {
    

    if(!props.clickedNext) {
        return null
    }

    let holesArray = []
    for(let i = 0; i < props.newHoleAmount; i++)
    {
        holesArray.push({
            id: i + 1,
            par: 0
        }) 
    }

    return (
        <>
            <form onSubmit={props.handleAddNewFormSubmit}>
            <div className="scoreOverflow">
                <table className="scoreTable">
                <tbody>
                    <tr><th id="row-header">Hole</th>
                        {holesArray.map(hole =>  
                        <th key={hole.id}> {hole.id} </th>
                        )}
                    </tr>
                    <tr><td id="row-header">Par: </td>
                        {holesArray.map((hole, i) =>  
                        <td key={hole.id}> <input name={i} onChange={props.handleHolePar} size="2" type="number" min="1" step="1" required/> </td>
                        )}
                    </tr>
                </tbody>
                </table>
            </div>
            <button className="saveButton" type="submit">Save</button>
            <button className="saveButton" onClick={props.resetNewCourseAdd} >Cancel</button>
            </form>
        </>
    )
}


const NewCourseForm = (props) => {

    if(props.courseChosen) {
        return null
    }

    if(!props.showAddNew) {
        return (
            <>
                <h3> Can't find the course/layout you're looking for? Add a new course! </h3>
                <button className="button1" onClick={props.handleAddNew} >Add new</button>
            </>
        )
    }
    if(!props.showFirstForm) {
        return (
            <div className="addCourse">
                <h3>Please give par values for {props.newCourseName}</h3>
                <NextClick clickedNext={props.clickedNext} handleAddNew={props.handleAddNew} newHoleAmount={props.newHoleAmount} 
                handleHolePar={props.handleHolePar} handleAddNewFormSubmit={props.handleAddNewFormSubmit} resetNewCourseAdd={props.resetNewCourseAdd} />
            </div>
        )
    }
    return (
        <div className="addCourse">
            <form onSubmit={props.handleNextClick}>
                <div className="addLabel">
                <label>Course name: </label><input id="nameInput" value={props.newCourseName} onChange={props.handleCourseName} required/>
                </div>
                <div className="addLabel">
                <label>Number of holes:  </label><input id="holeInput" value={props.newHoleAmount} onChange={props.handleHoleAmount} type="number" min="1" max="30" step="1" required />
                </div>
                <button type="submit" className="addButton">Next</button>
                <button onClick={props.resetNewCourseAdd} className="addButton">Cancel</button>
            </form>
        </div>
    )
}



const Scores = () => {
    const [courses, setCourses] = useState([])

    const [courseToShow, setCourseToShow] = useState([])
    const [showAddNew, setShowAddNew] = useState(false)
    const [showFirstForm, setShowFirstForm] = useState(true)
    const [clickedNext, setclickedNext] = useState(false)
    const [courseChosen, setCourseChosen] = useState(false)

    const [score, setScore] = useState({})
    const [newName, setNewName] = useState('')

    const [newCourseName, setNewCourseName] = useState('')
    const [newHoleAmount, setNewHoleAmount] = useState(0)
    const [newCourseHoles, setNewCourseHoles] = useState({})
    
    const [message, setMessage] = useState(null)
    let total = 0


    // lähetetään axios-pyyntö MongoDB tietokantaan, haetaan tallennetut radat, asetetaan saapunut data courses - taulukkoon
    useEffect(() => {
        scoreService
            .getAll()
            .then(initialCourses => {
                setCourses(initialCourses)
            })
    }, [])
    const handleName = (event) => {
        setNewName(event.target.value)
    }

    const resetNewCourseAdd = () => {
        setShowAddNew(false)
        setShowFirstForm(true)
        setclickedNext(false)
        setNewCourseName('')
        setNewCourseHoles(0)
    }
    const handleCourseName = (event) => {
        setNewCourseName(event.target.value)
    }
    const handleHoleAmount = (event) => {
        setNewHoleAmount(event.target.value)
    }

    // kun tuloksia syötetään lomakkeeseen, hoidetaan syötetyn tuloksen tallennus oikean rataväylän tulokseksi.
    // toteutus mahdollistaa myös jo syötetyn tuloksen "kumittamisen" ja syöttämisen uudestaan, olio ei mene sekaisin
    const handleScore = (event) => {
        setScore({
            ...score,
            [event.target.name] : event.target.value
        })
    }
    const handleCourseHoles = (event) => {
        setNewCourseHoles({
            ...newCourseHoles,
            [event.target.name] : event.target.value
        })
    }

    //lomakkeen tallennus
    const handleFormSubmit = (event) => {
        event.preventDefault()
        let invalidInputs = false

        //Tarkistetaan ettei käyttäjä ole syöttänyt muita merkkejä kuin numeroita, eikä kenttiä ole jätetty tyhjäksi
        if(newName === '' || Object.keys(score).length < 1) {
            invalidInputs = true
        }
        for(let i = 0; i < Object.keys(score).length; i++)
        {
            if(isNaN(parseInt(score[i])) || parseInt(score[i]) === 0 || score[i] === '')
            {
                invalidInputs = true
            }
        }

        if(!invalidInputs)
        {
            let toPar
            let scoreArray = []

            for(let i = 0; i < Object.keys(score).length; i++) // lasketaan kokonaistulos, eli olion jokaisen kentän arvot lasketaan yhteen
            {
                total = total + parseInt(score[i])
                scoreArray.push({id: i + 1, result: parseInt(score[i])})        
            }
            toPar = total - courseToShow.parTotal

            let d = new Date()
            let time = d.getDate() + '/' + d.getMonth() + 1 + '/' + d.getFullYear()
            const resultObject = { // luodaan tulosolio, joka voidaan lähettää tietokantaan.
                name: newName,
                score: total,
                toPar: toPar,
                results: scoreArray,
                time: time,
            }

            const changedCourse = courses.find(c => c.name === courseToShow.name)
            changedCourse.results.push(resultObject)

            setCourseToShow([]) // kun tulokset on tallennettu, ei lomaketta haluta enää näyttää käyttäjälle, joten nollataan se.
            setScore({}) // nollataan myös tulokset


            scoreService // lähetetään tallennettu tulosolio tietokantaan, ja tallennetaan vastauksessa sama olio tuloksiin, jotka näytetään ruudulla.
                .update(changedCourse.id, changedCourse) 
                .then(returnedCourse => {
                    setCourses(courses.map(course => course.id !== changedCourse.id ? course : returnedCourse))
                    total = 0
                    scoreArray = []
                    setMessage('Score saved!')
                    setTimeout(() => {
                        setMessage(null)
                    }, 5000)
                    setCourseChosen(false)
                })

            
        }
        else // mikäli lomakkeen kenttiä jäi tyhjäksi, tai käyttäjä syötti muuta kuin numeroita, infotaan käyttäjää
        {
            setMessage('Inputs cannot be empty and hole results must be numbers larger than 0!')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }

    const handleAddNew = () => {
        setShowAddNew(true)
    }
    const handleNextClick = (event) => {
        event.preventDefault()
        setclickedNext(true)
        setShowFirstForm(false)
    }
    
    const handleAddNewFormSubmit = (event) => {
        event.preventDefault()
        let holesArray = []
        let newCourseParTotal = 0
        for(let i = 0; i < Object.keys(newCourseHoles).length; i++) 
        {
            newCourseParTotal += parseInt(newCourseHoles[i])
            holesArray.push({
                id: i + 1, 
                par: parseInt(newCourseHoles[i])
            })        
        }
        const newCourseObject = {
            name: newCourseName,
            parTotal: newCourseParTotal,
            holes: holesArray,
            results: []
        }
        scoreService
            .create(newCourseObject)
            .then(returnedCourse => {
                setCourses(courses.concat(returnedCourse))
                resetNewCourseAdd()
                setMessage('New course added!')
                setTimeout(() => {
                    setMessage(null)
                }, 5000)
            })
        
        
        
    }



    const resetCourseToShow = () => {
        setCourseToShow([])
        setCourseChosen(false)
    }
    const handleCourseToShow = (id) => {
        setCourseToShow(courses.find(course => course.id === id))
        setCourseChosen(true)
    }

    

    return(
        <div>
            <header className="App-header">
                <h1>Save your round and view scores</h1>
            </header>
            <div>
                <h2>Choose course</h2>
                {courses.map(course => <button className="button1" key={course.id} onClick={() => handleCourseToShow(course.id)}> {course.name} </button>)}
            </div>
            <div className="addNewCourse">
                <NewCourseForm courseChosen={courseChosen} showAddNew={showAddNew} handleAddNew={handleAddNew} newCourseName={newCourseName} newHoleAmount={newHoleAmount} 
                handleCourseName={handleCourseName} handleHoleAmount={handleHoleAmount} handleNextClick={handleNextClick} clickedNext={clickedNext} 
                handleHolePar={handleCourseHoles} handleAddNewFormSubmit={handleAddNewFormSubmit} showFirstForm={showFirstForm} resetNewCourseAdd={resetNewCourseAdd} />
            </div>
            <div>
                <Notification message={message} />
            </div>
            <div>
                <Form courseToShow={courseToShow} resetCourseToShow={resetCourseToShow} newName={newName} handleName={handleName} handleScore={handleScore} handleFormSubmit={handleFormSubmit} />
            </div>
            <div className="scores">
                <h2>Player Scores: </h2>
                    {courses.map(course =>
                        <div key={course.id}>
                            <h3>{course.name}</h3>
                            <div className="resultDiv">
                            <table className="resultTable">
                                <tbody>
                                    <tr className="trow">
                                        <th id="cell1">Player</th><th id="cell1">Date</th><th id="cell2">Hole:</th>{course.holes.map(hole => <th key={hole.id}>{hole.id}</th>)}<th>To par</th>
                                    </tr>
                                    <tr>
                                        <td> </td><td>  </td><td id="cell2">Par: </td>{course.holes.map(hole => <td key={hole.id}>{hole.par}</td>)}<td> </td>
                                    </tr>
                                    {course.results.map((result, i) => 
                                    <tr key={i} className="trow">
                                        <td id="cell1">{result.name}</td><td id="cell1">{result.time}</td><td id="cell2">Result: </td>{result.results.map(result => <td key={result.id} id="tdresult">{result.result}</td>)}<td> {result.toPar} </td>
                                    </tr>
                                    )}
                                </tbody>
                            </table>
                            </div>
                        </div>
                    )}
            </div>
            <div id="Footer">
                <p>Courses and results are saved to MongoDB Atlas</p>
            </div>
        </div>
    )

}

export default Scores;