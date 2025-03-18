import fs from "fs";
import path from "path";

class Config {
  constructor() {
    const configPath = path.join(__dirname, "config.json");

    try {
      const configData = fs.readFileSync(configPath, "utf8");
      this.config = JSON.parse(configData);
    } catch (error) {
      console.error("Error loading configuration:", error);
      process.exit(1); // Exit if config file is missing or invalid
    }
  }

  get CLIENT_ID() {
    return this.config.CLIENT_ID;
  }

  get CLIENT_SECRET() {
    return this.config.CLIENT_SECRET;
  }

  get PORT() {
    return this.config.PORT || 3000; // Default value if not set
  }

  get DEVICE_ID() {
    return this.config.DEVICE_ID;
  }

  get TRACE_API() {
    return this.config.TRACE_API;
  }
  
  get LOGGER() {
    return this.config.LOGGER;
  }
}

// Export a singleton instance
const configInstance = new Config();
export default configInstance;