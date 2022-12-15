import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Login/index.tsx";
import Home from "./pages/Home";
import Score from "./pages/Score";
import ScoreByUnit from "./pages/ScoreByUnit";

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
        <Route exact path='/' element={<PrivateRoute/>}>
            <Route exact path='/home' element={<Home/>}/>
            <Route exact path='/score' element={<Score/>}/>
            <Route path='/score/unit' exact element={<ScoreByUnit/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default defaultRoutes;