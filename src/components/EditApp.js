import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import { useImmer, useImmerReducer } from "use-immer"
import Axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

import { CSSTransition } from "react-transition-group"

function EditApp() {
  const { App_Acronym } = useParams()
  let navigate = useNavigate()
  const nodeRef = React.useRef(null)
  const appDispatch = useContext(DispatchContext)
  const [networkStatus, setNetworkStatus] = useState("pending")
  const [groupApp, setGroupApp] = useImmer([])

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

      case "permitCreate":
        draft.App_permit_Create.value = action.value
        draft.App_permit_Create.hasErrors = false
        if (!draft.App_permit_Create) {
          draft.App_permit_Create.hasErrors = true
          draft.App_permit_Create.message = "Please include necessary permissions"
        }
        return
      case "submitForm":
        if (!draft.App_Description.hasErrors && !draft.App_startDate.hasErrors && !draft.App_endDate.hasErrors && !draft.App_permit_Open.hasErrors && !draft.App_permit_toDoList.hasErrors && !draft.App_permit_Doing.hasErrors && !draft.App_permit_Done.hasErrors && !draft.App_permit_Create.hasErrors) {
          draft.submitCount++
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    async function checkGroup() {
      try {
        const response = await Axios.post("/checkGroupAPM", { username: localStorage.getItem("username") }, { withCredentials: true })
        console.log(response.data)
        if (response.data === "authPM" || response.data === "authAdmin") {
          setNetworkStatus("resolved")
        } else {
          navigate("/")
        }
      } catch (e) {
        console.log(e)
      }
    }
    checkGroup()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get("/getGroupApp", { withCredentials: true })

        let groupAppArr = []

        {
          response.data.map((e, i) => {
            let elementConcat = ""
            elementConcat += e.role
            groupAppArr.push(elementConcat)
          })
        }

        setGroupApp(groupAppArr)
        setNetworkStatus("resolved")
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get("/getSpecificApp", { params: { App_Acronym: App_Acronym }, withCredentials: true })
        dispatch({ type: "appDescImmediately", value: response.data[0].App_Description })
        dispatch({ type: "startDateImmediately", value: new Date(response.data[0].App_startDate).toISOString().split("T")[0] })
        dispatch({ type: "endDateImmediately", value: new Date(response.data[0].App_endDate).toISOString().split("T")[0] })
        dispatch({ type: "permitOpen", value: response.data[0].App_permit_Open })
        dispatch({ type: "permitToDo", value: response.data[0].App_permit_toDoList })
        dispatch({ type: "permitDoing", value: response.data[0].App_permit_Doing })
        dispatch({ type: "permitDone", value: response.data[0].App_permit_Done })
        dispatch({ type: "permitCreate", value: response.data[0].App_permit_Create })
        setNetworkStatus("resolved")
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (state.submitCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/editApp", { App_Acronym: App_Acronym, App_Description: state.App_Description.value, App_startDate: state.App_startDate.value, App_endDate: state.App_endDate.value, App_permit_Open: state.App_permit_Open.value, App_permit_toDoList: state.App_permit_toDoList.value, App_permit_Doing: state.App_permit_Doing.value, App_permit_Done: state.App_permit_Done.value, App_permit_Create: state.App_permit_Create.value }, { withCredentials: true })

          console.log(response)
          navigate("/")
        } catch (e) {
          console.log(e.response)
        }
      }
      fetchResults()
    }
  }, [state.submitCount])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "startDateImmediately", value: state.App_startDate.value })
    dispatch({ type: "endDateImmediately", value: state.App_endDate.value })
    dispatch({ type: "permitOpen", value: state.App_permit_Open.value })
    dispatch({ type: "permitToDo", value: state.App_permit_toDoList.value })
    dispatch({ type: "permitDoing", value: state.App_permit_Doing.value })
    dispatch({ type: "permitDone", value: state.App_permit_Done.value })
    dispatch({ type: "permitCreate", value: state.App_permit_Create.value })
    dispatch({ type: "submitForm" })
  }
  if (networkStatus === "resolved") {
    return (
      <Page title="Creating New Application">
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="form-body">
              <div className="appAcronym">
                <label className="form__label" htmlFor="appAcronym">
                  App Acronym{" "}
                </label>
                <input style={{ backgroundColor: "#ccc" }} value={App_Acronym} className="form__input" type="text" id="appAcronym" placeholder="Plan Name" autoComplete="off" readOnly />
              </div>
              <div className="appDesc">
                <label className="form__label" htmlFor="appDesc">
                  App Description{" "}
                </label>
                <input value={state.App_Description.value} onChange={e => dispatch({ type: "appDescImmediately", value: e.target.value })} type="text" id="appDesc" className="form__input" placeholder="App Description" autoComplete="off" />
                <CSSTransition nodeRef={nodeRef} in={state.App_Description.hasErrors} timeout={330} classNames="liveValidateMessage" unmountOnExit>
                  <div className="alert alert-danger small liveValidateMessage">{state.App_Description.message}</div>
                </CSSTransition>
              </div>

              <div className="startDate">
                <label className="form__label" htmlFor="startDate">
                  Start Date{" "}
                </label>
                <input value={state.App_startDate.value} onChange={e => dispatch({ type: "startDateImmediately", value: e.target.value })} className="form__input" type="date" id="startDate" placeholder="Start Date" autoComplete="off" />
              </div>
              <div className="endDate">
                <label className="form__label" htmlFor="endDate">
                  End Date{" "}
                </label>
                <input value={state.App_endDate.value} onChange={e => dispatch({ type: "endDateImmediately", value: e.target.value })} className="form__input" type="date" id="endDate" placeholder="End Date" autoComplete="off" />
              </div>

              <div className="permitOpen">
                <label className="form__label" htmlFor="permitOpen">
                  Permit Open{" "}
                </label>
                <select value={state.App_permit_Open.value} onChange={e => dispatch({ type: "permitOpen", value: e.target.value })}>
                  {groupApp.map((item, i) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="permitToDo">
                <label className="form__label" htmlFor="permitToDo">
                  Permit ToDo{" "}
                </label>
                <select value={state.App_permit_toDoList.value} onChange={e => dispatch({ type: "permitToDo", value: e.target.value })}>
                  {groupApp.map((item, i) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="permitDoing">
                <label className="form__label" htmlFor="permitDoing">
                  Permit Doing{" "}
                </label>
                <select value={state.App_permit_Doing.value} onChange={e => dispatch({ type: "permitDoing", value: e.target.value })}>
                  {groupApp.map((item, i) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="permitDone">
                <label className="form__label" htmlFor="permitDone">
                  Permit Done{" "}
                </label>
                <select value={state.App_permit_Done.value} onChange={e => dispatch({ type: "permitDone", value: e.target.value })}>
                  {groupApp.map((item, i) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="permitCreate">
                <label className="form__label" htmlFor="permitCreate">
                  Permit Create{" "}
                </label>
                <select value={state.App_permit_Create.value} onChange={e => dispatch({ type: "permitCreate", value: e.target.value })}>
                  {groupApp.map((item, i) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="footer">
              <button type="submit" className="btn">
                Edit Application
              </button>
            </div>
          </div>
        </form>
      </Page>
    )
  } else {
    return null
  }
}
export default EditApp
