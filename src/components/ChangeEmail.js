import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { CSSTransition } from "react-transition-group"
import { useNavigate, useLocation } from "react-router-dom"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"

function ChangeEmail() {
  let navigate = useNavigate()
  const location = useLocation()
  const appDispatch = useContext(DispatchContext)
  const nodeRef = React.useRef(null)
  const initialState = {
    // oldEmail: {
    //   value: "",
    //   hasErrors: false,
    //   message: "",
    //   isUnique: false,
    //   checkCount: 0
    // },
    newEmail: {
      value: "",
      hasErrors: false,
      message: "",
      isUnique: false,
      checkCount: 0
    },
    cfmEmail: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    submitCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      // case "emailImmediately":
      //   draft.oldEmail.hasErrors = false
      //   draft.oldEmail.value = action.value
      //   return
      // case "emailAfterDelay":
      //   if (!/^\S+@\S+$/.test(draft.oldEmail.value)) {
      //     draft.oldEmail.hasErrors = true
      //     draft.oldEmail.message = "You must provide a valid email address"
      //   }
      //   if (!draft.oldEmail.hasErrors && !action.noRequest) {
      //     draft.oldEmail.checkCount++
      //   }
      //   return
      // case "emailUniqueResults":
      //   if (action.value == true) {
      //     draft.oldEmail.hasErrors = false
      //     draft.oldEmail.isUnique = false
      //   } else {
      //     draft.oldEmail.isUnique = true
      //     draft.oldEmail.hasErrors = true
      //     draft.oldEmail.message = "Email not found in database."
      //   }
      //   return
      case "newEmailImmediately":
        draft.newEmail.hasErrors = false
        draft.newEmail.value = action.value
        return
      case "newEmailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.newEmail.value)) {
          draft.newEmail.hasErrors = true
          draft.newEmail.message = "You must provide a valid Email address"
        }
        if (!draft.newEmail.hasErrors && !action.noRequest) {
          draft.newEmail.checkCount++
        }
        return
      case "newEmailUniqueResults":
        if (action.value == true) {
          draft.newEmail.hasErrors = true
          draft.newEmail.isUnique = false
          draft.newEmail.message = "Email already taken."
        } else {
          draft.newEmail.isUnique = true
          draft.newEmail.hasErrors = false
        }
        return
      case "emailMatch":
        draft.cfmEmail.value = action.value
        if (draft.cfmEmail.value != draft.newEmail.value) {
          draft.cfmEmail.hasErrors = true
          draft.cfmEmail.message = "Email does not match."
        } else {
          draft.cfmEmail.hasErrors = false
        }
        return
      case "submitForm":
        if (!draft.newEmail.hasErrors && draft.newEmail.isUnique && !draft.cfmEmail.hasErrors) {
          draft.submitCount++
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    if (state.newEmail.value) {
      const delay = setTimeout(() => dispatch({ type: "newEmailAfterDelay" }), 800)
      return () => clearTimeout(delay)
    }
  }, [state.newEmail.value])

  // useEffect(() => {
  //   if (state.oldEmail.value) {
  //     const delay = setTimeout(() => dispatch({ type: "emailAfterDelay" }), 800)
  //     return () => clearTimeout(delay)
  //   }
  // }, [state.oldEmail.value])

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

  // useEffect(() => {
  //   if (state.oldEmail.checkCount) {
  //     async function fetchResults() {
  //       try {
  //         const response = await Axios.post("/doesEmailExist", { oldEmail: state.oldEmail.value }, { withCredentials: true })
  //         dispatch({ type: "emailUniqueResults", value: response.data })
  //       } catch (e) {
  //         console.log("There was a problem or request canceled")
  //       }
  //     }
  //     fetchResults()
  //   }
  // }, [state.oldEmail.checkCount])

  useEffect(() => {
    if (state.newEmail.checkCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/doesNewEmailExist", { newEmail: state.newEmail.value }, { withCredentials: true })
          dispatch({ type: "newEmailUniqueResults", value: response.data })
        } catch (e) {
          console.log("There was a problem or request canceled")
        }
      }
      fetchResults()
    }
  }, [state.newEmail.checkCount])

  useEffect(() => {
    if (state.submitCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/changeEmail", { oldEmail: location.state.oldEmail, newEmail: state.newEmail.value, cfmEmail: state.cfmEmail.value }, { withCredentials: true })
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
    //dispatch({ type: "emailImmediately", value: state.oldEmail.value })
    //dispatch({ type: "emailAfterDelay", value: state.oldEmail.value, noRequest: true })
    dispatch({ type: "newEmailImmediately", value: state.newEmail.value })
    dispatch({ type: "newEmailAfterDelay", value: state.newEmail.value, noRequest: true })
    dispatch({ type: "submitForm" })
  }

  return (
    <Page title="Change Email">
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="form-body">
            <div className="oldEmail">
              <label className="form__label" htmlFor="oldEmail">
                Old Email{" "}
              </label>
              <input value={location.state.oldEmail} type="oldEmail" id="oldEmail" className="form__input" placeholder="Old Email" autoComplete="off" readOnly />
            </div>
            <div className="newEmail">
              <label className="form__label" htmlFor="newEmail">
                New Email{" "}
              </label>
              <input onChange={e => dispatch({ type: "newEmailImmediately", value: e.target.value })} className="form__input" type="newEmail" id="newEmail" placeholder="New Email" autoComplete="off" />
              <CSSTransition nodeRef={nodeRef} in={state.newEmail.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.newEmail.message}</div>
              </CSSTransition>
            </div>
            <div className="cfmEmail">
              <label className="form__label" htmlFor="cfmEmail">
                Confirm Email{" "}
              </label>
              <input onChange={e => dispatch({ type: "emailMatch", value: e.target.value })} className="form__input" type="cfmEmail" id="cfmEmail" placeholder="Confirm Email" autoComplete="off" />
              <CSSTransition nodeRef={nodeRef} in={state.cfmEmail.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                <div className="alert alert-danger small liveValidateMessage">{state.cfmEmail.message}</div>
              </CSSTransition>
            </div>
          </div>
          <div className="footer">
            <button type="submit" className="btn">
              Change Email
            </button>
          </div>
        </div>
      </form>
    </Page>
  )
}

export default ChangeEmail
