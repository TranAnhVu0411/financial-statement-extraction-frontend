import {ocr_axios_instance} from './custom-axios';

const API_URL = '';

const preprocess = (data) => {
    return ocr_axios_instance.post(`${API_URL}/preprocess`, data);
};

const ocr = (data) => {
    return ocr_axios_instance.post(`${API_URL}/ocr`, data);
};

const OCRService = {
    preprocess,
    ocr,
};

export default OCRService;