export async function playerInfoApi(playerId: number, token: string | null) {
  try {
    const response = await fetch(`https://picklearena.com/api/players/view?playerId=${playerId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`Request error: ${response.status}`)
    }

    const data = await response.json()
    return data.data
  } catch (error) {
    console.error("PlayerInfo API error:", error)
    throw error
  }
}
