import React, { useEffect } from "react"
import { useImmer } from "use-immer"
import { Link, useNavigate } from "react-router-dom"
import Axios from "axios"
import { Table } from "react-bootstrap"
import Page from "./Page"

function UserManagement() {
  const [state, setState] = useImmer([])
  let navigate = useNavigate()
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
    //const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.get("/userManagement", { withCredentials: true })
        console.log(response.data)
        setState(response.data)
        //setProfileData(response.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchData()
    // return () => {
    //   ourRequest.cancel()
    // }
  }, [])

  const changeStatus = async (e, username) => {
    e.preventDefault()
    try {
      console.log(username)
      const response = await Axios.post("/changeStatus", { username: username }, { withCredentials: true })
      console.log(response.data)
      if (response.data) {
        setState(response.data)
      }
      //setState(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const changeEmail = async (e, email) => {
    e.preventDefault()
    try {
      console.log(email)
      navigate("/userManagement/changeEmail", { state: { oldEmail: email } }, { withCredentials: true })

      //setState(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  const changePassword = async (e, username) => {
    e.preventDefault()
    try {
      console.log(username)
      navigate("/userManagement/changePassword", { state: { username: username } }, { withCredentials: true })

      //setState(response.data)
    } catch (e) {
      console.log(e)
    }
  }

  return (
    <Page title="User Management">
      <div style={{ display: "flex" }}>
        <Link to={"/userManagement/createUser"} className="nav-item nav-link">
          <button>Create New User</button>
        </Link>
        <Link to={"/userManagement/createGroup"} className="nav-item nav-link">
          <button>Create New Group</button>
        </Link>
      </div>
      <Table striped bordered hover variant="dark">
        <thead style={{ textAlign: "center" }}>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>App - Role</th>
            <th>Status</th>
            <th>Change Status</th>
            <th>Change Email</th>
            <th>Change Password</th>
          </tr>
        </thead>
        <tbody style={{ textAlign: "center" }}>
          {state.map((item, i) => (
            <tr key={item.username}>
              <td>{item.username}</td>
              <td>{item.email}</td>
              <td>
                {item.usergrp.map((r, k) => (
                  <div>
                    {r.App_Acronym} - {r.role}
                  </div>
                ))}
              </td>
              <td style={{ color: item.status === true ? "green" : "red" }}>{item.status ? "True" : "False"}</td>
              <td>
                <button onClick={e => changeStatus(e, item.username)}>Click</button>
              </td>
              <td>
                <button onClick={e => changeEmail(e, item.email)}>Click</button>
              </td>
              <td>
                <button onClick={e => changePassword(e, item.username)}>Click</button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Page>
  )
}
export default UserManagement
