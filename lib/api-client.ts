class APIClient {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://localhost:8000/api"
  }

  setToken(token: string) {
    this.token = token
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      "Content-Type": "application/json",
      ...(this.token && { Authorization: `Bearer ${this.token}` }),
      ...options.headers,
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  // Project management
  async getProjects(userId?: string) {
    return this.request(`/projects/${userId ? `?user_id=${userId}` : ""}`)
  }

  async createProject(projectData: any) {
    return this.request("/projects/", {
      method: "POST",
      body: JSON.stringify(projectData),
    })
  }

  async getProject(projectId: string) {
    return this.request(`/projects/${projectId}/`)
  }

  // AI features
  async generateCode(prompt: string, type: string, context?: any) {
    return this.request("/ai/generate/", {
      method: "POST",
      body: JSON.stringify({ prompt, type, context }),
    })
  }

  async getCodeSuggestions(filePath: string, context: string) {
    return this.request(`/ai/suggestions/${encodeURIComponent(filePath)}/`, {
      method: "POST",
      body: JSON.stringify({ context }),
    })
  }

  // API mapping and visualization
  async analyzeAPIMapping(projectId: string) {
    return this.request(`/mapping/analyze/`, {
      method: "POST",
      body: JSON.stringify({ project_id: projectId }),
    })
  }

  async getVisualizationData(projectId: string) {
    return this.request(`/mapping/visualize/${projectId}/`)
  }

  // Performance monitoring
  async getPerformanceAnalysis(projectId: string) {
    return this.request(`/performance/analyze/${projectId}/`)
  }

  // Testing
  async generateTests(projectId: string, filePath: string) {
    return this.request("/testing/generate/", {
      method: "POST",
      body: JSON.stringify({ project_id: projectId, file_path: filePath }),
    })
  }
}

export const apiClient = new APIClient()
