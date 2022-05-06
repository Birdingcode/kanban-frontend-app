import React from "react"
import "./Message.css"

export default function FlashMessages(props) {
  return (
    <div className="floating-alerts">
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className="alert alert-success textcenter floating-alert shadow-sm">
            {msg}
          </div>
        )
      })}
    </div>
  )
}
