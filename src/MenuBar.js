/*
 * MenuBar component JS code
 */

import './MenuBar.css';
import React from "react";
import Box from '@mui/material/Box';
import {AppBar, Button, Toolbar, Typography} from "@mui/material";

const MenuBar = (props) => {
        return(
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <div className="BoxContainer">
                            <Typography variant="h6" component="div" align="center">
                                Simple interactive graph
                            </Typography>
                        </div>
                    </Toolbar>
                </AppBar>
            </Box>
        );
};

export default MenuBar;
