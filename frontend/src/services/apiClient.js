const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://127.0.0.1:8000";

async function request(
  endpoint,
  options = {}
) {
  const {
    method = "GET",
    body,
    headers = {},
  } = options;

  const token =
    localStorage.getItem("access_token");

  const requestHeaders = {
    ...headers,
  };

  // Don't manually set Content-Type when using
  // FormData. The browser adds the correct boundary.
  if (
    body &&
    !(body instanceof FormData)
  ) {
    requestHeaders["Content-Type"] =
      "application/json";
  }

  if (token) {
    requestHeaders.Authorization =
      `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      method,
      headers: requestHeaders,
      body:
        body &&
        !(body instanceof FormData)
          ? JSON.stringify(body)
          : body,
    }
  );

  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message =
      data?.detail ||
      data?.message ||
      `Request failed with status ${response.status}`;

    throw new Error(message);
  }

  return data;
}


export const apiClient = {
  get(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: "GET",
    });
  },

  post(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "POST",
      body,
    });
  },

  put(endpoint, body, options = {}) {
    return request(endpoint, {
      ...options,
      method: "PUT",
      body,
    });
  },

  delete(endpoint, options = {}) {
    return request(endpoint, {
      ...options,
      method: "DELETE",
    });
  },
};


export default apiClient;