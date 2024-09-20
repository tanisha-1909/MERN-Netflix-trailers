import axios from "axios";
import { ENV_VARS } from "../config/envVars.js";

export const fetchFromTMDB = async (url) => {
    const apiKey = ENV_VARS.TMDB_API_KEY;  // v3 API key

    try {
        // Append API key to the URL as a query parameter
        const response = await axios.get(`${url}&api_key=${apiKey}`, {
            headers: {
                accept: "application/json",
            },
            timeout: 5000,  // Optional: 5 seconds timeout
        });
        
        return response.data;
    } catch (error) {
        // Handle errors more gracefully
        const status = error.response?.status;
        const statusText = error.response?.statusText || error.message;
        throw new Error(`Failed to fetch data from TMDB: ${status} ${statusText}`);
    }
};
