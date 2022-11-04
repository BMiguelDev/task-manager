import React from "react";
import {BrowserRouter, Routes, Route} from 'react-router-dom';

import PageLayout from "./layouts/PageLayout";
import Project from "./pages/Project/Project";
import Home from "./pages/Home/Home";
import ErrorPage from "./pages/ErrorPage/ErrorPage";
import "./App.scss";


const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path='/task-manager' element={ <PageLayout /> }>
                    <Route index element={ <Home/>} />
                    <Route path='/task-manager/project/:id' element={ <Project/> } />
                    <Route path='/task-manager/*' element={<ErrorPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};
export default App;
