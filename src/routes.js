import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

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
import Partner from "./pages/Partner";

import { isAuthenticated } from './Auth';
const PrivateRoute = () => {
    const auth = isAuthenticated();
    return auth ? <Outlet /> : <Navigate to="/" />;
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default defaultRoutes;