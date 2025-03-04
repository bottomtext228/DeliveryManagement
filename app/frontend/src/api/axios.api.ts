import axios from 'axios'
import { getTokenFromLocalStorage } from '../helpers/localstorage.helper'

export const instance = axios.create({
    headers: {
        Authorization: 'Bearer ' + getTokenFromLocalStorage()
    }
})