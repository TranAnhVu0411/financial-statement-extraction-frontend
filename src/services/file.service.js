import {db_axios_instance} from './custom-axios';

const API_URL = '/file';

const upload = (data) => {
    return db_axios_instance.post(`${API_URL}/`, data);
};

const remove = (data) => {
    return db_axios_instance.delete(`${API_URL}/`, data);
};

const loadBackgroundImages = (data) => {
    return db_axios_instance.get(`${API_URL}/background-images?id=${data.id}&userid=${data.userid}&pagenum=${data.pagenum}`)
}

const loadPageInfo = (data) => {
    return db_axios_instance.get(`${API_URL}/page-info?id=${data.id}&userid=${data.userid}&page=${data.page}`)
}

const FileService = {
    upload,
    remove,
    loadBackgroundImages,
    loadPageInfo
};

export default FileService;