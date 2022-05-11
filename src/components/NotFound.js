import React from "react"
import Page from "./Page"
import { Link } from "react-router-dom"

export default function NotFound() {
  return (
    <Page title="Not Found">
      <div className="text-center">
        <h2>Unable to find page</h2>
        <p className="lead text-muted">
          Visit <Link to="/">homepage</Link> to get fresh start
        </p>
      </div>
    </Page>
  )
}
