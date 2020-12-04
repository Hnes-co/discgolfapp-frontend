
import React from 'react';
import '../App.css'

const Links = () => {

    return(
        <div>
            <header className="App-header">
                <h1>Some useful links</h1>
            </header>
            <div className="buydiscs">
                <h2>Buy discs, bags and other accessories</h2>
                <a id="link" href="https://www.powergrip.fi">Powergrip</a><br></br>
                <a id="link" href="https://www.innovastore.fi">InnovaStore</a><br></br>
                <a id="link" href="https://www.frisbeemarket.com">Frisbeemarket</a><br></br>
                <a id="link" href="https://nbdg.fi/fi">NBDG</a>
            </div>
            <div className="watchdg">
                <h2>Watch disc golf on Youtube</h2>
                <a id="link" href="https://www.youtube.com/channel/UC59Yn1FzyDWGpGARcV7G_fw">Disc Golf Finland</a><br></br>
                <a id="link" href="https://www.youtube.com/channel/UCsrmSG6MHhU7aAwsq-ZhY8g">NBDG</a><br></br>
                <a id="link" href="https://www.youtube.com/channel/UCmGyCEbHfY91NFwHgioNLMQ">JomezPro</a>
            </div>
            <div className="findcomps">
                <h2>Find competitions and players</h2>
                <a id="link" href="https://www.pdga.com">PDGA</a><br></br>
                <a id="link" href="https://discgolfmetrix.com/">Metrix Suomi</a>
            </div>
        </div>
    )

}

export default Links;