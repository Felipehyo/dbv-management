import React from 'react';

import './style.scss';

export default function Modal({children, widht, height}){

    return (
        <>
        <div className="modal-container">
            <div className="modal" style={{width:widht, height:height}}>
                <div className="filho">
                    {children}
                </div>
            </div>
        </div>
        </>
    )
}
