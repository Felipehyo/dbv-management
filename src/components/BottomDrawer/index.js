import React from 'react';

import './style.scss';
import CloseIcon from '../../assets/close.png'

export default function BottomDrawer({ children, widht, height, backgroundColor, boxShadow }) {

    function closeDrawer() {
        document.querySelector('.botton-drawer-container').classList.remove('show-modal');
    }

    function handleOverlayClick(e) {
        // Fechar apenas se clicar no overlay (fora do drawer)
        if (e.target.classList.contains('botton-drawer-container')) {
            closeDrawer();
        }
    }

    return (
        <>
            <div className="botton-drawer-container" onClick={handleOverlayClick}>
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
