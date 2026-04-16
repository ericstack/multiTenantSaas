import authService from "./auth.service.js";

export const registerTenant = async (req, res) => {
  try {
    const result = await authService.register(req.body);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(201).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};
export const loginUser = async (req, res) => {
  try {
    const result = await authService.login(req);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};

export const logoutUser = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const result = await authService.logout(refreshToken);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Logout failed" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const result = await authService.refreshToken(refreshToken);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to refresh token" });
  }
};
export const getCurrentUser = async (req, res) => {
  try {
    const result = await authService.getMe(req.body.user_id);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Get all active sessions for the current user - admin only
export const getUserSessions = async (req, res) => {
  try {
    const result = await authService.getUserSessions(req.user.user_id);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
};

// Revoke a specific session by ID - admin only
export const revokeSession = async (req, res) => {
  try {
    const result = await authService.revokeSession(req.params.sessionId);
    if (result.error) {
      return res.status(400).json(result);
    }
    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to revoke session" });
  }
};
