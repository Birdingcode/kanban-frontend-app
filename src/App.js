import React, { useState, useReducer, useEffect, Suspense } from "react"
import ReactDOM from "react-dom/client"
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

export default function App() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("kanbanSuccess")),
    flashMessages: [],
    user: {
      state: localStorage.getItem("kanbanSuccess")
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
    if (state.loggedIn) {
      localStorage.setItem("kanbanSuccess", state.user.success)
    } else {
      localStorage.removeItem("kanbanSuccess")
    }
  }, [state.loggedIn])

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />

          <Routes>
            <Route path="/" element={state.loggedIn ? <Home /> : <CenterGuest />} />
            <Route path="/userManagement/" element={state.loggedIn ? <UserManagement /> : <CenterGuest />} />
            <Route path="/userManagement/createUser" element={<CreateUser />} />
            <Route path="/userManagement/changePassword" element={<ChangePassword />} />
            <Route path="/userManagement/changeEmail" element={<ChangeEmail />} />
          </Routes>
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  )
}
