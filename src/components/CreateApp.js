import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"
import { CSSTransition } from "react-transition-group"

function CreateApp() {
  // States htmlFor registration
  let navigate = useNavigate()
  const nodeRef = React.useRef(null)
  const appDispatch = useContext(DispatchContext)

  const initialState = {
    App_Acronym: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    App_Description: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    App_startDate: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    App_endDate: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    App_permit_Open: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    App_permit_toDoList: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    App_permit_Doing: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    App_permit_Done: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    App_permit_Close: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    App_permit_Create: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    submitCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "acronymImmediately":
        draft.App_Acronym.hasErrors = false
        draft.App_Acronym.value = action.value
        if (draft.App_Acronym.value.length < 3) {
          draft.App_Acronym.hasErrors = true
          draft.App_Acronym.message = "Acronym must be 3 characters"
        }
        if (!draft.App_Acronym.hasErrors) {
          draft.App_Acronym.checkCount++
        }
        return
      case "appDescImmediately":
        draft.App_Description.hasErrors = false
        draft.App_Description.value = action.value
        if (draft.App_Description.value.length <= 0) {
          draft.App_Description.hasErrors = true
          draft.App_Description.message = "Please enter a description"
        }
        if (!draft.App_Description.hasErrors) {
          draft.App_Description.checkCount++
        }
        return
      case "startDateImmediately":
        draft.App_startDate.hasErrors = false
        draft.App_startDate.value = action.value
        if (!draft.App_startDate.value) {
          draft.App_startDate.hasErrors = true
          draft.App_startDate.message = "Please include a Start Date"
        }
        if (!draft.App_startDate.hasErrors) {
          draft.App_startDate.checkCount++
        }
        return
      case "endDateImmediately":
        draft.App_endDate.hasErrors = false
        draft.App_endDate.value = action.value
        if (!draft.App_endDate.value) {
          draft.App_endDate.hasErrors = true
          draft.App_endDate.message = "Please include a End Date"
        }
        if (!draft.App_endDate.hasErrors) {
          draft.App_endDate.checkCount++
        }
        return
      case "permitOpen":
        draft.App_permit_Open.value = action.value
        draft.App_permit_Open.hasErrors = false
        if (!draft.App_permit_Open) {
          draft.App_permit_Open.hasErrors = true
          draft.App_permit_Open.message = "Please include necessary permissions"
        }
        return
      case "permitToDo":
        draft.App_permit_toDoList.value = action.value
        draft.App_permit_toDoList.hasErrors = false
        if (!draft.App_permit_toDoList) {
          draft.App_permit_toDoList.hasErrors = true
          draft.App_permit_toDoList.message = "Please include necessary permissions"
        }
        return
      case "permitDoing":
        draft.App_permit_Doing.value = action.value
        draft.App_permit_Doing.hasErrors = false
        if (!draft.App_permit_Doing) {
          draft.App_permit_Doing.hasErrors = true
          draft.App_permit_Doing.message = "Please include necessary permissions"
        }
        return
      case "permitDone":
        draft.App_permit_Done.value = action.value
        draft.App_permit_Done.hasErrors = false
        if (!draft.App_permit_Done) {
          draft.App_permit_Done.hasErrors = true
          draft.App_permit_Done.message = "Please include necessary permissions"
        }
        return
      case "permitClose":
        draft.App_permit_Close.value = action.value
        draft.App_permit_Close.hasErrors = false
        if (!draft.App_permit_Close) {
          draft.App_permit_Close.hasErrors = true
          draft.App_permit_Close.message = "Please include necessary permissions"
        }
        return
      case "permitCreate":
        draft.App_permit_Create.value = action.value
        draft.App_permit_Create.hasErrors = false
        if (!draft.App_permit_Create) {
          draft.App_permit_Create.hasErrors = true
          draft.App_permit_Create.message = "Please include necessary permissions"
        }
        return
      case "submitForm":
        if (!draft.App_Acronym.hasErrors && !draft.App_Description.hasErrors && !draft.App_startDate.hasErrors && !draft.App_endDate.hasErrors && !draft.App_permit_Open.hasErrors && !draft.App_permit_toDoList.hasErrors && !draft.App_permit_Doing.hasErrors && !draft.App_permit_Done.hasErrors && !draft.App_permit_Close.hasErrors && !draft.App_permit_Create.hasErrors) {
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
          const response = await Axios.post("/createApp", { App_Acronym: state.App_Acronym.value, App_Description: state.App_Description.value, App_startDate: state.App_startDate.value, App_endDate: state.App_endDate.value, App_permit_Open: state.App_permit_Open.value, App_permit_toDoList: state.App_permit_toDoList.value, App_permit_Doing: state.App_permit_Doing.value, App_permit_Done: state.App_permit_Done.value, App_permit_Close: state.App_permit_Close.value, App_permit_Create: state.App_permit_Create.value }, { withCredentials: true })

          console.log(response)
          //appDispatch({ type: "login", data: response.data })
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
    dispatch({ type: "acronymImmediately", value: state.App_Acronym.value })
    dispatch({ type: "appDescImmediately", value: state.App_Description.value })
    dispatch({ type: "startDateImmediately", value: state.App_startDate.value })
    dispatch({ type: "endDateImmediately", value: state.App_endDate.value })
    dispatch({ type: "permitOpen", value: state.App_permit_Open.value })
    dispatch({ type: "permitToDo", value: state.App_permit_toDoList.value })
    dispatch({ type: "permitDoing", value: state.App_permit_Doing.value })
    dispatch({ type: "permitDone", value: state.App_permit_Done.value })
    dispatch({ type: "permitClose", value: state.App_permit_Close.value })
    dispatch({ type: "permitCreate", value: state.App_permit_Create.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <Page title="Creating New Application">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Kanban App</Navbar.Brand>
        </Container>
      </Navbar>
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="form-body">
            <div className="appAcronym">
              <label className="form__label" htmlFor="appAcronym">
                App Acronym{" "}
              </label>
              <input onChange={e => dispatch({ type: "acronymImmediately", value: e.target.value })} className="form__input" type="text" id="appAcronym" placeholder="App Acronym" autoComplete="off" />
            </div>

            <div className="appDesc">
              <label className="form__label" htmlFor="appDesc">
                App Description{" "}
              </label>
              <input onChange={e => dispatch({ type: "appDescImmediately", value: e.target.value })} type="text" id="appDesc" className="form__input" placeholder="App Description" autoComplete="off" />
            </div>

            <div className="startDate">
              <label className="form__label" htmlFor="startDate">
                Start Date{" "}
              </label>
              <input onChange={e => dispatch({ type: "startDateImmediately", value: e.target.value })} className="form__input" type="date" id="startDate" placeholder="Start Date" autoComplete="off" />
            </div>
            <div className="endDate">
              <label className="form__label" htmlFor="endDate">
                End Date{" "}
              </label>
              <input onChange={e => dispatch({ type: "endDateImmediately", value: e.target.value })} className="form__input" type="date" id="endDate" placeholder="End Date" autoComplete="off" />
            </div>

            <div className="permitOpen">
              <label className="form__label" htmlFor="permitOpen">
                Permit Open{" "}
              </label>
              <select defaultValue="" onChange={e => dispatch({ type: "permitOpen", value: e.target.value })}>
                <option value="" disabled>
                  Grant permission ...
                </option>
                <option value="Superadmin">Superadmin</option>
                <option value="Member">Member</option>
                <option value="Lead">Lead</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="permitToDo">
              <label className="form__label" htmlFor="permitToDo">
                Permit ToDo{" "}
              </label>
              <select defaultValue="" onChange={e => dispatch({ type: "permitToDo", value: e.target.value })}>
                <option value="" disabled>
                  Grant permission ...
                </option>
                <option value="Superadmin">Superadmin</option>
                <option value="Member">Member</option>
                <option value="Lead">Lead</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="permitDoing">
              <label className="form__label" htmlFor="permitDoing">
                Permit Doing{" "}
              </label>
              <select defaultValue="" onChange={e => dispatch({ type: "permitDoing", value: e.target.value })}>
                <option value="" disabled>
                  Grant permission ...
                </option>
                <option value="Superadmin">Superadmin</option>
                <option value="Member">Member</option>
                <option value="Lead">Lead</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="permitDone">
              <label className="form__label" htmlFor="permitDone">
                Permit Done{" "}
              </label>
              <select defaultValue="" onChange={e => dispatch({ type: "permitDone", value: e.target.value })}>
                <option value="" disabled>
                  Grant permission ...
                </option>
                <option value="Superadmin">Superadmin</option>
                <option value="Member">Member</option>
                <option value="Lead">Lead</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="permitClose">
              <label className="form__label" htmlFor="permitClose">
                Permit Close{" "}
              </label>
              <select defaultValue="" onChange={e => dispatch({ type: "permitClose", value: e.target.value })}>
                <option value="" disabled>
                  Grant permission ...
                </option>
                <option value="Superadmin">Superadmin</option>
                <option value="Member">Member</option>
                <option value="Lead">Lead</option>
                <option value="PM">PM</option>
              </select>
            </div>
            <div className="permitCreate">
              <label className="form__label" htmlFor="permitCreate">
                Permit Create{" "}
              </label>
              <select defaultValue="" onChange={e => dispatch({ type: "permitCreate", value: e.target.value })}>
                <option value="" disabled>
                  Grant permission ...
                </option>
                <option value="Superadmin">Superadmin</option>
                <option value="Member">Member</option>
                <option value="Lead">Lead</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          <div className="footer">
            <button type="submit" className="btn">
              Create New Application
            </button>
          </div>
        </div>
      </form>
    </Page>
  )
}
export default CreateApp
