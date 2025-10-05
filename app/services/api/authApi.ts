export async function loginApi(email: string, password: string) {
  try {
    const body = JSON.stringify({ email, password })
    const response = await fetch("https://picklearena.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body,
    })

    const contentType = response.headers.get("content-type") || ""
    let data: any

    if (contentType.includes("application/json")) {
      data = await response.json()
    } else {
      const text = await response.text()
      console.error("Unexpected response:", text)
      return { success: false, type: "unexpected", message: "Server did not return JSON", text }
    }

    if (!response.ok) {
      if (response.status === 403) {
        return { success: false, type: "auth", message: data?.message || "Authorization error" }
      }
      if (response.status === 422) {
        return { success: false, type: "validation", errors: data?.errors, message: data?.message }
      }
      return { success: false, type: "unknown", message: data?.message || `Error ${response.status}` }
    }

    return { success: true, data }
  } catch (error) {
    console.error("Login API error:", error)
    return { success: false, type: "network", message: (error as any)?.message || "Network error" }
  }
}
