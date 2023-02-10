/*
 * Editor component JS code
 */

import './Editor.css';
import React from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const Editor = (props) => {
        return(
            <Box sx={{ position: 'absolute', left: '0vw', height: '100vh', width: '50vw', bgcolor: 'antiquewhite' }}>
                    <TextField sx={{ background: 'white', position: 'absolute', left: '1vw', top: '2vh', width: '16vw' }} label={'Min'} >

                    </TextField>
                    <TextField sx={{ background: 'white', position: 'absolute', left: '17vw', top: '2vh', width: '16vw' }} label={'Current'} >

                    </TextField>
                    <TextField sx={{ background: 'white', position: 'absolute', left: '33vw', top: '2vh', width: '16vw' }} label={'Max'} >

                    </TextField>
                <Box
                sx={{ position: 'absolute', left: '1vw', top: '12vh', width: '48vw' }} >
                <Select value={props.scale}
                        onChange={props.handleBlur}
                        id={props.id + "Scale"}
                        value={2}
                        sx={{ background: 'maroon', color: 'white', width: '48vw'}}
                >
                    <MenuItem value={0}>Celsius</MenuItem>
                    <MenuItem value={1}>Fahrenheit</MenuItem>
                    <MenuItem value={2}>Kelvin</MenuItem>
                </Select >
                </Box>
            </Box>
        );
};

export default Editor;
