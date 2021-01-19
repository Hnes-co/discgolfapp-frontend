
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
                                    <td key={hole.id}> <input name={i} onChange={props.handleScore} size="2" type="number" min="1" step="1" required/> </td>
                                )}
                            </tr>
                            </tbody>
                        </table>
                        </div>
                    <button className="saveButton" type="submit">Save</button>
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



const Scores = () => {
    const [courseToShow, setCourseToShow] = useState([])

    const [score, setScore] = useState({})
    const [newName, setNewName] = useState('')
    const [message, setMessage] = useState(null)
    let total = 0
    const [treResults, setTreResults] = useState([])
    const [smResults, setSmResults] = useState([])

    // lähetetään axios-pyyntö MongoDB tietokantaan, haetaan tallennetut ratatulokset, asetetaan saapunut data tuloksiin
    useEffect(() => {
        scoreService
            .getAll()
            .then(initialScores => {
                setTreResults(initialScores.filter(result => result.course === "Tampere Disc Golf Center (18 hole silver layout)"))
                setSmResults(initialScores.filter(result => result.course === "Sahanmäki DiscGolfPark (20 hole 2020 layout)"))
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
            let resultCourse
            let toPar
            let scoreArray = []

            for(let i = 0; i < Object.keys(score).length; i++) // lasketaan kokonaistulos, eli olion jokaisen kentän arvot lasketaan yhteen
            {
                total = total + parseInt(score[i])
                scoreArray.push({id: i + 1, result: parseInt(score[i])})        
            }
            if(Object.keys(score).length === 18) {
                resultCourse = courses[0].name
                toPar = total - courses[0].parTotal
            }
            else {
                resultCourse = courses[1].name
                toPar = total - courses[1].parTotal
            }

            setCourseToShow([]) // kun tulokset on tallennettu, ei lomaketta haluta enää näyttää käyttäjälle, joten nollataan se.
            setScore({}) // nollataan myös tulokset

            let d = new Date()
            let time = d.getDate() + '/' + d.getMonth() + 1 + '/' + d.getFullYear()
            const resultObject = { // luodaan tulosolio, joka voidaan lähettää tietokantaan.
                name: newName,
                course: resultCourse,
                score: total,
                toPar: toPar,
                results: scoreArray,
                time: time,
            }


            scoreService // lähetetään tallennettu tulosolio tietokantaan, ja tallennetaan vastauksessa sama olio tuloksiin, jotka näytetään ruudulla.
                .create(resultObject) 
                .then(returnedObject => {
                    if(returnedObject.course === "Tampere Disc Golf Center (18 hole silver layout)")
                    {
                        setTreResults(treResults.concat(returnedObject))
                    }
                    else
                    {
                        setSmResults(smResults.concat(returnedObject))
                    }
                    total = 0
                    scoreArray = []
                    setMessage('Score saved!')
                    setTimeout(() => {
                        setMessage(null)
                    }, 5000)
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
                <h2>Player Scores: </h2>
                <h3>Tampere Disc Golf Center</h3>
                    <div className="resultDiv">
                        <table className="resultTable">
                            <tbody key>
                                <tr className="trow">
                                    <th id="cell1">Player</th><th id="cell1">Date</th><th id="cell2">Hole:</th>{courses[0].holes.map(hole => <th key={hole.id}>{hole.id}</th>)}<th>To par</th>
                                </tr>
                                <tr>
                                    <td> </td><td>  </td><td id="cell2">Par: </td>{courses[0].holes.map(hole => <td key={hole.id}>{hole.par}</td>)}<td> </td>
                                </tr>
                                {treResults.map(result => 
                                <tr key={result.id} className="trow">
                                    <td id="cell1">{result.name}</td><td id="cell1">{result.time}</td><td id="cell2">Result: </td>{result.results.map(result => <td key={result.id} id="tdresult">{result.result}</td>)}<td> {result.toPar} </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <h3>Sahanmäki DiscGolfPark</h3>
                    <div className="resultDiv">
                        <table className="resultTable">
                            <tbody key>
                                <tr className="trow">
                                    <th id="cell1">Player</th><th id="cell1">Date</th><th id="cell2">Hole:</th>{courses[1].holes.map(hole => <th key={hole.id}>{hole.id}</th>)}<th>To par</th>
                                </tr>
                                <tr>
                                    <td> </td><td>  </td><td id="cell2">Par: </td>{courses[1].holes.map(hole => <td key={hole.id}>{hole.par}</td>)}<td> </td>
                                </tr>
                                {smResults.map(result => 
                                <tr key={result.id} className="trow">
                                    <td id="cell1">{result.name}</td><td id="cell1">{result.time}</td><td id="cell2">Result: </td>{result.results.map(result => <td id="tdresult" key={result.id}>{result.result}</td>)}<td> {result.toPar} </td>
                                </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
            </div>
            <div id="Footer">
                <p>Scores are saved to MongoDB Atlas</p>
            </div>
        </div>
    )

}

export default Scores;