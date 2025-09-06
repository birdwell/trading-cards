// Simple API client to connect to the tRPC server
const API_BASE_URL = "http://localhost:3002";

export const api = {
  async getSets() {
    const response = await fetch(`${API_BASE_URL}/getSets`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch sets");
    }

    const data = await response.json();
    return data.result?.data || [];
  },

  async getSetStats(setId: number) {
    const response = await fetch(`${API_BASE_URL}/getSetStats`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ setId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch set stats");
    }

    const data = await response.json();
    return data.result?.data;
  },
};
