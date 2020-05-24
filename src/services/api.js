import axios from 'axios'
import history from './history';

const API = axios.create({
    baseURL: 'https://ent-api-dev.herokuapp.com/api/v1/',
    timeout: 60000,
    headers: {
        'Content-Type': 'application/json'
    }
})  

API.interceptors.response.use((response) => {
    return response;
}, (error) => {
    if (!error.response) {
        return Promise.reject('Network Error')
    } else {
        const status = error.response.status;
        if(status === 401){
            localStorage.clear();
            history.push('login')
            return Promise.reject(error.response)
        }else{
            return Promise.reject(error.response)
        }
    }

})

export default API