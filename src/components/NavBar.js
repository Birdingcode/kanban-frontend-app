import React, { useContext, useState, useEffect } from "react"
import Axios from "axios"
import { Navbar, Nav, Container, NavDropdown, Button } from "react-bootstrap"
import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

function NavBar() {
  const appDispatch = useContext(DispatchContext)
  const [groupAuth, setGroupAuth] = useState()
  let navigate = useNavigate()
  useEffect(() => {
    async function checkGroup() {
      try {
        const response = await Axios.post("/checkGroupAPM", { username: localStorage.getItem("username") }, { withCredentials: true })
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
    navigate("/")
    appDispatch({ type: "logout" })
    //appDispatch({ type: "flashMessage", value: "You have successfully logged out" })
    Axios.get("/logout", { withCredentials: true })
  }

  return (
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">Kanban App</Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto ">
            {groupAuth === "authAdmin" ? <Nav.Link href="/UserManagement">User Management</Nav.Link> : null}
            {groupAuth === "authPM" || groupAuth === "authAdmin" ? <Nav.Link href="/createApp">Create App</Nav.Link> : null}
            {groupAuth === "authPM" || groupAuth === "authAdmin" ? <Nav.Link href="/createPlan">Create Plan</Nav.Link> : null}
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/ChangePersonalPw">Change Password</NavDropdown.Item>
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
  )
}

export default NavBar
