import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@mui/material';

import './style.scss';
import Nav from '../../components/Nav';
import api from '../../services/api';

const VirtualMinutes = () => {
  const navigate = useNavigate();
  const userId = sessionStorage.getItem('id');
  const unitIdFromSession = sessionStorage.getItem('unitId');
  const [unitId, setUnitId] = useState(unitIdFromSession || null);
  const [unitName, setUnitName] = useState('');
  const [unitLogo, setUnitLogo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Buscar informações do usuário logado para pegar a unidade
    const fetchUserInfo = async () => {
      console.log('Buscando informações do usuário - userId:', userId);
      try {
        
        const response = await api.get(`/user/${userId}`);
        console.log('Resposta da API /user:', response.data);
        
        if (response.data) {
          // Tenta diferentes nomes de campo para unitId
          const unit = response.data.unitId || response.data.unit_id || response.data.unit?.id;
          const name = response.data.unitName || response.data.unit_name || response.data.unit?.name || 'Unidade';
          
          if (unit) {
            setUnitId(unit);
            setUnitName(name);
            
            // Buscar informações da unidade para obter o logo
            try {
              const unitResponse = await api.get(`/unit/${unit}`);
              if (unitResponse.data && unitResponse.data.imageLink) {
                setUnitLogo(unitResponse.data.imageLink);
              }
            } catch (unitError) {
              console.warn('Erro ao buscar logo da unidade:', unitError);
            }
          } else {
            console.warn('Nenhum unitId encontrado na resposta:', response.data);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar informações do usuário:', error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserInfo();
    }
  }, [userId]);

  function handleBack() {
    navigate('/home');
  }

  function handleCardClick(route) {
    console.log('Card clicado - unitId:', unitId, 'route:', route);
    
    if (unitId) {
      sessionStorage.setItem('virtualMinutesUnitId', unitId);
      if (unitLogo) {
        sessionStorage.setItem('virtualMinutesUnitLogo', unitLogo);
      }
      console.log('Navegando para:', route);
      navigate(route);
    } else {
      console.warn('UnitId não disponível:', unitId);
    }
  }

  if (loading) {
    return (
      <div className="default-container">
        <div className="sub-container-virtual-minutes">
          <p>Carregando informações da unidade...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="default-container">
      <div className="sub-container-virtual-minutes">
        <Nav handleBack={handleBack} />

        <img className="logo" src={unitLogo} alt="Ata Virtual" />
        <h1 className="nav-title">Ata Virtual</h1>

        <section className="section">
          <div className="options-container">
            <div
              className="card"
              onClick={() => handleCardClick('/virtual-minutes/secretaria')}
            >
              <div className="info">
                <h2>Ata da Secretaria</h2>
                <p>Registre presença, uniformes e outras informações. Até 3 fotos.</p>
              </div>
              <div className="image">
                <img src="https://cdn-icons-png.flaticon.com/512/8653/8653359.png" alt="Ata da Secretaria" />
              </div>
            </div>

            <div
              className="card"
              onClick={() => handleCardClick('/virtual-minutes/capelania')}
            >
              <div className="info">
                <h2>Ata da Capelania</h2>
                <p>Registre meditação, cânticos e reflexão espiritual.</p>
              </div>
              <div className="image">
                <img src="	https://cdn-icons-png.flaticon.com/512/8858/8858478.png" alt="Ata da Capelania" />
              </div>
            </div>

            <div
              className="card"
              onClick={() => handleCardClick('/virtual-minutes/historico')}
            >
              <div className="info">
                <h2>Histórico de Atas</h2>
                <p>Visualize todas as atas registradas organizadas por data.</p>
              </div>
              <div className="image">
                <img src="https://cdn-icons-png.flaticon.com/512/3209/3209265.png" alt="Histórico de Atas" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default VirtualMinutes;