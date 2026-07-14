export const apiFetch = async (url, options = {}) => {
  const token = localStorage.getItem("authToken");

  // Determine if this is a public endpoint that shouldn't require redirecting if token is missing
  const publicEndpoints = ["/users/login", "/cars/all", "/images"];
  const isPublic = publicEndpoints.some(ep => url.includes(ep));

  if (!token && !isPublic) {
    if (!window.location.pathname.includes("login")) {
      window.location.href = window.location.pathname.includes("marketing") ? "/marketinglogin" : "/adminlogin";
    }
    throw new Error("No authentication token found.");
  }

  const headers = {
    ...(token && { "Authorization": `Bearer ${token}` }),
    ...options.headers,
  };

  // If body is NOT FormData, default to application/json
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = headers["Content-Type"] || "application/json";
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem("authToken");
    if (!window.location.pathname.includes("login")) {
      window.location.href = window.location.pathname.includes("marketing") ? "/marketinglogin" : "/adminlogin";
    }
    throw new Error("UNAUTHORIZED");
  }

  return response;
};
