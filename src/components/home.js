
import React from 'react';
import '../App.css'


const Home = () => { // SPA:n kotisivu

    return(
        <div>
            <header className="home-header">
                <h1>Welcome to Disc Golf SPA</h1>
            </header>
            <div className="home-content">
                Hello! This is the home page for the disc golf app. 
                Use the navigation bar above to browse the site.
            </div>
            <div id="Footer">
                <p>Site created by Hannes Pohjola</p>
            </div>
        </div>
    )

}

export default Home;