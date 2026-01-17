

const remoteUrl = 'https://api-express-holy-cloud-5609.fly.dev/api/v1';
const localUrl = 'http://localhost:3000/api/v1';
const baseUrl = process.env.REACT_APP_BASE_URL || remoteUrl;

export const BASE_URL = baseUrl;