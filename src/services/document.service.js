import {db_axios_instance} from './custom-axios';

const API_URL = '/document';

const create = (data) => {
    return db_axios_instance.post(`${API_URL}`, data);
};

const update = (id, data) => {
    return db_axios_instance.put(`${API_URL}/${id}`, data);
};

const index = (id) => {
    return db_axios_instance.get(`${API_URL}/index/${id}`);
};

const info = (id) => {
    return db_axios_instance.get(`${API_URL}/${id}`);
};
const DocumentService = {
    create,
    update,
    index,
    info,
};

export default DocumentService;