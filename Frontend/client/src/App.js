import React from "react";
import { Route, Routes } from "react-router-dom"
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/Home";
import Header from "./components/nav/Header";
import {ToastContainer} from "react-toastify";

const App = () => {
  return (
    <>
      <Header />
      <ToastContainer/>
      <Routes>
        <Route path="/" Component={Home} />
        <Route path="/login" Component={Login} />
        <Route path="/register" Component={Register} />
      </Routes></>
  )
}

export default App;
