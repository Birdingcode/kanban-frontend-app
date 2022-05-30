import React, { useEffect, useContext } from "react"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { CSSTransition } from "react-transition-group"
import { useNavigate, useLocation } from "react-router-dom"

function ChangeEmail() {
  let navigate = useNavigate()
  const location = useLocation()
  const appDispatch = useContext(DispatchContext)
  const nodeRef = React.useRef(null)
  const initialState = {
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

  useEffect(() => {
    async function checkGroup() {
      try {
        const response = await Axios.post("/checkGroupAPM", { username: localStorage.getItem("username") }, { withCredentials: true })
        console.log(response.data)
        if (response.data !== "authAdmin") {
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
    }
  }, [state.submitCount])

  function handleSubmit(e) {
    e.preventDefault()
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
              <input style={{ backgroundColor: "#ccc" }} value={location.state.oldEmail} type="oldEmail" id="oldEmail" className="form__input" placeholder="Old Email" autoComplete="off" readOnly />
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
            <button onClick={() => navigate("/userManagement")} style={{ float: "right", padding: 5, borderRadius: 10, backgroundColor: "#e5e5e5" }}>
              Back
            </button>
          </div>
        </div>
      </form>
    </Page>
  )
}

export default ChangeEmail
