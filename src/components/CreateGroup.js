import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import { useImmer } from "use-immer"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"
import { CSSTransition } from "react-transition-group"

function CreateGroup() {
  const [app, setApp] = useImmer([])
  let navigate = useNavigate()
  const nodeRef = React.useRef(null)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    role: {
      value: "",
      hasErrors: false,
      message: ""
    },
    submitCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "groupImmediately":
        draft.role.hasErrors = false
        draft.role.value = action.value
        if (draft.role.value.length <= 0) {
          draft.role.hasErrors = true
          draft.role.message = "Please include a group name"
        }
      case "submitForm":
        if (!draft.role.hasErrors) {
          draft.submitCount++
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

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
    if (state.submitCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/createGroup", { role: state.role.value }, { withCredentials: true })

          console.log(response)
          //appDispatch({ type: "login", data: response.data })
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
    dispatch({ type: "groupImmediately", value: state.role.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <Page title="Creating Group">
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="form-body">
            <div className="planName">
              <label className="form__label" htmlFor="groupName">
                Group Name{" "}
              </label>
              <input onChange={e => dispatch({ type: "groupImmediately", value: e.target.value })} className="form__input" type="text" id="groupName" placeholder="Group Name" autoComplete="off" />
            </div>

            <div className="footer">
              <button type="submit" className="btn">
                Create Group
              </button>
            </div>
          </div>
        </div>
      </form>
    </Page>
  )
}
export default CreateGroup
