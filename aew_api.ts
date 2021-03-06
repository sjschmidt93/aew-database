//const API_URL = 'https://dfd2a419ca1a.ngrok.io'
const API_URL = 'https://morning-coast-52689.herokuapp.com/'

function aewApiFetch(path: string, errorMessage: string, requestParams = "") {
  const url = `${API_URL}${path}${requestParams}`
  return fetch(url)
    .then(res => res.json())
    .catch(e => console.warn(errorMessage, e))
}

export const AewApi = {
  fetchWrestlers: () => {
    return aewApiFetch("/wrestlers", "Error fetching wrestlers")
  },

  fetchWrestler: (wrestlerId: number) => {
    return aewApiFetch(`/wrestlers/${wrestlerId}`, `Error fetching wrestler ${wrestlerId}`)
  },

  fetchTagTeams: () => {
    return aewApiFetch("/tag_teams", "Error fetching tag teams")
  },

  fetchTagTeam: (tagTeamId: number) => {
    return aewApiFetch(`/tagTeam/${tagTeamId}`, `Error fetching wrestler ${tagTeamId}`)
  },

  fetchOfficialTagTeams: () => {
    return aewApiFetch("/tag_teams/official", "Error fetching official tag teams")
  },

  fetchTagTeamMatches: (tagTeamId: number) => {
    return aewApiFetch(`/tag_teams/${tagTeamId}/matches`, "Error fetching tag team's matches")
  },

  fetchEvents: (limit?: number) => {
    const params = limit !== undefined ? `?limit=${limit}` : ""
    return aewApiFetch("/events", "Error fetching events", params)
  },

  fetchWrestlerMatches: (wrestler_id: number) => {
    return aewApiFetch(`/wrestlers/${wrestler_id}/matches`, "Error fetching wrestler's matches")
  },

  fetchEventMatches: (event_id: number) => {
    return aewApiFetch(`/events/${event_id}/matches`, "Error fetching event matches")
  },

  fetchActiveReigns: () => {
    return aewApiFetch("/reigns/active", "Error fetching active reigns")
  },

  fetchChampionships: () => {
    return aewApiFetch("/championships", "Error fetching championships")
  }
}