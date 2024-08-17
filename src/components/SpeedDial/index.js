import React, { useState } from 'react';
import './style.scss'; // Importa SCSS

export default function SpeedDial({img1, handle1, img2, handle2}){
  const [open, setOpen] = useState(false);

  const toggleOptions = () => {
    setOpen(!open);
  };

  return (
    <div className="speed-dial">
      <div 
        className={`speed-dial-btn ${open ? 'open' : ''}`} 
        onClick={toggleOptions}
      >
        +
      </div>
      {open && (
        <div className="speed-dial-options">
          <div className="speed-dial-option" onClick={handle2}>
            <img className='speed-dial-icon-2' src={img2} alt="" />
          </div>
          <div className="speed-dial-option" onClick={handle1}>
            <img className='speed-dial-icon-1' src={img1} alt="" />
          </div>
        </div>
      )}
    </div>
  );
};