import React, {useState} from 'react';
import {
    HashRouter as Router,
    Route,
    Routes
} from "react-router-dom";

import IntroPage from "./IntroPage";
import Room from "./Room";

export default function Routing (){
    const [formData, setFormData] = useState({
        name: "",
        room: ""
    });

    return(
        <div className="wrapper">
            <Router>
                <section className="section">
                    <Routes>
                        <Route path="/:room" element={<Room formData={formData}/>} />
                        <Route exact path="/" element={<IntroPage setData={setFormData}/>} />
                    </Routes>
                </section>
            </Router>
        </div>
    );
}
