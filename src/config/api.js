const API_CONFIG = {
    LOCAL: "https://localhost:32775",
    REMOTE: "https://meetmyavatar-dya3d4avdpbbf3ak.westeurope-01.azurewebsites.net",
};

// Set BASE_URL depending on the environment
const BASE_URL = process.env.NODE_ENV === 'production' ? API_CONFIG.REMOTE : API_CONFIG.LOCAL;

export default {
    BASE_URL,
};