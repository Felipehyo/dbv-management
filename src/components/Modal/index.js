import React from 'react';
/*import { Button } from "@mui/material";*/

import './style.scss';

export default function Modal({children, widht, height, /*onClick, color*/}){

    return (
        <>
        <div className="modal-container">
            <div className="modal" style={{width:widht, height:height}}>
                <div className="filho">
                    {children}
                </div>
                {/* <Button className="bt" onClick={onClick} style={{backgroundColor: color}}>
                    Ok
                </Button> */}
            </div>
        </div>
        </>
    )
}
