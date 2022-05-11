import React, { useState, useReducer, useEffect, Suspense } from "react"
import { useImmerReducer } from "use-immer"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { CSSTransition } from "react-transition-group"
import Axios from "axios"
import Cookies from "js-cookie"
import "./App.css"

Axios.defaults.baseURL = process.env.REACT_APP_BACKENDURL || ""

import StateContext from "./StateContext"
import DispatchContext from "./DispatchContext"

// My Components
import CenterGuest from "./components/CenterGuest"
import FlashMessages from "./components/FlashMessages"
import Home from "./components/Home"
import UserManagement from "./components/UserManagement"
import CreateUser from "./components/CreateUser"
import ChangePassword from "./components/ChangePassword"
import ChangeEmail from "./components/ChangeEmail"
import ChangePersonalPw from "./components/ChangePersonalPw"
import CreateApp from "./components/CreateApp"
import CreatePlan from "./components/CreatePlan"
import CreateTask from "./components/CreateTask"
import NotFound from "./components/NotFound"
import KBoard from "./components/KBoard"
import NavBar from "./components/NavBar"

export default function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("kanbanSuccess")),
    flashMessages: [],
    user: {
      state: localStorage.getItem("kanbanSuccess"),
      username: localStorage.getItem("username")
    }
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true
        return
      case "logout":
        draft.loggedIn = false
        return
      case "flashMessage":
        draft.flashMessages.push(action.value)
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (!state.loggedIn) {
      localStorage.removeItem("kanbanSuccess")
      localStorage.removeItem("username")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          {state.loggedIn ? <NavBar /> : null}
          <Routes>
            <Route exact path="/" element={state.loggedIn ? <Home /> : <CenterGuest />} />
            <Route path="/changePersonalPw" element={state.loggedIn ? <ChangePersonalPw /> : <CenterGuest />} />
            <Route path="/userManagement/" element={state.loggedIn ? <UserManagement /> : <CenterGuest />} />
            <Route path="/userManagement/createUser" element={state.loggedIn ? <CreateUser /> : <CenterGuest />} />
            <Route path="/userManagement/changePassword" element={state.loggedIn ? <ChangePassword /> : <CenterGuest />} />
            <Route path="/userManagement/changeEmail" element={state.loggedIn ? <ChangeEmail /> : <CenterGuest />} />
            <Route path="/createApp" element={state.loggedIn ? <CreateApp /> : <CenterGuest />} />
            <Route path="/createPlan" element={state.loggedIn ? <CreatePlan /> : <CenterGuest />} />
            <Route path="/project/:App_Acronym" element={state.loggedIn ? <KBoard /> : <CenterGuest />} />
            <Route path="/createTask" element={state.loggedIn ? <CreateTask /> : <CenterGuest />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
