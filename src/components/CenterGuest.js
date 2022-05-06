import React, { useContext, useState, useEffect } from "react"
import { BiUserCircle } from "react-icons/bi"
import { AiOutlineLock } from "react-icons/ai"
import Page from "./Page"
import DispatchContext from "../DispatchContext"
import Axios from "axios"

function CenterGuest(props) {
  const appDispatch = useContext(DispatchContext)
  const [username, setUsername] = useState()
  const [password, setPassword] = useState()

  async function handleSubmit(e) {
    e.preventDefault()
    try {
      const response = await Axios.post("/login", { username, password }, { withCredentials: true })
      console.log(response.data)
      if (response.data) {
        console.log("success")

        localStorage.setItem("kanbanSuccess", response.data.success)
        localStorage.setItem("privilege", response.data.privilege)
        localStorage.setItem("username", response.data.username)

        appDispatch({ type: "login", data: response.data })
        appDispatch({ type: "flashMessage", value: "You have successfully logged in!" })
      } else {
        console.log("Incorrect username / password.")
        appDispatch({ type: "flashMessage", value: "Invalid Username / Password." })
      }
    } catch (e) {
      console.log("There was a problem.")
    }
  }

  return (
    <Page title="Login">
      <div className="login">
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="username">
            <i>
              <BiUserCircle />
            </i>
          </label>
          <input type="text" onChange={e => setUsername(e.target.value)} name="username" placeholder="Username" autoComplete="off" />
          <label htmlFor="password">
            <i>
              <AiOutlineLock />
            </i>
          </label>
          <input type="password" onChange={e => setPassword(e.target.value)} name="password" placeholder="Password" autoComplete="off" />
          <input type="submit" value="Login" />
        </form>
      </div>
    </Page>
  )
}

export default CenterGuest
