import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import { useImmer } from "use-immer"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { useNavigate, useParams } from "react-router-dom"

function EditPlan() {
  const { App_Acronym, Plan_name } = useParams()
  let navigate = useNavigate()
  const nodeRef = React.useRef(null)
  const appDispatch = useContext(DispatchContext)
  const [networkStatus, setNetworkStatus] = useState("pending")

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
    Plan_startDate: {
      value: "",
      hasErrors: false,
      message: "",
      checkCount: 0
    },
    Plan_endDate: {
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
      case "startDateImmediately":
        draft.Plan_startDate.hasErrors = false
        draft.Plan_startDate.value = action.value
        if (!draft.Plan_startDate.value) {
          draft.Plan_startDate.hasErrors = true
          draft.Plan_startDate.message = "Please include a Start Date"
        }
        if (!draft.Plan_startDate.hasErrors) {
          draft.Plan_startDate.checkCount++
        }
        return
      case "endDateImmediately":
        draft.Plan_endDate.hasErrors = false
        draft.Plan_endDate.value = action.value
        if (!draft.Plan_endDate.value) {
          draft.Plan_endDate.hasErrors = true
          draft.Plan_endDate.message = "Please include a End Date"
        }
        if (!draft.Plan_endDate.hasErrors) {
          draft.Plan_endDate.checkCount++
        }
        return
      case "submitForm":
        if (!draft.App_Acronym.hasErrors && !draft.Plan_name.hasErrors && !draft.Plan_startDate.hasErrors && !draft.Plan_endDate.hasErrors) {
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
    async function fetchPlan() {
      try {
        const response = await Axios.get("/getSpecificPlanE", { params: { App_Acronym: App_Acronym, Plan_name: Plan_name }, withCredentials: true })

        console.log(response.data)

        dispatch({ type: "planImmediately", value: response.data[0].Plan_name })
        dispatch({ type: "acronymImmediately", value: response.data[0].App_Acronym })
        dispatch({ type: "startDateImmediately", value: new Date(response.data[0].Plan_startDate).toISOString().split("T")[0] })
        dispatch({ type: "endDateImmediately", value: new Date(response.data[0].Plan_endDate).toISOString().split("T")[0] })
        setNetworkStatus("resolved")
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchPlan()
  }, [])

  useEffect(() => {
    if (state.submitCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/editPlan", { Plan_name: state.Plan_name.value, App_Acronym: state.App_Acronym.value, Plan_startDate: state.Plan_startDate.value, Plan_endDate: state.Plan_endDate.value }, { withCredentials: true })

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

    dispatch({ type: "acronymImmediately", value: state.App_Acronym.value })
    dispatch({ type: "startDateImmediately", value: state.Plan_startDate.value })
    dispatch({ type: "endDateImmediately", value: state.Plan_endDate.value })
    dispatch({ type: "submitForm" })
  }
  if (networkStatus === "resolved") {
    return (
      <Page title="Editing Plan">
        <form onSubmit={handleSubmit}>
          <div className="form">
            <div className="form-body">
              <div className="planName">
                <label className="form__label" htmlFor="planName">
                  Plan Name{" "}
                </label>
                <input style={{ backgroundColor: "#ccc" }} value={state.Plan_name.value} className="form__input" type="text" id="planName" placeholder="Plan Name" autoComplete="off" readOnly />
              </div>

              <div className="startDate">
                <label className="form__label" htmlFor="startDate">
                  Start Date{" "}
                </label>
                <input value={state.Plan_startDate.value} onChange={e => dispatch({ type: "startDateImmediately", value: e.target.value })} className="form__input" type="date" id="startDate" placeholder="Start Date" autoComplete="off" />
              </div>
              <div className="endDate">
                <label className="form__label" htmlFor="endDate">
                  End Date{" "}
                </label>
                <input value={state.Plan_endDate.value} onChange={e => dispatch({ type: "endDateImmediately", value: e.target.value })} className="form__input" type="date" id="endDate" placeholder="End Date" autoComplete="off" />
              </div>
              <div className="footer">
                <button type="submit" className="btn">
                  Edit Plan
                </button>
                <button onClick={() => navigate(`/project/${App_Acronym}`)} style={{ float: "right", padding: 5, borderRadius: 10, backgroundColor: "#e5e5e5" }}>
                  Back
                </button>
              </div>
            </div>
          </div>
        </form>
      </Page>
    )
  } else {
    return null
  }
}
export default EditPlan
