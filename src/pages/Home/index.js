import React from 'react';
import { useNavigate } from 'react-router-dom';

import './style.scss';
import Logo from '../../assets/Logo.png';
import Logout from '../../assets/logout.png';
import Score from '../../assets/score.png';
import Statistics from '../../assets/statistics.png';
import Presence from '../../assets/presence.png';

const Home = () => {

    // const [ email, setEmail ] = useState('');
    const navigate = useNavigate();

    function handleScore() {
        navigate("/score");
    }

    function handlelogout() {
        localStorage.clear();
        navigate("/");
    }

    return (
      <>
        <div className="container">
            <div className="container-home">
                <div className='nav' onClick={handlelogout}>
                    <img className="logout" src={Logout} alt=""/>
                </div>
                <img className="logo" src={Logo} alt=""/>
                <section className="section">
                    <div className="card" onClick={handleScore}>
                        <div className="info">
                            <h2>Pontuação</h2>
                            <p>Registrar pontuação geral do clube e unidades</p>
                        </div>
                        <div className="image">
                            <img src="https://cdn-icons-png.flaticon.com/512/3153/3153150.png" alt=""/>
                        </div>
                    </div>
                    <div className="card">
                        <div className="info">
                            <h2>Presença</h2>
                            <p>Registrar lista de presentes e kits individuais</p>
                        </div>
                        <div className="image">
                            <img src={Presence} alt=""/>
                        </div>
                    </div>
                    <div className="card">
                        <div className="info">
                            <h2>Estatísticas</h2>
                            <p>Estatísticas de presença e pontuação de unidades </p>
                        </div>
                        <div className="image">
                            <img src={Statistics} alt=""/>
                        </div>
                    </div>
                </section>
            </div>
        </div>
      </>
    )
  };
  
  export default Home;