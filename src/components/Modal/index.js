import React from 'react';

import './style.scss';

export default function Modal({children, widht, height, backgroundColor, boxShadow}){

    return (
        <>
        <div className="modal-container">
            <div className="modal" style={{width:widht, height:height, backgroundColor:backgroundColor, boxShadow:boxShadow}}>
                <div className="filho">
                    {children}
                </div>
            </div>
        </div>
        </>
    )
}
