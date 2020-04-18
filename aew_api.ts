const API_URL = 'http://d8747018.ngrok.io'

function aewApiFetch(path: string, errorMessage: string) {
  const url = `${API_URL}${path}`
  return fetch(url)
    .then(res => res.json())
    .then(data => data)
    .catch(e => console.warn(errorMessage, e))
}

export const AewApi = {
  fetchWrestlers: () => {
    return aewApiFetch("/wrestlers", "Error fetching wrestlers")
  },

  fetchTagTeams: () => {
    return aewApiFetch("/tag_teams", "Error fetching tag teams")
  },

  fetchOfficialTagTeams: () => {
    return aewApiFetch("/tag_teams/official", "Error fetching official tag teams")
  },

  fetchEvents: () => {
    return aewApiFetch("/events", "Error fetching events")
  },

  fetchWrestlerMatches: (wrestler_id: number) => {
    return aewApiFetch(`/wrestlers/${wrestler_id}/matches`, "Error fetching wrestler matches")
  },

  fetchEventMatches: (event_id: number) => {
    return aewApiFetch(`/events/${event_id}/matches`, "Error fetching event matches")
  }
}