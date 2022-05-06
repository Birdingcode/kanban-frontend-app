import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { CSSTransition } from "react-transition-group"
import { useNavigate } from "react-router-dom"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"

function ChangePersonalPw() {
  let navigate = useNavigate()
  const appDispatch = useContext(DispatchContext)
  const nodeRef = React.useRef(null)
  const initialState = {
    cfmpassword: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    password: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },

    submitCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "passwordImmediately":
        draft.password.hasErrors = false
        draft.password.value = action.value
        if (draft.password.value.length > 11) {
          draft.password.hasErrors = true
          draft.password.message = "Password cannot exceed 10 characters"
        }
        return
      case "passwordAfterDelay":
        if (draft.password.value.length < 7) {
          draft.password.hasErrors = true
          draft.password.message = "Password must be at least 8 characters"
        }
        if (!draft.password.hasErrors && !action.noRequest) {
          draft.password.checkCount++
        }
        return
      case "passwordChar":
        if (action.value == false) {
          draft.password.hasErrors = true
          draft.password.message = "Password must contain alphabets, numbers and special Characters"
        } else {
        }
        return
      case "passwordMatch":
        draft.cfmpassword.value = action.value
        if (draft.cfmpassword.value != draft.password.value) {
          draft.cfmpassword.hasErrors = true
          draft.cfmpassword.message = "Password does not match."
        } else {
          draft.cfmpassword.hasErrors = false
        }
        return
      case "submitForm":
        if (!draft.password.hasErrors && !draft.cfmpassword.hasErrors) {
          draft.submitCount++
        }
        return
    }
  }
  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    if (state.password.checkCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesPasswordCondition", { password: state.password.value }, { withCredentials: true })
          dispatch({ type: "passwordChar", value: response.data })
        } catch (e) {
          console.log("There was a problem or request canceled")
        }
      }
      fetchResults()
    }
  }, [state.password.checkCount])

  useEffect(() => {
    if (state.submitCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/changePassword", { username: localStorage.getItem("username"), password: state.password.value, cfmpassword: state.cfmpassword.value }, { withCredentials: true })
          appDispatch({ type: "login", data: response.data })

          navigate("/")
        } catch (e) {
          console.log(e.response)
        }
      }
      fetchResults()
      //return () => ourRequest.cancel()
    }
  }, [state.submitCount])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "passwordImmediately", value: state.password.value })
    dispatch({ type: "passwordAfterDelay", value: state.password.value, noRequest: true })
    dispatch({ type: "submitForm" })
  }

  return (
    <Page title="Change Password">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Kanban App</Navbar.Brand>
        </Container>
      </Navbar>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="form-body">
            <div className="password">
              <label className="form__label" htmlFor="password">
                New Password{" "}
              </label>
              <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} className="form__input" type="password" id="password" placeholder="New Password" autoComplete="off" />
              <CSSTransition nodeRef={nodeRef} in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
            </div>
            <div className="cfmpassword">
              <label className="form__label" htmlFor="cfmpassword">
                Confirm Password{" "}
              </label>
              <input onChange={e => dispatch({ type: "passwordMatch", value: e.target.value })} className="form__input" type="password" id="cfmpassword" placeholder="Confirm Password" autoComplete="off" />
              <CSSTransition nodeRef={nodeRef} in={state.cfmpassword.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.cfmpassword.message}</div>
              </CSSTransition>
            </div>
          </div>
          <div className="footer">
            <button type="submit" className="btn">
              Change Password
            </button>
          </div>
        </div>
      </form>
    </Page>
  )
}

export default ChangePersonalPw
