import React, { useContext, useState, useEffect } from "react"
import StateContext from "../StateContext"
import { useImmer } from "use-immer"
import Page from "./Page"
import Axios from "axios"
import { Container, Button, Card, Row, Col } from "react-bootstrap"

import DispatchContext from "../DispatchContext"
import { useNavigate } from "react-router-dom"

function Home() {
  let navigate = useNavigate()
  const [state, setState] = useImmer([])
  const appDispatch = useContext(DispatchContext)
  const [groupAuth, setGroupAuth] = useState()

  // useEffect(() => {
  //   async function checkGroup() {
  //     try {
  //       const response = await Axios.post("/checkGroup", { username: localStorage.getItem("username") }, { withCredentials: true })
  //       console.log(response.data)
  //       if (response.data) {
  //         setGroupAuth(response.data)
  //       }
  //       //setState(response.data)
  //     } catch (e) {
  //       console.log(e)
  //     }
  //   }
  //   checkGroup()
  // }, [])

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

  const getAppTile = proj => {
    let items = state.map((item, i) => {
      return (
        <Col key={item.App_Acronym}>
          <Card style={{ margin: "20px", textAlign: "center" }}>
            <Card.Body style={{ padding: "40px" }}>
              <Card.Title>{item.App_Acronym}</Card.Title>
              <Card.Text>{item.App_Description}</Card.Text>
              <Button
                onClick={() => {
                  handleSubmit(item.App_Acronym)
                }}
                variant="primary"
              >
                Go somewhere
              </Button>
            </Card.Body>
          </Card>
        </Col>
      )
    })
    return items
  }

  function handleSubmit(proj) {
    navigate(`/project/${proj}`)
  }

  return (
    <Page title="Home">
      <Container>
        <Row xs={1} md={3}>
          {getAppTile()}
        </Row>
      </Container>
    </Page>
  )
}

export default Home
