import React, { useEffect, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"
import Board, { moveCard, renderCard } from "@asseinfo/react-kanban"
import "@asseinfo/react-kanban/dist/styles.css"

function KBoard() {
  const { App_Acronym } = useParams()
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

        let taskResult = response.data
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

  if (networkStatus === "resolved") {
    return (
      <Page title="Project">
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
      </Page>
    )
  } else {
    return null
  }
}

export default KBoard
