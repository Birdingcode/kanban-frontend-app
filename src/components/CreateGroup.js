import React, { useEffect, useContext } from "react"
import Page from "./Page"
import { useImmer } from "use-immer"
import DispatchContext from "../DispatchContext"
import { useImmerReducer } from "use-immer"
import Axios from "axios"
import { useNavigate } from "react-router-dom"
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
        const response = await Axios.post("/checkGroupAPM", { username: localStorage.getItem("username") }, { withCredentials: true })
        console.log(response.data)
        if (response.data !== "authAdmin") {
          navigate("/")
        }
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
        } catch (e) {
          console.log(e.response)
        }
      }
      fetchResults()
    }
  }, [state.submitCount])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "groupImmediately", value: e.target.groupName.value })
    dispatch({ type: "submitForm" })
  }

  function refreshPage() {
    window.location.reload()
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
              <input className="form__input" type="text" id="groupName" placeholder="Group Name" autoComplete="off" />
            </div>

            <div className="footer">
              <button onClick={() => refreshPage()} type="submit" className="btn">
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
