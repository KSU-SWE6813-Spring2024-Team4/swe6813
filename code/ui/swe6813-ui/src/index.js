import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter,  RouterProvider} from "react-router-dom";
import Root from './pages/Root/Root';
import AuthPage from './pages/AuthPage/AuthPage';
import TrendingGames from './pages/TrendingGames/TrendingGames';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root/>,
  },
  {
    path: "/auth",
    element: <AuthPage/>
  },
  {
    path: "/trending-games",
    element: <TrendingGames/>
  }
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <style>
    @import url('https://fonts.googleapis.com/css2?family=Audiowide&family=Electrolize&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap')
    </style>
    <RouterProvider router={router}/>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
