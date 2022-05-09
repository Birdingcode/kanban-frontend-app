import React, { useContext, useState, useEffect } from "react"
import StateContext from "../StateContext"
import { useImmer } from "use-immer"
import Page from "./Page"
import Axios from "axios"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"

import DispatchContext from "../DispatchContext"
import { Navigate } from "react-router-dom"

function Home() {
  //const appState = useContext(StateContext)
  const appDispatch = useContext(DispatchContext)
  const [groupAuth, setGroupAuth] = useState()

  useEffect(() => {
    async function checkGroup() {
      try {
        const response = await Axios.post("/checkGroup", { username: localStorage.getItem("username") }, { withCredentials: true })
        console.log(response.data)
        if (response.data) {
          setGroupAuth(response.data)
        }
        //setState(response.data)
      } catch (e) {
        console.log(e)
      }
    }
    checkGroup()
  }, [])

  function handleLogout() {
    appDispatch({ type: "logout" })
    appDispatch({ type: "flashMessage", value: "You have successfully logged out" })
    Axios.get("/logout", { withCredentials: true })
  }

  return (
    <Page title="Home">
      <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">Kanban App</Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsive-navbar-nav">
            <Nav className="me-auto ">
              {groupAuth === true ? <Nav.Link href="/UserManagement">User Management</Nav.Link> : null}
              <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
                <NavDropdown.Item href="/ChangePersonalPw">Change Password</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.2">Another action</NavDropdown.Item>
                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
              </NavDropdown>
            </Nav>

            <Nav className="gap-3">
              <Navbar.Text>
                Signed in as: <a href="#login">{`${localStorage.getItem("username")}`}</a>
              </Navbar.Text>
              <Button onClick={handleLogout} variant="danger">
                Log Out
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Page>
  )
}

export default Home
