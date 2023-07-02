import {db_axios_instance} from './custom-axios';

const API_URL = '/auth';

const register = (data) => {
    return db_axios_instance.post(`${API_URL}/register`, data);
};

const login = (data) => {
    return db_axios_instance.post(`${API_URL}/login`, data);
};

const AuthService = {
    register,
    login
};

export default AuthService;