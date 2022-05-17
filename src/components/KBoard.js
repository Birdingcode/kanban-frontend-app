import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"
import Board, { moveCard, renderCard } from "@asseinfo/react-kanban"
import "@asseinfo/react-kanban/dist/styles.css"

//mui
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import { CardContent, CardHeader } from "@mui/material"

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  maxWidth: 300,
  color: theme.palette.text.primary
}))

const message = `Truncation should be conditionally applicable on this long line of text
 as this is a much longer line than what the container can support. `

function KBoard() {
  let navigate = useNavigate()

  const { App_Acronym } = useParams()
  const [plan, setPlan] = useState([])
  const [groupAuth, setGroupAuth] = useState()
  const cards = []

  const [networkStatus, setNetworkStatus] = useState("pending")

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
        const response = await Axios.get("/getTask", { params: { App_Acronym: App_Acronym }, withCredentials: true })

        console.log(response.data)
        sortBoard(response.data)

        setNetworkStatus("resolved")
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

  useEffect(() => {
    //const ourRequest = Axios.CancelToken.source()
    async function fetchPlan() {
      try {
        const response = await Axios.get("/getSpecificPlan", { params: { App_Acronym: App_Acronym }, withCredentials: true })

        console.log(response.data)
        setPlan(response.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchPlan()
    // return () => {
    //   ourRequest.cancel()
    // }
  }, [])

  const board = {
    columns: [
      {
        id: 1,
        title: "Open",
        cards
      },
      {
        id: 2,
        title: "To Do",
        cards: []
      },
      {
        id: 3,
        title: "Doing",
        cards: []
      },
      {
        id: 4,
        title: "Done",
        cards: []
      },
      {
        id: 5,
        title: "Close",
        cards: []
      }
    ]
  }

  function sortBoard(boardArray) {
    console.log(boardArray)

    let boardData = boardArray

    let openTasksArray = []
    let toDoTasksArray = []
    let doingTasksArray = []
    let doneTasksArray = []
    let closeTasksArray = []
    openTasksArray = boardData.filter(boardData => boardData.Task_state === "Open")
    toDoTasksArray = boardData.filter(boardData => boardData.Task_state === "ToDo")
    doingTasksArray = boardData.filter(boardData => boardData.Task_state === "Doing")
    doneTasksArray = boardData.filter(boardData => boardData.Task_state === "Done")
    closeTasksArray = boardData.filter(boardData => boardData.Task_state === "Close")

    let openCardData = []
    let toDoCardData = []
    let doingCardData = []
    let doneCardData = []
    let closeCardData = []

    console.log(openTasksArray)
    //openTasksArray.map(e, i)
    openTasksArray.map((e, i) => {
      let openTask = {
        id: e.Task_id,
        title: e.Task_name,
        plan: e.Plan_name,
        acronym: e.App_Acronym,
        description: e.Task_description,
        notes: e.Task_notes,
        creator: e.Task_creator,
        owner: e.Task_owner,
        date: e.Task_createDate
      }
      openCardData.push(openTask)
    })

    toDoTasksArray.map((e, i) => {
      let toDoTask = {
        id: e.Task_id,
        title: e.Task_name,
        plan: e.Plan_name,
        acronym: e.App_Acronym,
        description: e.Task_description,
        notes: e.Task_notes,
        creator: e.Task_creator,
        owner: e.Task_owner,
        date: e.Task_createDate
      }
      toDoCardData.push(toDoTask)
    })

    doingTasksArray.map((e, i) => {
      let doingTask = {
        id: e.Task_id,
        title: e.Task_name,
        plan: e.Plan_name,
        acronym: e.App_Acronym,
        description: e.Task_description,
        notes: e.Task_notes,
        creator: e.Task_creator,
        owner: e.Task_owner,
        date: e.Task_createDate
      }
      doingCardData.push(doingTask)
    })

    doneTasksArray.map((e, i) => {
      let doneTask = {
        id: e.Task_id,
        title: e.Task_name,
        plan: e.Plan_name,
        acronym: e.App_Acronym,
        description: e.Task_description,
        notes: e.Task_notes,
        creator: e.Task_creator,
        owner: e.Task_owner,
        date: e.Task_createDate
      }
      doneCardData.push(doneTask)
    })

    closeTasksArray.map((e, i) => {
      let closeTask = {
        id: e.Task_id,
        title: e.Task_name,
        plan: e.Plan_name,
        acronym: e.App_Acronym,
        description: e.Task_description,
        notes: e.Task_notes,
        creator: e.Task_creator,
        owner: e.Task_owner,
        date: e.Task_createDate
      }
      closeCardData.push(closeTask)
    })

    board.columns[0]["cards"] = openCardData
    board.columns[1]["cards"] = toDoCardData
    board.columns[2]["cards"] = doingCardData
    board.columns[3]["cards"] = doneCardData
    board.columns[4]["cards"] = closeCardData
    setBoard(board)
    console.log(board)
  }

  const [controlledBoard, setBoard] = useState(board)

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(controlledBoard, source, destination)
    console.log(source.fromColumnId)
    console.log(source.fromPosition)
    console.log(destination.toColumnId)
    console.log(destination.toPosition)

    setBoard(updatedBoard)
  }

  function changePlan(App_Acronym, Plan_name) {
    navigate(`/project/${App_Acronym}/editPlan/${Plan_name}`)
  }

  if (networkStatus === "resolved") {
    return (
      <Page title="Project">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ position: "absolute", left: 0, top: 58 }}>
            {plan.map((item, i) => (
              <Box sx={{ flexGrow: 1, overflow: "hidden", px: 2 }}>
                <StyledPaper
                  sx={{
                    my: 1,
                    mx: "auto",
                    p: 1
                  }}
                >
                  <Grid container wrap="nowrap" spacing={1}>
                    <Grid item>
                      <Card>
                        <CardHeader title={item.Plan_name} />
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={6}>
                              <Grid container>
                                <Grid container justify="space-evenly">
                                  <label>Start Date: </label>
                                  <label>{new Date(item.Plan_startDate).toISOString().split("T")[0]}</label>
                                  <button
                                    onClick={() => {
                                      changePlan(item.App_Acronym, item.Plan_name)
                                    }}
                                  >
                                    Edit Plan
                                  </button>
                                </Grid>
                              </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6}>
                              <Grid container>
                                <Grid container justify="space-evenly">
                                  <label>End Date: </label>
                                  <label>{new Date(item.Plan_endDate).toISOString().split("T")[0]}</label>
                                </Grid>
                              </Grid>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </StyledPaper>
              </Box>
            ))}

            {/*<Box sx={{ flexGrow: 1, overflow: "hidden", px: 2 }}>
              <StyledPaper
                sx={{
                  my: 1,
                  mx: "auto",
                  p: 1
                }}
              >
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                    <Avatar>W</Avatar>
                  </Grid>
                  <Grid item xs zeroMinWidth>
                    <Typography noWrap>{message}</Typography>
                  </Grid>
                </Grid>
              </StyledPaper>
              <StyledPaper
                sx={{
                  my: 1,
                  mx: "auto",
                  p: 1
                }}
              >
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                    <Avatar>W</Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography noWrap>{message}</Typography>
                  </Grid>
                </Grid>
              </StyledPaper>
              <StyledPaper
                sx={{
                  my: 1,
                  mx: "auto",
                  p: 1
                }}
              >
                <Grid container wrap="nowrap" spacing={2}>
                  <Grid item>
                    <Avatar>W</Avatar>
                  </Grid>
                  <Grid item xs>
                    <Typography>{message}</Typography>
                  </Grid>
                </Grid>
              </StyledPaper>
            </Box>*/}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Board
              renderCard={({ title, description, notes }) => (
                <div>
                  <h4>{title}</h4>
                  <p>{description}</p>
                  <button>Add Note</button>
                </div>
              )}
              onCardDragEnd={handleCardMove}
              disableColumnDrag
            >
              {controlledBoard}
            </Board>
          </div>
        </div>
      </Page>
    )
  } else {
    return null
  }
}

export default KBoard
