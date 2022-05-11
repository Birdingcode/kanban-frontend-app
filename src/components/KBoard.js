import React, { useEffect, useState } from "react"
import { useImmer } from "use-immer"
import { Link, useNavigate, useParams } from "react-router-dom"
import Axios from "axios"
import Page from "./Page"
import Board, { moveCard } from "@asseinfo/react-kanban"
import "@asseinfo/react-kanban/dist/styles.css"

function KBoard() {
  const { App_Acronym } = useParams()

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

  const board = {
    columns: [
      {
        id: 1,
        title: "Open",
        cards: [
          {
            id: 1,
            title: "Card title 1",
            description: "Card content"
          },
          {
            id: 2,
            title: "Card title 2",
            description: "Card content"
          },
          {
            id: 3,
            title: "Card title 3",
            description: "Card content"
          }
        ]
      },
      {
        id: 2,
        title: "To Do",
        cards: [
          {
            id: 9,
            title: "Card title 9",
            description: "Card content"
          }
        ]
      },
      {
        id: 3,
        title: "Doing",
        cards: [
          {
            id: 10,
            title: "Card title 10",
            description: "Card content"
          },
          {
            id: 11,
            title: "Card title 11",
            description: "Card content"
          }
        ]
      },
      {
        id: 4,
        title: "Done",
        cards: [
          {
            id: 12,
            title: "Card title 12",
            description: "Card content"
          },
          {
            id: 13,
            title: "Card title 13",
            description: "Card content"
          }
        ]
      },
      {
        id: 5,
        title: "Close",
        cards: [
          {
            id: 14,
            title: "Card title 14",
            description: "Card content"
          }
        ]
      }
    ]
  }

  // You need to control the state yourself.
  const [controlledBoard, setBoard] = useState(board)

  function handleCardMove(_card, source, destination) {
    const updatedBoard = moveCard(controlledBoard, source, destination)
    setBoard(updatedBoard)
  }

  return (
    <Page title="Project">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Board onCardDragEnd={handleCardMove} disableColumnDrag>
          {controlledBoard}
        </Board>
      </div>
    </Page>
  )
}

export default KBoard
