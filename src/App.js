/*
 * App component JS code
* /

/*
 * The following installations were made:
 * npm install @mui/material @emotion/react @emotion/styled
 * npm install @fontsource/roboto
 * npm install @mui/icons-material
 * JS version set to Flow
 */
import './App.css';
import React, { useState }  from 'react';
import Item from './Item.js';
import MenuBar from './MenuBar';
import BarChart from './BarChart';
import ScatterPlot from './ScatterPlot'
import {Box, Container} from "@mui/system";

const dataset = {
    title: "World population",
    data: [
        { year: '1950', population: 2.525 },
        { year: '1960', population: 3.018 },
        { year: '1970', population: 3.682 },
        { year: '1980', population: 4.440 },
        { year: '1990', population: 5.310 },
        { year: '2000', population: 6.127 },
        { year: '2010', population: 6.930 },
    ]
};

const App = (props) => {
    const [key, setKey] = useState('p1.json');
    const [value, setValue] = useState(dataset);
    const [selection, setSelection] = useState([]);
    const [count, setCount] = useState(0);

    const init = () => {
        localStorage.setItem(key, JSON.stringify(dataset));
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setValue(JSON.parse(event.target.value));
    };

    const handleSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(selection.includes(event.target.dataPointIndex)) {
            let idx = selection.indexOf(event.target.dataPointIndex)
            selection.splice(idx, 1)
            setSelection(selection)
            setCount(count+1)
        }
        else {
            selection.push(event.target.dataPointIndex)
            setSelection(selection)
            setCount(count+1)
        }
    };

    init();

    return (
        <Container className="App" >
            <MenuBar></MenuBar>
            <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)' }} >
                <Item>
                    <ScatterPlot onSelect = {handleSelection} selection = {selection} dataset={value} sx={{
                        bgcolor: 'white', width: '100%', height: '100%'
                    }}>
                    </ScatterPlot>
                </Item>
                <Item>
                <BarChart onSelect = {handleSelection} selection = {selection} dataset={value} sx={{
                    bgcolor: 'white', width: '100%', height: '100%'
                }}>
                </BarChart>
                </Item>
            </Box>
        </Container>
    );

}

export default App;
