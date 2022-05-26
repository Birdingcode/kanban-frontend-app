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
  const [networkStatus, setNetworkStatus] = useState("pending")
  const [app, setApp] = useImmer([])
  const [group, setGroup] = useImmer([])
  const appDispatch = useContext(DispatchContext)

  const [isPM, setIsPM] = useState(false)
  const checkPM = () => {
    let splitGroup = group[0].role.split(",")
    console.log(splitGroup)
    for (let i = 0; i < splitGroup.length; i++) {
      if (splitGroup[i].substring(splitGroup[i].indexOf("_") + 1) === "PM") {
        setIsPM(true)
        return
      }
    }
  }

  useEffect(() => {
    async function fetchUserApp() {
      try {
        const response = await Axios.get("/getApp", { withCredentials: true })
        //console.log(userApp.data)
        setApp(response.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    async function fetchUserGroup() {
      try {
        const userGroup = await Axios.get("/getUserGroup", { params: { username: localStorage.getItem("username") }, withCredentials: true })
        console.log(userGroup.data)
        setGroup(userGroup.data)
        setNetworkStatus("resolved")
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchUserApp()
    fetchUserGroup()
  }, [])

  useEffect(() => {
    if (group.length) {
      checkPM()
    }
  }, [group])

  const getAppTile = proj => {
    let items = app.map((item, i) => {
      return (
        <Col key={item.App_Acronym}>
          <Card style={{ margin: "20px", textAlign: "center" }}>
            <Card.Body style={{ padding: "40px" }}>
              <Card.Title>{item.App_Acronym}</Card.Title>
              <Card.Text>{item.App_Description}</Card.Text>
              {isPM ? (
                <Button
                  onClick={() => {
                    handleEdit(item.App_Acronym)
                  }}
                  variant="secondary"
                >
                  Edit
                </Button>
              ) : null}{" "}
              <Button
                onClick={() => {
                  handleSubmit(item.App_Acronym)
                }}
                variant="primary"
              >
                Select
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

  function handleEdit(proj) {
    navigate(`/project/edit/${proj}`)
  }
  if (networkStatus === "resolved") {
    return (
      <Page title="Home">
        <Container>
          <Row xs={1} md={3}>
            {getAppTile()}
          </Row>
        </Container>
      </Page>
    )
  } else {
    return null
  }
}

export default Home
