import axios from "axios";
const instance = axios.create({
	baseURL: "https://api.ayinkemaykitchen.com/api/",
});

const { API_KEY } = process.env;
const config = {
	headers: { "x-api-key": API_KEY },
};

export default instance;
