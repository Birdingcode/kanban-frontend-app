import React, { useEffect } from "react"
import { useImmer } from "use-immer"
import { Link } from "react-router-dom"
import Axios from "axios"
import { Table } from "react-bootstrap"
import Page from "./Page"

import CreateUser from "./CreateUser"

function UserManagement() {
  const [state, setState] = useImmer([])
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

  return (
    <Page title="User Management">
      <div style={{ display: "flex" }}>
        <Link to={"/userManagement/createUser"} className="nav-item nav-link">
          <button>Create New User</button>
        </Link>
        <Link to={"/userManagement/changePassword"} className="nav-item nav-link">
          <button>Change Password</button>
        </Link>
      </div>
      <Table striped bordered hover variant="dark">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {state.map((item, i) => (
            <tr key={item.userID}>
              <td>{item.userID}</td>
              <td>{item.username}</td>
              <td>{item.email}</td>
              <td>{item.role}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Page>
  )
}
export default UserManagement
