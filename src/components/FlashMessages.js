import React from "react"
export default function FlashMessages(props) {
  return (
    <div className="floating-alerts">
      {props.messages.map((msg, index) => {
        return (
          <div key={index} className="floating-alert alert alert-success textcenter shadow-sm">
            {msg}
          </div>
        )
      })}
    </div>
  )
}
