import React, { useEffect, useState } from "react"  
import { AewApi } from "./aew_api"
import { Wrestler, Event, Championship } from "./types"

interface DataContext {
  wrestlers: Wrestler[]
  events: Event[]
  championships: Championship[]
}

const DataContext = React.createContext<DataContext>({
  wrestlers: [],
  events: [],
  championships: []
})

export const DataProvider = ({ children }: { children: React.ReactNode }) => {
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [championships, setChampionships] = useState<Championship[]>([])

  useEffect(() => {
    AewApi.fetchWrestlers()
      .then(res => setWrestlers(res))
      .catch(e => console.warn("Error fetching wrestlers", e))

    AewApi.fetchEvents()
      .then(res => setEvents(res))
      .catch(console.error)

    AewApi.fetchChampionships()
      .then(res => setChampionships(res))
      .catch(console.error)
  }, [])

  const value = {
    wrestlers,
    events,
    championships
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

export default DataContext
