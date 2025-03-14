import axios from 'axios'
import { getTokenFromLocalStorage } from '../helpers/localstorage.helper'

const instance = axios.create();

instance.interceptors.request.use((config) => {
    config.headers.Authorization = 'Bearer ' + getTokenFromLocalStorage()
    return config;
});

export { instance }