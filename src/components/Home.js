import React, { useContext, useState, useEffect } from "react"
import StateContext from "../StateContext"
import { useImmer } from "use-immer"
import Page from "./Page"
import Axios from "axios"
import { Navbar, Nav, Container, NavDropdown, Button, Card, Row, Col } from "react-bootstrap"

import DispatchContext from "../DispatchContext"
import { Navigate } from "react-router-dom"

function Home() {
  //const appState = useContext(StateContext)
  const [state, setState] = useImmer([])
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

  useEffect(() => {
    //const ourRequest = Axios.CancelToken.source()
    async function fetchData() {
      try {
        const response = await Axios.get("/getApp", { withCredentials: true })
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

  function handleLogout() {
    appDispatch({ type: "logout" })
    appDispatch({ type: "flashMessage", value: "You have successfully logged out" })
    Axios.get("/logout", { withCredentials: true })
  }

  const getAppTile = () => {
    let items = state.map((item, i) => {
      return (
        <Col key={item.App_Acronym}>
          <Card style={{ margin: "20px", textAlign: "center" }}>
            <Card.Body style={{ padding: "40px" }}>
              <Card.Title>{item.App_Acronym}</Card.Title>
              <Card.Text>{item.App_Description}</Card.Text>
              <Button variant="primary">Go somewhere</Button>
            </Card.Body>
          </Card>
        </Col>
      )
    })
    return items
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
              <Nav.Link href="/createApp">Create App</Nav.Link>
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
      <Container>
        <Row xs={1} md={3}>
          {getAppTile()}
        </Row>
        {/*<div style={{ display: "flex", justifyContent: "space-around", paddingTop: "20px" }}>
        {state.map(item => {
          return (
            <Card style={{ width: "20%", padding: "50px", margin: "20px", textAlign: "center" }}>
              <Card.Body>
                <Card.Title>{item.App_Acronym}</Card.Title>
                <Card.Text>{item.App_Description}</Card.Text>
                <Button variant="primary">Go somewhere</Button>
              </Card.Body>
            </Card>
          )
        })}
      </div>*/}
      </Container>
    </Page>
  )
}

export default Home
