import React from 'react';

import './style.scss';
import CloseIcon from '../../assets/close.png'

export default function BottomDrawer({ children, widht, height, backgroundColor, boxShadow }) {

    function closeDrawer() {
        document.querySelector('.botton-drawer-container').classList.remove('show-modal');
    }

    return (
        <>
            <div className="botton-drawer-container">
                <div className="drawer" style={{ width: widht, height: height, backgroundColor: backgroundColor, boxShadow: boxShadow }}>
                    <div className='bts' onClick={() => closeDrawer()}>
                        <img className='close' src={CloseIcon} alt="" />
                    </div>
                    <div className="filho">
                        {children}
                    </div>
                </div>
            </div>
        </>
    )
}
