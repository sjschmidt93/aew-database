import React, { useEffect, useState } from "react"  
import { AewApi } from "./aew_api"
import { Wrestler } from "./types"

export const WrestlerContext = React.createContext<Wrestler[]>([])

export const WrestlerProvider = ({ children }: { children: React.ReactNode }) => {
  const [wrestlers, setWrestlers] = useState<Wrestler[]>([])

  useEffect(() => {
    AewApi.fetchWrestlers()
      .then(res => setWrestlers(res))
      .catch(e => console.warn("Error fetching wrestlers", e))
  }, [])

  return (
    <WrestlerContext.Provider value={wrestlers}>
      {children}
    </WrestlerContext.Provider>
  )
}