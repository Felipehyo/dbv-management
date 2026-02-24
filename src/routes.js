import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Score from "./pages/Score";
import ScoreByUnit from "./pages/ScoreByUnit";
import Presence from "./pages/Presence";
import Statistics from "./pages/Statistics";
import ScoreStatistics from "./pages/ScoreStatistics";
import UnitHistory from "./pages/UnitHistory";
import UserHistory from "./pages/UserHistory";
import EventRegister from "./pages/EventRegister";
import Treasury from "./pages/Treasury";
import PaymentRegister from "./pages/PaymentRegister";
import PaymentHistory from "./pages/PaymentHistory";
import CashBookRegister from "./pages/CashBookRegister";
import CashBookHistory from "./pages/CashBookHistory";
import Partner from "./pages/Partner";
import ClubEvents from "./pages/ClubEvents";
import EventEdit from "./pages/EventEdit";
import EventDetails from "./pages/EventDetails";
import EventUserRegister from "./pages/EventUserRegister";
import UserCash from "./pages/UserCash";
import User from "./pages/User";
import UserRegister from "./pages/UserRegister";
import UserEdit from "./pages/UserEdit";
import UserProfile from "./pages/UserProfile";
import CashBookEdit from "./pages/CashBookEdit";
import VirtualMinutes from "./pages/VirtualMinutes";
import VirtualMinutesSecretaria from "./pages/VirtualMinutes/Secretaria";
import VirtualMinutesCapelania from "./pages/VirtualMinutes/Capelania";
import VirtualMinutesHistorico from "./pages/VirtualMinutes/Historico";

import { isAuthenticated } from './Auth';

const canAccessPath = (userType, path) => {
  if (!userType) return false;

  const normalizedType = String(userType).toUpperCase();

  if (normalizedType === 'EXECUTIVE' || normalizedType === 'ADMIN') {
    return true;
  }

  if (normalizedType === 'EVENTUAL') {
    return false;
  }

  if (normalizedType === 'PATHFINDER' || normalizedType === 'DIRECTION') {
    if (path === '/home') return true;
    if (path.startsWith('/virtual-minutes')) return true;
    if (path.startsWith('/secretary/virtual-minutes')) return true;
    if (path.startsWith('/user/profile')) return true;
    return false;
  }

  return false;
};

const PrivateRoute = () => {
    const auth = isAuthenticated();
    const location = useLocation();
    const userType = sessionStorage.getItem('userType');

    if (!auth) return <Navigate to="/" />;

    if (!canAccessPath(userType, location.pathname)) {
      return <Navigate to={userType === 'EVENTUAL' ? '/' : '/home'} />;
    }

    return <Outlet />;
}

function defaultRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" exact element={<Login />}/>
        <Route path='/partner' exact element={<Partner/>}/>
        <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/home' element={<Home/>}/>
            <Route exact path='/score' element={<Score/>}/>
            <Route path='/score/unit' exact element={<ScoreByUnit/>}/>
            <Route path='/presence' exact element={<Presence/>}/>
            <Route path='/statistics' exact element={<Statistics/>}/>
            <Route path='/statistics/score' exact element={<ScoreStatistics/>}/>
            <Route path='/statistics/unit/history' exact element={<UnitHistory/>}/>
            <Route path='/statistics/user/history' exact element={<UserHistory/>}/>
            <Route path='/event/register' exact element={<EventRegister/>}/>
            <Route path='/treasury' exact element={<Treasury/>}/>
            <Route path='/treasury/register' exact element={<PaymentRegister/>}/>
            <Route path='/treasury/history' exact element={<PaymentHistory/>}/>
            <Route path='/treasury/cash-book/register' exact element={<CashBookRegister/>}/>
            <Route path='/treasury/cash-book' exact element={<CashBookHistory/>}/>
            <Route path='/event' exact element={<ClubEvents/>}/>
            <Route path='/event/edit' exact element={<EventEdit/>}/>
            <Route path='/event/details' exact element={<EventDetails/>}/>
            <Route path='/event/details/user-register' exact element={<EventUserRegister/>}/>
            <Route path='/user-cash' exact element={<UserCash/>}/>
            <Route path='/user' exact element={<User/>}/>
            <Route path='/user/register' exact element={<UserRegister/>}/>
            <Route path='/user/edit' exact element={<UserEdit/>}/>
            <Route path='/user/profile' exact element={<UserProfile/>}/>
            <Route path='/treasury/cash-book/edit' exact element={<CashBookEdit/>}/>
            <Route path='/virtual-minutes' exact element={<VirtualMinutes/>}/>
            <Route path='/virtual-minutes/secretaria' exact element={<VirtualMinutesSecretaria/>}/>
            <Route path='/virtual-minutes/capelania' exact element={<VirtualMinutesCapelania/>}/>
            <Route path='/virtual-minutes/historico' exact element={<VirtualMinutesHistorico/>}/>
            <Route path='/secretary/virtual-minutes/create' exact element={<VirtualMinutes/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default defaultRoutes;