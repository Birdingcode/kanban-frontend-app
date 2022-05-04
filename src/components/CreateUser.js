import React, { useState, useEffect, useContext } from "react"
import "../Form.css"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import Axios from "axios"

function CreateUser() {
  // States htmlFor registration
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    username: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    email: {
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
    role: {
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
        draft.email.hasErrors = false
        draft.email.value = action.value

        return
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErrors = true
          draft.email.message = "You must provide a valid email address"
        }
        if (!draft.email.hasErrors && !action.noRequest) {
          draft.email.checkCount++
        }
        return
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErrors = true
          draft.email.isUnique = false
          draft.email.message = "Email taken."
        } else {
          draft.email.isUnique = true
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
        if (action.value) {
          draft.password.hasErrors = true
          draft.password.message = "Password must contain alphabets, numbers and special Characters"
        } else {
        }
        return
      case "roleHave":
        draft.role.value = action.value
        draft.role.hasErrors = false
        if ((draft.role.length = 0)) {
          draft.role.hasErrors = true
          draft.role.message = "Please include a role"
        }
        return
      case "submitForm":
        if (!draft.username.hasErrors && draft.username.isUnique && !draft.email.hasErrors && draft.email.isUnique && !draft.password.hasErrors && !draft.role.hasErrors) {
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
    if (state.email.value) {
      const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.email.value])

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(() => dispatch({ type: "passwordAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.password.value])

  useEffect(() => {
    if (state.username.checkCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesUsernameExist", { username: state.username.value })
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
          const response = await Axios.post("/doesPasswordCondition", { password: state.password.value })
          dispatch({ type: "passwordChar", value: response.data })
        } catch (e) {
          console.log("There was a problem or request canceled")
        }
      }
      fetchResults()
    }
  }, [state.password.checkCount])

  useEffect(() => {
    if (state.email.checkCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesEmailExist", { email: state.email.value })
          dispatch({ type: "emailUniqueResults", value: response.data })
        } catch (e) {
          console.log("There was a problem or request canceled")
        }
      }
      fetchResults()
    }
  }, [state.email.checkCount])

  useEffect(() => {
    if (state.submitCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/register", { username: state.username.value, email: state.email.value, password: state.password.value, role: state.role.value }, { withCredentials: true })
          appDispatch({ type: "login", data: response.data })
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
    dispatch({ type: "emailImmediately", value: state.email.value })
    dispatch({ type: "emailAfterDelay", value: state.email.value, noRequest: true })
    dispatch({ type: "passwordImmediately", value: state.password.value })
    dispatch({ type: "passwordAfterDelay", value: state.password.value, noRequest: true })
    dispatch({ type: "roleImmediately", value: state.role.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <Page title="Creating New User">
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="form-body">
            <div className="username">
              <label className="form__label" htmlFor="firstName">
                Username{" "}
              </label>
              <input onChange={e => dispatch({ type: "usernameImmediately", value: e.target.value })} className="form__input" type="text" id="firstName" placeholder="Username" autoComplete="off" />
              <CSSTransition in={state.username.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.username.message}</div>
              </CSSTransition>
            </div>

            <div className="email">
              <label className="form__label" htmlFor="email">
                Email{" "}
              </label>
              <input onChange={e => dispatch({ type: "emailImmediately", value: e.target.value })} type="email" id="email" className="form__input" placeholder="Email" autoComplete="off" />
            </div>
            <div className="password">
              <label className="form__label" htmlFor="password">
                Password{" "}
              </label>
              <input onChange={e => dispatch({ type: "passwordImmediately", value: e.target.value })} className="form__input" type="password" id="password" placeholder="Password" autoComplete="off" />
              <CSSTransition in={state.password.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.password.message}</div>
              </CSSTransition>
            </div>
            <div className="role">
              <label className="form__label" htmlFor="role">
                Role{" "}
              </label>
              <input onChange={e => dispatch({ type: "roleHave", value: e.target.value })} className="form__input" type="role" id="role" placeholder="Role" autoComplete="off" />
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
