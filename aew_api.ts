const API_URL = 'http://5a299ca7.ngrok.io'

function aewApiFetch(path: string, errorMessage: string, requestParams = "") {
  const url = `${API_URL}${path}${requestParams}`
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