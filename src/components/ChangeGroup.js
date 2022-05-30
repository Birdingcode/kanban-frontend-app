import React, { useState, useEffect, useContext } from "react"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import { useImmerReducer, useImmer } from "use-immer"
import Axios from "axios"
import { useNavigate, useLocation } from "react-router-dom"

//MUI
import OutlinedInput from "@mui/material/OutlinedInput"
import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import ListItemText from "@mui/material/ListItemText"
import Select from "@mui/material/Select"
import Checkbox from "@mui/material/Checkbox"
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
}

// import Checkbox from "@mui/material/Checkbox"
// import TextField from "@mui/material/TextField"
// import Autocomplete from "@mui/material/Autocomplete"
// import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank"
// import CheckBoxIcon from "@mui/icons-material/CheckBox"

// const icon = <CheckBoxOutlineBlankIcon fontSize="small" />
// const checkedIcon = <CheckBoxIcon fontSize="small" />

function ChangeGroup() {
  const [groupApp, setGroupApp] = useImmer([])

  const [currGroup, setCurrGroup] = useImmer([])
  //console.log("Group App: " + groupApp)
  console.log("Group Curr: " + currGroup)

  let navigate = useNavigate()
  let location = useLocation()
  const appDispatch = useContext(DispatchContext)
  const [networkStatus, setNetworkStatus] = useState("pending")

  const handleChange = event => {
    const {
      target: { value }
    } = event
    setCurrGroup(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    )
  }
  const initialState = {
    submitCount: 0
  }

  function ourReducer(draft, action) {
    switch (action.type) {
      case "submitForm":
        draft.submitCount++

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
    async function fetchCurrGroup() {
      try {
        const response = await Axios.get("/getCurrGroup", { params: { username: location.state.username }, withCredentials: true })
        //console.log(response)
        let groupCurrArr = []

        {
          response.data.map((e, i) => {
            let elementConcat = ""
            elementConcat += e.role
            groupCurrArr.push(elementConcat)
          })
        }

        setCurrGroup(groupCurrArr)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchCurrGroup()
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
    if (state.submitCount) {
      async function fetchResults() {
        try {
          const response = await Axios.post("/changeGroup", { username: location.state.username, role: currGroup }, { withCredentials: true })
          if (response.data) {
            navigate("/userManagement")
          }
        } catch (e) {
          console.log(e.response)
        }
      }
      fetchResults()
    }
  }, [state.submitCount])

  function handleSubmit(e) {
    e.preventDefault()
    dispatch({ type: "submitForm" })
  }

  return (
    <Page title="Change Password">
      <form onSubmit={handleSubmit}>
        <div className="form">
          <div className="form-body">
            <div className="username">
              <label className="form__label" htmlFor="username">
                Username{" "}
              </label>
              <input style={{ backgroundColor: "#ccc" }} value={location.state.username} className="form__input" type="text" id="firstName" placeholder="Username" autoComplete="off" readOnly />
            </div>
            <div>
              <FormControl sx={{ m: 0, width: 381 }}>
                <InputLabel id="demo-multiple-checkbox-label">Group</InputLabel>
                <Select labelId="demo-multiple-checkbox-label" id="demo-multiple-checkbox" multiple value={currGroup} onChange={handleChange} input={<OutlinedInput label="Tag" />} renderValue={selected => selected.join(", ")} MenuProps={MenuProps}>
                  {groupApp.map(group => (
                    <MenuItem key={group} value={group}>
                      <Checkbox checked={currGroup.indexOf(group) > -1} />
                      <ListItemText primary={group} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          <div className="footer">
            <button type="submit" className="btn">
              Edit Group
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

export default ChangeGroup
