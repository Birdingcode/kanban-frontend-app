import React, { useState, useEffect, useContext } from "react"
import "../Form.css"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"
import { CSSTransition } from "react-transition-group"

function CreateUser() {
  // States htmlFor registration
  let navigate = useNavigate()
  const nodeRef = React.useRef(null)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    oldEmail: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    password: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    privilege: {
      value: "",
      hasErrors: false,
      message: ""
    },
    submitCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErrors = false
        draft.username.value = action.value
        if (draft.username.value.length > 30) {
          draft.username.hasErrors = true
          draft.username.message = "Username cannot exceed 30 characters"
        }
        return
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErrors = true
          draft.username.message = "Username must be at least 3 characters."
        }
        if (!draft.username.hasErrors && !action.noRequest) {
          draft.username.checkCount++
        }
        return
      case "usernameUniqueResults":
        //if sever send back value of true
        if (action.value) {
          draft.username.hasErrors = true
          draft.username.isUnique = false
          draft.username.message = "That username is already taken."
        } else {
          draft.username.isUnique = true
        }
        return
      case "emailImmediately":
        draft.oldEmail.hasErrors = false
        draft.oldEmail.value = action.value

        return
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.oldEmail.value)) {
          draft.oldEmail.hasErrors = true
          draft.oldEmail.message = "You must provide a valid email address"
        }
        if (!draft.oldEmail.hasErrors && !action.noRequest) {
          draft.oldEmail.checkCount++
        }
        return
      case "emailUniqueResults":
        if (action.value) {
          draft.oldEmail.hasErrors = true
          draft.oldEmail.isUnique = false
          draft.oldEmail.message = "Email taken."
        } else {
          draft.oldEmail.isUnique = true
        }
        return
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
      case "privilegeHave":
        draft.privilege.value = action.value
        draft.privilege.hasErrors = false
        if ((draft.privilege.length = 0)) {
          draft.privilege.hasErrors = true
          draft.privilege.message = "Please include a privilege"
        }
        return
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.oldEmail.hasErrors && draft.oldEmail.isUnique && !draft.password.hasErrors && !draft.privilege.hasErrors) {
          draft.submitCount++
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(() => dispatch({ type: "usernameAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.username.value])

  useEffect(() => {
    if (state.oldEmail.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.oldEmail.value])

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    async function checkGroup() {
      try {
        const response = await Axios.post("/checkGroup", { username: localStorage.getItem("username") }, { withCredentials: true })
        console.log(response.data)
        if (response.data !== true) {
          navigate("/")
        }
        //setState(response.data)
      } catch (e) {
        console.log(e)
      }
    }
    checkGroup()
  }, [])

  useEffect(() => {
    if (state.username.checkCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value }, { withCredentials: true })
          dispatch({ type: "usernameUniqueResults", value: response.data })
        } catch (e) {
          console.log("There was a problem or request canceled")
        }
      }
      fetchResults()
    }
  }, [state.username.checkCount])

  useEffect(() => {
    if (state.password.checkCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesPasswordCondition", { password: state.password.value }, { withCredentials: true })
          dispatch({ type: "passwordChar", value: response.data })
        } catch (e) {
          console.log(e)
          console.log("There was a problem or request canceled")
        }
      }
      fetchResults()
    }
  }, [state.password.checkCount])

  useEffect(() => {
    if (state.oldEmail.checkCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesEmailExist", { oldEmail: state.oldEmail.value }, { withCredentials: true })
          dispatch({ type: "emailUniqueResults", value: response.data })
        } catch (e) {
          console.log("There was a problem or request canceled")
        }
      }
      fetchResults()
    }
  }, [state.oldEmail.checkCount])

  useEffect(() => {
    if (state.submitCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/register", { username: state.username.value, oldEmail: state.oldEmail.value, password: state.password.value, privilege: state.privilege.value }, { withCredentials: true })
          appDispatch({ type: "login", data: response.data })
          navigate("/userManagement")
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
    dispatch({ type: "usernameImmediately", value: state.username.value })
    dispatch({ type: "usernameAfterDelay", value: state.username.value, noRequest: true })
    dispatch({ type: "emailImmediately", value: state.oldEmail.value })
    dispatch({ type: "emailAfterDelay", value: state.oldEmail.value, noRequest: true })
    dispatch({ type: "passwordImmediately", value: state.password.value })
    dispatch({ type: "passwordAfterDelay", value: state.password.value, noRequest: true })
    dispatch({ type: "privilegeImmediately", value: state.privilege.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <Page title="Creating New User">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Kanban App</Navbar.Brand>
        </Container>
      </Navbar>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="form-body">
            <div className="username">
              <label className="form__label" htmlFor="firstName">
                Username{" "}
              </label>
              <input onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} className="form__input" type="text" id="firstName" placeholder="Username" autoComplete="off" />
              <CSSTransition nodeRef={nodeRef} in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
              </CSSTransition>
            </div>

            <div className="email">
              <label className="form__label" htmlFor="email">
                Email{" "}
              </label>
              <input onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} type="email" id="email" className="form__input" placeholder="Email" autoComplete="off" />
              <CSSTransition nodeRef={nodeRef} in={state.oldEmail.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.oldEmail.message}</div>
              </CSSTransition>
            </div>
            <div className="password">
              <label className="form__label" htmlFor="password">
                Password{" "}
              </label>
              <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} className="form__input" type="password" id="password" placeholder="Password" autoComplete="off" />
              <CSSTransition nodeRef={nodeRef} in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
            </div>
            <div className="privilege">
              <label className="form__label" htmlFor="privilege">
                Group(Privilege){" "}
              </label>
              <input onChange={e => dispatch({ type: "privilegeHave", value: e.target.value })} className="form__input" type="privilege" id="privilege" placeholder="Group(Privilege)" autoComplete="off" />
            </div>
          </div>
          <div className="footer">
            <button type="submit" className="btn">
              Create New User
            </button>
          </div>
        </div>
      </form>
    </Page>
  )
}
export default CreateUser
