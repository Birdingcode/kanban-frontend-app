import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import { useImmerReducer, useImmer } from "use-immer"
import Axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

function CreateTask() {
  const { App_Acronym } = useParams()
  let navigate = useNavigate()
  const [plan, setPlan] = useImmer([])
  const [user, setUser] = useImmer([])

  const initialState = {
    Task_name: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    Plan_name: {
      value: null,
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    Task_description: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    Task_notes: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    Task_createDate: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    submitCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "taskImmediately":
        draft.Task_name.hasErrors = false
        draft.Task_name.value = action.value
        if (draft.Task_name.value.length < 3) {
          draft.Task_name.hasErrors = true
          draft.Task_name.message = "Please include a task name"
        }
        if (!draft.Task_name.hasErrors) {
          draft.Task_name.checkCount++
        }
        return
      case "planImmediately":
        draft.Plan_name.hasErrors = false
        draft.Plan_name.value = action.value
        if (!draft.Plan_name) {
          console.log("planImmediately")
          draft.Plan_name.hasErrors = true
          draft.Plan_name.message = "Please include a plan name"
        }
        if (!draft.Plan_name.hasErrors) {
          draft.Plan_name.checkCount++
        }
        return
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
      case "taskDescImmediately":
        draft.Task_description.hasErrors = false
        draft.Task_description.value = action.value
        if (draft.Task_description.value.length <= 0) {
          draft.Task_description.hasErrors = true
          draft.Task_description.message = "Please enter a description"
        }
        if (!draft.Task_description.hasErrors) {
          draft.Task_description.checkCount++
        }
        return
      case "taskNotesImmediately":
        draft.Task_notes.hasErrors = false
        draft.Task_notes.value = action.value
        if (draft.Task_notes.value.length <= 0) {
          draft.Task_notes.hasErrors = true
          draft.Task_notes.message = "Please enter a note"
        }
        if (!draft.Task_notes.hasErrors) {
          draft.Task_notes.checkCount++
        }
        return
      case "createDateImmediately":
        draft.Task_createDate.hasErrors = false
        draft.Task_createDate.value = action.value
        if (!draft.Task_createDate.value) {
          draft.Task_createDate.hasErrors = true
          draft.Task_createDate.message = "Please include a Create Date"
        }
        if (!draft.Task_createDate.hasErrors) {
          draft.Task_createDate.checkCount++
        }
        return
      case "submitForm":
        console.log("Task Name", draft.Task_name.value)

        console.log("Plan Name", draft.Plan_name.value)
        console.log(draft.Plan_name.hasErrors)
        if (!draft.Task_name.hasErrors && !draft.Plan_name.hasErrors && !draft.Task_description.hasErrors && !draft.Task_notes.hasErrors && !draft.Task_createDate.hasErrors) {
          draft.submitCount++
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)
  const date = new Date().toISOString().split("T")[0]

  useEffect(() => {
    async function fetchCreate() {
      try {
        const response = await Axios.post("/checkCreate", { username: localStorage.getItem("username") }, { params: { App_Acronym: App_Acronym }, withCredentials: true })
        if (!response.data) {
          navigate("/")
        }
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchCreate()
  }, [])

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await Axios.get("/getSpecificPlan", { params: { App_Acronym: App_Acronym }, withCredentials: true })
        console.log(response.data)
        setPlan(response.data)
        //setProfileData(response.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchPlan()
  }, [])

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await Axios.get("/userManagement", { withCredentials: true })
        console.log(response.data)
        setUser(response.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchUsers()
  }, [])

  useEffect(() => {
    if (state.submitCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/createTask", { username: localStorage.getItem("username"), Task_name: state.Task_name.value, Plan_name: state.Plan_name.value, Task_description: state.Task_description.value, Task_notes: state.Task_notes.value, Task_creator: localStorage.getItem("username"), Task_createDate: date }, { params: { App_Acronym: App_Acronym }, withCredentials: true })

          console.log(response)
          navigate(`/project/${App_Acronym}`)
        } catch (e) {
          console.log(e.response)
        }
      }
      fetchResults()
    }
  }, [state.submitCount])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "taskImmediately", value: state.Task_name.value })
    dispatch({ type: "planImmediately", value: state.Plan_name.value })
    dispatch({ type: "taskDescImmediately", value: state.Task_description.value })
    dispatch({ type: "taskNotesImmediately", value: state.Task_notes.value })
    dispatch({ type: "submitForm" })
  }

  return (
    <Page title="Creating New Application">
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="form-body">
            <div className="taskName">
              <label className="form__label" htmlFor="taskName">
                Task Name{" "}
              </label>
              <input onChange={e => dispatch({ type: "taskImmediately", value: e.target.value })} className="form__input" type="text" id="taskName" placeholder="Task Name" autoComplete="off" />
            </div>
            <div className="planName">
              <label className="form__label" htmlFor="planName">
                Plan Name{" "}
              </label>
              <select
                onChange={e => {
                  console.log(e.target.value), dispatch({ type: "planImmediately", value: e.target.value })
                }}
              >
                <option value={null}>Select Plan ...</option>
                {plan.map((item, i) => (
                  <option key={item.Plan_name} value={item.Plan_name}>
                    {item.Plan_name}
                  </option>
                ))}
              </select>
            </div>
            <div className="appAcronym">
              <label className="form__label" htmlFor="appAcronym">
                App Acronym{" "}
              </label>
              <input style={{ backgroundColor: "#ccc" }} value={App_Acronym} type="taskCreator" id="appAcronym" className="form__input" placeholder="App Acronym" autoComplete="off" readOnly />
            </div>
            <div className="taskDesc">
              <label className="form__label_desc" htmlFor="taskDesc">
                Task Description{" "}
              </label>
              <textarea cols="30" rows="3" onChange={e => dispatch({ type: "taskDescImmediately", value: e.target.value })} id="taskDesc" className="form__input" placeholder="Task Description" autoComplete="off" />
            </div>
            <div className="taskNotes">
              <label className="form__label_desc" htmlFor="taskNotes">
                Task Notes{" "}
              </label>
              <textarea cols="30" rows="3" onChange={e => dispatch({ type: "taskNotesImmediately", value: e.target.value })} id="taskNotes" className="form__input" placeholder="Task Notes" autoComplete="off" />
            </div>
            <div className="taskCreator">
              <label className="form__label" htmlFor="taskCreator">
                Task Creator{" "}
              </label>
              <input style={{ backgroundColor: "#ccc" }} value={localStorage.getItem("username")} type="taskCreator" id="taskCreator" className="form__input" placeholder="Task Creator" autoComplete="off" readOnly />
            </div>
            <div className="createDate">
              <label className="form__label" htmlFor="createDate">
                Create Date{" "}
              </label>
              <input style={{ backgroundColor: "#ccc" }} value={date} className="form__input" type="date" id="createDate" placeholder="Create Date" autoComplete="off" readOnly />
            </div>
          </div>
          <div className="footer">
            <button type="submit" className="btn">
              Create New Task
            </button>
            <button onClick={() => navigate(`/project/${App_Acronym}`)} style={{ float: "right", padding: 5, borderRadius: 10, backgroundColor: "#e5e5e5" }}>
              Back
            </button>
          </div>
        </div>
      </form>
    </Page>
  )
}
export default CreateTask
