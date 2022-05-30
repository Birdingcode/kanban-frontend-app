import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"
import TaskModal from "./TaskModal"
import { Modal, Button } from "rsuite"
import Board, { moveCard, renderCard } from "@asseinfo/react-kanban"
import "@asseinfo/react-kanban/dist/styles.css"
import "rsuite/dist/rsuite.min.css"

//mui
import { styled } from "@mui/material/styles"
import Box from "@mui/material/Box"
import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Grid"
import Card from "@mui/material/Card"
import { CardContent, CardHeader } from "@mui/material"
import { blue, pink } from "@mui/material/colors"

const StyledPaper = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#1A2027" : "#fff",
  ...theme.typography.body2,
  padding: theme.spacing(2),
  maxWidth: 300,
  color: theme.palette.text.primary
}))

function KBoard() {
  let navigate = useNavigate()
  const { App_Acronym } = useParams()
  const [success, setSuccess] = useState()
  const [planSuccess, setPlanSuccess] = useState()
  const [plan, setPlan] = useState([])
  const cards = []
  const [networkStatus, setNetworkStatus] = useState("pending")
  const [state, setState] = useState()
  const [open, setOpen] = useState(false)
  const handleOpen = id => {
    setState(id)
    setOpen(true)
  }
  const handleClose = () => setOpen(false)

  async function fetchData() {
    try {
      const response = await Axios.get("/getTask", { params: { App_Acronym: App_Acronym }, withCredentials: true })
      console.log("kboard fetch data")
      console.log(response.data)
      sortBoard(response.data)

      setNetworkStatus("resolved")
    } catch (e) {
      console.log("There was a problem.")
      console.log(e)
    }
  }
  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
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
    //console.log(boardArray)

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

    //console.log(openTasksArray)
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
    //console.log(board)
  }

  const [controlledBoard, setBoard] = useState(board)

  async function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(controlledBoard, source, destination)

    let sourceID = source.fromColumnId
    let destinationID = destination.toColumnId
    let direction = sourceID - destinationID

    console.log(controlledBoard)
    console.log(updatedBoard)
    console.log(_card.id)

    if (direction === -1) {
      try {
        const response = await Axios.post("/checkGroup", { username: localStorage.getItem("username"), Task_id: _card.id, sourceID }, { params: { App_Acronym: App_Acronym }, withCredentials: true })
        //console.log(response.data)
        if (response.data !== false) {
          console.log(response.data)
          console.log(destinationID)

          setBoard(updatedBoard)
          fetchData()
        }
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    } else if (direction === 1) {
      console.log("positive")
      try {
        const response = await Axios.post("/checkGroupBack", { username: localStorage.getItem("username"), Task_id: _card.id, sourceID }, { params: { App_Acronym: App_Acronym }, withCredentials: true })
        if (response.data !== false) {
          console.log(response.data)

          setBoard(updatedBoard)
          fetchData()
        }
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }

    //setBoard(updatedBoard)
  }

  useEffect(() => {
    async function fetchCreate() {
      try {
        const response = await Axios.post("/checkCreate", { username: localStorage.getItem("username") }, { params: { App_Acronym: App_Acronym }, withCredentials: true })

        console.log(response.data)
        setSuccess(response.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    async function fetchCheckPlan() {
      try {
        const checkPlanResult = await Axios.post("/checkPlan", { username: localStorage.getItem("username") }, { params: { App_Acronym: App_Acronym }, withCredentials: true })
        console.log(checkPlanResult.data)
        setPlanSuccess(checkPlanResult.data)
      } catch (e) {
        console.log("There was a problem.")
        console.log(e)
      }
    }
    fetchCheckPlan()
    fetchCreate()
  }, [])

  function changePlan(App_Acronym, Plan_name) {
    navigate(`/project/${App_Acronym}/editPlan/${Plan_name}`)
  }

  function createTask(App_Acronym) {
    navigate(`/project/${App_Acronym}/createTask`)
  }

  if (networkStatus === "resolved") {
    return (
      <Page title="Project">
        <div>
          <div style={{ position: "absolute", left: 0, top: 58, width: "20%" }}>
            {plan.map((item, i) => (
              <Box sx={{ flexGrow: 1, overflow: "hidden", px: 1 }}>
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
                        <CardHeader title={item.Plan_name} subheader={item.Plan_Description} />
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={6} sm={6}>
                              <Grid container>
                                <Grid container justify="space-evenly">
                                  <label>Start Date: </label>
                                  <label>{new Date(item.Plan_startDate).toISOString().split("T")[0]}</label>
                                  {planSuccess === true ? (
                                    <button
                                      onClick={() => {
                                        changePlan(item.App_Acronym, item.Plan_name, item.Plan_Description)
                                      }}
                                    >
                                      Edit Plan
                                    </button>
                                  ) : null}
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
          </div>
          <div style={{ marginLeft: "20%" }}>
            <Board
              renderCard={({ title, id, description, owner }) => (
                <div style={{ marginTop: 10, width: "calc(14vw - 30px)", backgroundColor: "#969FA7", borderRadius: 5, padding: 5 }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <h4 style={{ color: "white", marginRight: 2 }}>{title}</h4>
                    <h5>{owner || "-"}</h5> {console.log(owner)}
                  </div>
                  <div>
                    <label>Description: </label>
                    <div>
                      <textarea cols={15} style={{ backgroundColor: "#BAC1C5", borderRadius: 5 }}>
                        {description}
                      </textarea>
                    </div>
                  </div>
                  <Button
                    style={{ backgroundColor: "#2c3e50", color: "white" }}
                    onClick={() => {
                      handleOpen(id)
                    }}
                  >
                    View Task
                  </Button>
                </div>
              )}
              onCardDragEnd={handleCardMove}
              disableColumnDrag
            >
              {controlledBoard}
            </Board>
          </div>
        </div>

        <div className="modal-container">
          <Modal overflow={true} size={"lg"} open={open} onClose={handleClose}>
            <TaskModal taskid={state} fetchData={fetchData} />
            <Modal.Footer>
              <Button onClick={handleClose} appearance="subtle">
                Cancel
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
        <div>
          {success ? (
            <button
              className="createTask"
              onClick={() => {
                createTask(App_Acronym)
              }}
            >
              Create Task
            </button>
          ) : null}
        </div>
      </Page>
    )
  } else {
    return null
  }
}

export default KBoard
