import axios from "axios";
import { APP_ADDRESS } from '@env';

export const api = axios.create({
  baseURL: APP_ADDRESS,
});
