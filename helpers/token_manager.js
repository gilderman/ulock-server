import fs from "fs";

class TokenManager {
  constructor() {
    this.ACCESS_TOKEN_FILE = "access_token.json";
    this.REFRESH_TOKEN_FILE = "refresh_token.json";
    this.accessToken = null; // Store in memory for quick access
  }

  // Save token to a file
  saveTokenToFile(token, filename) {
    fs.writeFile(filename, JSON.stringify(token, null, 2), (err) => {
      if (err) {
        console.error(`Error saving token to ${filename}:`, err);
      }
    });
  }

  // Read token from a file
  readTokenFromFile(filename) {
    try {
      const data = fs.readFileSync(filename, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error(`Error reading token from ${filename}:`, err);
      return null; // Return null if token file is missing
    }
  }

  // Save both access and refresh tokens
  saveTokens(tokenResponse) {
    if (!tokenResponse?.data?.access_token || !tokenResponse?.data?.refresh_token) {
      console.error("Invalid token response");
      return;
    }

    const accessToken = tokenResponse.data.access_token;
    const refreshToken = tokenResponse.data.refresh_token;

    this.saveTokenToFile(accessToken, this.ACCESS_TOKEN_FILE);
    this.saveTokenToFile(refreshToken, this.REFRESH_TOKEN_FILE);

    this.accessToken = accessToken; // Store in memory
    console.log("New access token:", this.accessToken);
    console.log("New refresh token:", refreshToken);
  }

  // Get access token (first check memory, then file)
  getAccessToken() {
    if (!this.accessToken) {
      this.accessToken = this.readTokenFromFile(this.ACCESS_TOKEN_FILE);
    }
    return this.accessToken;
  }

  // Get refresh token
  getRefreshToken() {
    return this.readTokenFromFile(this.REFRESH_TOKEN_FILE);
  }
}

// Export a singleton instance
const tokenManager = new TokenManager();
export default tokenManager;