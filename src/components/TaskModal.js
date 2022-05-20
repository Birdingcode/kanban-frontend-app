import { Modal, Button } from "rsuite"
import React, { useState, useEffect } from "react"
import "rsuite/dist/rsuite.min.css"
import Axios from "axios"
import { useImmer } from "use-immer"

function TaskModal(props) {
  //console.log(props.taskid)
  const [networkStatus, setNetworkStatus] = useState("pending")
  const [specificTask, setSpecificTask] = useImmer([])
  const [user, setUser] = useImmer([])
  const [plan, setPlan] = useImmer([])
  console.log(specificTask)

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
    async function fetchPlan() {
      try {
        const response = await Axios.get("/getSpecificPlan", { params: { App_Acronym: specificTask[0].App_Acronym }, withCredentials: true })

        console.log(response.data)
        setPlan(response.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchPlan()
  }, [])

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await Axios.get("/getSpecificTask", { params: { Task_id: props.taskid }, withCredentials: true })

        console.log(response.data)
        setSpecificTask(response.data)
        setNetworkStatus("resolved")
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchData()
  }, [])
  if (networkStatus === "resolved") {
    return (
      <div className="modal-container">
        {/* <Modal.Header>
        <Modal.Title>Modal Title</Modal.Title>
      </Modal.Header> */}
        <div className="header">Header Here</div>

        <Modal.Body>
          <div className="modalContainer">
            <div className="left">
              <div className="form">
                <div className="form-body">
                  <div className="taskName">
                    <label className="form__label" htmlFor="taskName">
                      Task Name{" "}
                    </label>
                    <input style={{ backgroundColor: "#ccc" }} value={specificTask[0].Task_name} className="form__input" type="text" id="taskName" placeholder="Task Name" autoComplete="off" readOnly />
                  </div>
                  <div className="planName">
                    <label className="form__label" htmlFor="planName">
                      Plan Name{" "}
                    </label>
                    <select defaultValue="" onChange={e => dispatch({ type: "planImmediately", value: e.target.value })}>
                      <option value="" disabled>
                        Select Plan ...
                      </option>
                      <option>N/A</option>
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
                    <input style={{ backgroundColor: "#ccc" }} value={specificTask[0].App_Acronym} type="taskCreator" id="appAcronym" className="form__input" placeholder="App Acronym" autoComplete="off" readOnly />
                  </div>
                  <div className="taskDesc">
                    <label className="form__label" htmlFor="taskDesc">
                      Task Description{" "}
                    </label>
                    <input onChange={e => dispatch({ type: "taskDescImmediately", value: e.target.value })} type="text" id="taskDesc" className="form__input" placeholder="Task Description" autoComplete="off" />
                  </div>
                  <div className="taskNotes">
                    <label className="form__label" htmlFor="taskNotes">
                      Task Notes{" "}
                    </label>
                    <input onChange={e => dispatch({ type: "taskNotesImmediately", value: e.target.value })} type="text" id="taskNotes" className="form__input" placeholder="Task Notes" autoComplete="off" />
                  </div>
                  <div className="taskCreator">
                    <label className="form__label" htmlFor="taskCreator">
                      Task Creator{" "}
                    </label>
                    <input style={{ backgroundColor: "#ccc" }} value={specificTask[0].Task_creator} type="taskCreator" id="taskCreator" className="form__input" placeholder="Task Creator" autoComplete="off" readOnly />
                  </div>
                  <div className="taskOwner">
                    <label className="form__label" htmlFor="taskOwner">
                      Task Owner{" "}
                    </label>
                    <select defaultValue="" onChange={e => dispatch({ type: "taskOwnerImmediately", value: e.target.value })}>
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
                  </div>
                  <div className="createDate">
                    <label className="form__label" htmlFor="createDate">
                      Create Date{" "}
                    </label>
                    <input style={{ backgroundColor: "#ccc" }} value={specificTask[0].Task_createDate} className="form__input" type="date" id="createDate" placeholder="Create Date" autoComplete="off" readOnly />
                  </div>
                </div>
              </div>
            </div>

            <div className="right"></div>
          </div>
        </Modal.Body>
      </div>
    )
  } else {
    return null
  }
}

export default TaskModal
