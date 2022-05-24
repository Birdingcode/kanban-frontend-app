import { Modal, Table } from "rsuite"
import React, { useState, useEffect, useContext } from "react"
import "rsuite/dist/rsuite.min.css"
import Axios from "axios"
import { useImmer, useImmerReducer } from "use-immer"
import DispatchContext from "../DispatchContext"
import axios from "axios"

function TaskModal(props) {
  //console.log(props.taskid)
  const [networkStatus, setNetworkStatus] = useState("pending")
  const [specificTask, setSpecificTask] = useImmer([])
  const [parseNotes, setParseNotes] = useImmer([])
  const [user, setUser] = useImmer([])
  const [plan, setPlan] = useImmer([])

  const appDispatch = useContext(DispatchContext)

  const initialState = {
    App_Acronym: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    Plan_name: {
      value: "",
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
    Task_owner: {
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
      case "planImmediately":
        draft.Plan_name.hasErrors = false
        draft.Plan_name.value = action.value
        if (draft.Plan_name.value.length <= 0) {
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
      case "taskOwnerImmediately":
        draft.Task_owner.hasErrors = false
        draft.Task_owner.value = action.value
        if (!draft.Task_owner.value) {
          draft.Task_owner.hasErrors = true
          draft.Task_owner.message = "Please inlcude a task owner"
        }
        if (!draft.Task_owner.hasErrors) {
          draft.Task_owner.checkCount++
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
        if (!draft.Plan_name.hasErrors) {
          draft.submitCount++
        }
        return
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initialState)

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await Axios.get("/userManagement", { withCredentials: true })
        //console.log(response.data)
        setUser(response.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchUsers()
  }, [])
  console.log(parseNotes)
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get("/getSpecificTask", { params: { Task_id: props.taskid }, withCredentials: true })
        const date = new Date(response.data[0].Task_createDate).toISOString().split("T")[0]
        //console.log(response.data)
        setSpecificTask(response.data)

        setParseNotes(JSON.parse(response.data[0].Task_notes))
        dispatch({ type: "acronymImmediately", value: response.data[0].App_Acronym })
        dispatch({ type: "createDateImmediately", value: date })
        setNetworkStatus("resolved")
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    async function fetchPlan() {
      try {
        const response = await Axios.get("/getSpecificPlan", { params: { App_Acronym: state.App_Acronym.value }, withCredentials: true })

        console.log(response.data)
        setPlan(response.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchPlan()
  }, [state.App_Acronym.value])

  async function changePlanName() {
    const response = await axios.post("/changeTaskPlanName", { Task_id: props.taskid, Plan_name: state.Plan_name.value }, { withCredentials: true })
    console.log(response.data)
  }
  async function changeDesc() {
    const response = await axios.post("/changeTaskDesc", { Task_id: props.taskid, Task_description: state.Task_description.value }, { withCredentials: true })
    console.log(response.data)
  }
  async function changeNotes() {
    const response = await axios.post("/changeTaskNotes", { Task_id: props.taskid, Task_notes: state.Task_notes.value, username: localStorage.getItem("username") }, { withCredentials: true })
    console.log(response.data)
  }
  async function changeOwner() {
    const response = await axios.post("/changeTaskOwner", { Task_id: props.taskid, Task_owner: state.Task_owner.value }, { withCredentials: true })
    console.log(response.data)
  }

  if (networkStatus === "resolved") {
    return (
      <div className="modal-container">
        {/* <Modal.Header>
          <Modal.Title>Modal Title</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <div className="modalContainer">
            <div className="left">
              <div className="form-modal">
                <div className="form-body-modal">
                  <div className="taskName">
                    <label className="form__label-modal" htmlFor="taskName">
                      Task Name{" "}
                    </label>
                    <input style={{ backgroundColor: "#ccc" }} value={specificTask[0].Task_name} className="form__input-modal" type="text" id="taskName" placeholder="Task Name" autoComplete="off" readOnly />
                  </div>
                  <div className="planName">
                    <label className="form__label-modal" htmlFor="planName">
                      Plan Name{" "}
                    </label>
                    <select defaultValue={specificTask[0].Plan_name} onChange={e => dispatch({ type: "planImmediately", value: e.target.value })}>
                      <option value="" disabled>
                        Select Plan ...
                      </option>
                      <option disabled>{specificTask[0].Plan_name}</option>

                      {plan.map((item, i) => (
                        <option key={item.Plan_name} value={item.Plan_name}>
                          {item.Plan_name}
                        </option>
                      ))}
                    </select>
                    <button onClick={() => changePlanName()} style={{ marginLeft: "79px" }}>
                      Edit Plan
                    </button>
                  </div>
                  <div className="appAcronym">
                    <label className="form__label-modal" htmlFor="appAcronym">
                      App Acronym{" "}
                    </label>
                    <input style={{ backgroundColor: "#ccc" }} value={specificTask[0].App_Acronym} type="taskCreator" id="appAcronym" className="form__input-modal" placeholder="App Acronym" autoComplete="off" readOnly />
                  </div>
                  <div>
                    <label className="form__label-modal" htmlFor="taskDesc">
                      Task Description{" "}
                    </label>
                    <input defaultValue={specificTask[0].Task_description} onChange={e => dispatch({ type: "taskDescImmediately", value: e.target.value })} type="text" id="taskDesc" className="form__input-modal" placeholder="Task Description" autoComplete="off" />
                    <button onClick={() => changeDesc()} style={{ marginLeft: "25px" }}>
                      Edit Desc
                    </button>
                  </div>
                  <div>
                    <label className="form__label-modal" htmlFor="taskNotes">
                      Task Notes{" "}
                    </label>
                    <input onChange={e => dispatch({ type: "taskNotesImmediately", value: e.target.value })} type="text" id="taskNotes" className="form__input-modal" placeholder="Task Notes" autoComplete="off" />
                    <button onClick={() => changeNotes()} style={{ marginLeft: "14px" }}>
                      Add Notes
                    </button>
                  </div>
                  <div className="taskCreator">
                    <label className="form__label-modal" htmlFor="taskCreator">
                      Task Creator{" "}
                    </label>
                    <input style={{ backgroundColor: "#ccc" }} value={specificTask[0].Task_creator} type="taskCreator" id="taskCreator" className="form__input-modal" placeholder="Task Creator" autoComplete="off" readOnly />
                  </div>
                  <div className="taskOwner">
                    <label className="form__label-modal" htmlFor="taskOwner">
                      Task Owner{" "}
                    </label>
                    <select defaultValue={specificTask[0].Task_owner} onChange={e => dispatch({ type: "taskOwnerImmediately", value: e.target.value })}>
                      <option value="" disabled>
                        Select Owner ...
                      </option>
                      <option>N/A</option>
                      {user.map((item, i) => (
                        <option key={item.username} value={item.username}>
                          {item.username}
                        </option>
                      ))}
                    </select>

                    <button onClick={() => changeOwner()} style={{ marginLeft: "69px" }}>
                      Edit Owner
                    </button>
                  </div>
                  <div className="createDate">
                    <label className="form__label-modal" htmlFor="createDate">
                      Create Date{" "}
                    </label>
                    <input style={{ backgroundColor: "#ccc" }} value={state.Task_createDate.value} className="form__input-modal" type="date" id="createDate" placeholder="Create Date" autoComplete="off" readOnly />
                  </div>
                </div>
              </div>
            </div>

            <div className="right">
              {" "}
              <Table
                virtualized
                wordWrap
                height={320}
                data={parseNotes}
                onRowClick={data => {
                  console.log(data)
                }}
              >
                <Table.Column flexGrow={1}>
                  <Table.HeaderCell>User</Table.HeaderCell>
                  <Table.Cell dataKey="username" />
                </Table.Column>

                <Table.Column flexGrow={2}>
                  <Table.HeaderCell>Notes</Table.HeaderCell>
                  <Table.Cell dataKey="Task_notes" />
                </Table.Column>

                <Table.Column flexGrow={3}>
                  <Table.HeaderCell>Timestamp</Table.HeaderCell>
                  <Table.Cell dataKey="currentDateTime" />
                </Table.Column>
              </Table>
            </div>
          </div>
        </Modal.Body>
      </div>
    )
  } else {
    return null
  }
}

export default TaskModal
