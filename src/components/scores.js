
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
                    Your name: <input value={props.newName} onChange={props.handleName} />
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
                                    <td key={hole.id}> <input name={i} onChange={props.handleScore} size="2"/> </td>
                                )}
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    <button className="button1" type="submit">Save</button>
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
        <div className="error">
          {message}
        </div>
    )
}



const Scores = () => {
    const [courseToShow, setCourseToShow] = useState([])

    const [score, setScore] = useState({})
    const [results, setResults] = useState([])
    const [newName, setNewName] = useState('')
    const [message, setMessage] = useState(null)
    let total = 0

    // lähetetään axios-pyyntö MongoDB tietokantaan, haetaan tallennetut ratatulokset, asetetaan saapunut data tuloksiin
    useEffect(() => {
        scoreService
            .getAll()
            .then(initialScores => {
                setResults(initialScores)
            })
    }, [])
    const handleName = (event) => {
        setNewName(event.target.value)
    }

    // kun tuloksia syötetään lomakkeeseen, hoidetaan syötetyn tuloksen tallennus oikean rataväylän tulokseksi.
    // toteutus mahdollistaa myös jo syötetyn tuloksen "kumittamisen" ja syöttämisen uudestaan, olio ei mene sekaisin
    const handleScore = (event) => {
        setScore({
            ...score,
            [event.target.name] : event.target.value
        })
    }

    //lomakkeen tallennus
    const handleFormSubmit = (event) => {
        event.preventDefault()

        // Radan tulokset on tallennettu olioon, jonka attribuutit ovat numeroitu 1....18/20, 
        // haetaan attribuuttien eli object keysien määrä, 
        // jolloin tiedetään, että lomakkeen kaikki kentät on täytetty, eikä niitä ole jätetty tyhjiksi.

        if(Object.keys(score).length === 18 && newName !== '')
        {
            for(let i = 0; i < Object.keys(score).length; i++) // lasketaan kokonaistulos, eli olion jokaisen kentän arvot lasketaan yhteen
            {
                total = total + parseInt(score[`${i}`])
            }
            setCourseToShow([]) // kun tulokset on tallennettu, ei lomaketta haluta enää näyttää käyttäjälle, joten nollataan se.
            setScore({}) // nollataan myös tulokset

            const resultObject = { // luodaan tulosolio, joka voidaan lähettää tietokantaan.
                name: newName,
                course: courses[0].name,
                score: total,
                toPar: total - courses[0].parTotal // lasketaan tuloksen ero radan Par:iin nähden
            }


            scoreService // lähetetään tallennettu tulosolio tietokantaan, ja tallennetaan vastauksessa sama olio tuloksiin, jotka näytetään ruudulla.
                .create(resultObject) 
                .then(returnedObject => {
                    setResults(results.concat(returnedObject))
                    total = 0
                    setMessage('Score saved!')
                    setTimeout(() => {
                        setMessage(null)
                    }, 5000)
                })
        }
        else if(Object.keys(score).length === 20 && newName !== '') // samat kuin yllä, toiselle radalle
        {
            for(let i = 0; i < Object.keys(score).length; i++)
            {
                total = total + parseInt(score[`${i}`])
            }
            setCourseToShow([])
            setScore({})

            const resultObject = {
                name: newName,
                course: courses[1].name,
                score: total, 
                toPar: total - courses[1].parTotal
            }

            scoreService
                .create(resultObject)
                .then(returnedObject => {
                    setResults(results.concat(returnedObject))
                    total = 0
                    setNewName('')
                    setMessage('Score saved!')
                    setTimeout(() => {
                        setMessage(null)
                    }, 5000)
                })
        }
        else // mikäli lomakkeen kenttiä jäi tyhjäksi, infotaan käyttäjää
        {
            setMessage('You must fill all inputs before saving')
            setTimeout(() => {
                setMessage(null)
            }, 5000)
        }
    }


    // ratojen tiedot, joiden tuloksia on mahdollista tallentaa.
    // nämäkin radat voisi tallentaa ja hakea tietokannasta, ehkäpä tulevaisuudessa :)))
    const courses = [ 
        {
            name: "Tampere Disc Golf Center (18 hole silver layout)",
            id: 1,
            parTotal: 59,
            holes: [
                {
                    id: 1,
                    par: 3
                },
                {
                    id: 2,
                    par: 3
                },
                {
                    id: 3,
                    par: 3
                },
                {
                    id: 4,
                    par: 3
                },
                {
                    id: 5,
                    par: 3
                },
                {
                    id: 6,
                    par: 4
                },
                {
                    id: 7,
                    par: 3
                },
                {
                    id: 8,
                    par: 3
                },
                {
                    id: 9,
                    par: 3
                },
                {
                    id: 10,
                    par: 4
                },
                {
                    id: 11,
                    par: 3
                },
                {
                    id: 12,
                    par: 3
                },
                {
                    id: 13,
                    par: 4
                },
                {
                    id: 14,
                    par: 4
                },
                {
                    id: 15,
                    par: 3
                },
                {
                    id: 16,
                    par: 4
                },
                {
                    id: 17,
                    par: 3
                },
                {
                    id: 18,
                    par: 3
                },
            ]
        },
        {
            name: "Sahanmäki DiscGolfPark (20 hole 2020 layout)",
            id: 2,
            parTotal: 63,
            holes: [
                {
                    id: 1,
                    par: 3
                },
                {
                    id: 2,
                    par: 3
                },
                {
                    id: 3,
                    par: 3
                },
                {
                    id: 4,
                    par: 4
                },
                {
                    id: 5,
                    par: 3
                },
                {
                    id: 6,
                    par: 3
                },
                {
                    id: 7,
                    par: 3
                },
                {
                    id: 8,
                    par: 3
                },
                {
                    id: 9,
                    par: 3
                },
                {
                    id: 10,
                    par: 3
                },
                {
                    id: 11,
                    par: 4
                },
                {
                    id: 12,
                    par: 3
                },
                {
                    id: 13,
                    par: 3
                },
                {
                    id: 14,
                    par: 3
                },
                {
                    id: 15,
                    par: 3
                },
                {
                    id: 16,
                    par: 4
                },
                {
                    id: 17,
                    par: 3
                },
                {
                    id: 18,
                    par: 3
                },
                {
                    id: 19,
                    par: 3
                },
                {
                    id: 20,
                    par: 3
                },
            ]
        }
    ]

    const handleCourseToShow = (id) => {
        setCourseToShow(courses.find(course => course.id === id))
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
            <div>
                <Notification message={message} />
            </div>
            <div>
                <Form courseToShow={courseToShow} newName={newName} handleName={handleName} handleScore={handleScore} handleFormSubmit={handleFormSubmit} />
            </div>
            <div className="scores">
                <h3>Player Scores: </h3>
                {results.map(result => <p key={result.id}>Player: {result.name}, Course: {result.course}, Score: {result.score}, To par: {result.toPar} </p>)}
            </div>
            <div id="Footer">
                <p>Scores are saved to MongoDB Atlas</p>
            </div>
        </div>
    )

}

export default Scores;