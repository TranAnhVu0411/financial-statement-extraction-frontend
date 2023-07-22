import React, { useState } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import { Modal, Upload, Button, message } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import DocumentService from '../../services/document.service';
import FileService from '../../services/file.service';
import OCRService from '../../services/ocr.service';
import { urltoFile } from '../../utils/convertBase64ToFileObj';
import axios from 'axios';
import { loadingchange, setdocumentmeta } from '../../redux/features/document.slice';

import './style.scss';
const { Dragger } = Upload;

const Home = () => {
    const { user } = useSelector((state) => ({ ...state.auth }));
    const navigate = useNavigate()

    const [files, setFiles] = useState([])
    const [previewFile, setPreviewFile] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewTitle, setPreviewTitle] = useState('')

    const dispatch = useDispatch();
    const handleUploadClick = ({ fileList }) => {
        setFiles(fileList);
    };

    const handlePreview = (file) => {
        setPreviewFile(URL.createObjectURL(file.originFileObj))
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    }
    const handleCancel = () => setPreviewOpen(false);
    // console.log('files', files);
    const handleSubmit = async() => {
        try{
            if (user===null) {
                throw new Error('Please login first');
            }
            if (files.length === 0){
                throw new Error('Please upload pdf');
            }
            dispatch(loadingchange({loading: true, tip: "Initializing Project..."}))
            // create record in db
            const documentResponse = await DocumentService.create({ userid: user.account._id, documentname: files[0].name });
            if (documentResponse.status!==200) {
                const error = await documentResponse.json();
                throw new Error(error.message);
            }
            dispatch(setdocumentmeta({document: documentResponse.data})) // Set document metadata state
            // upload pdf document to server
            let formData = new FormData();
            formData.append('location', `${documentResponse.data.userid}/${documentResponse.data._id}`);
            formData.append('file', files[0].originFileObj);
            const fileResponse = await FileService.upload(formData);
            if (fileResponse.status!==200) {
                await DocumentService.update(documentResponse.data._id, {pdfstatus: 'error'});
                const error = await fileResponse.json();
                throw new Error(error.message);
            }
            await DocumentService.update(documentResponse.data._id, {pdfstatus: 'ready'});
            // preprocess image
            dispatch(loadingchange({tip: "Preprocessing PDF..."}))
            let preprocessFormData = new FormData();
            preprocessFormData.append('file', files[0].originFileObj);
            const preprocessResponse = await OCRService.preprocess(preprocessFormData);
            if (preprocessResponse.status!==200) {
                const error = await preprocessResponse.json();
                throw new Error(error.message);
            }
             // upload preprocess image
            let uploadRequestList = []
            for (let i = 0; i<preprocessResponse.data.length; i++){
                for (let type in preprocessResponse.data[i]){
                    let fileObj = await urltoFile(preprocessResponse.data[i][type], `page-${i}-${type}.jpg`,'image/jpeg');
                    let uploadFormData = new FormData();
                    uploadFormData.append('location', `${documentResponse.data.userid}/${documentResponse.data._id}/images/${i}`);
                    uploadFormData.append('file', fileObj);
                    uploadRequestList.push(FileService.upload(uploadFormData))
                }
            }
            let uploadResponses = await axios.all(uploadRequestList);
            let uploadStatusList = uploadResponses.map(response => {return response.status})
            const isOK = (status) => status === 200;
            if (!uploadStatusList.every(isOK)){
                await DocumentService.update(documentResponse.data._id, {imagestatus: 'error'});
                await FileService.remove({location: `${documentResponse.data.userid}/${documentResponse.data._id}/images`});
                throw new Error('Upload images failed');
            }
            await DocumentService.update(documentResponse.data._id, {imagestatus: 'ready', pagenum: preprocessResponse.data.length});
            // ocr images
            let ocrResponses = []
            for (let i = 0; i<preprocessResponse.data.length; i++){
                dispatch(loadingchange({tip: `OCR Document... ${i+1}/${preprocessResponse.data.length} processed`}))
                let fileObj = await urltoFile(preprocessResponse.data[i]['preprocess'], `page-${i}-${'preprocess'}.jpg`,'image/jpeg');
                let ocrFormData = new FormData();
                ocrFormData.append('file', fileObj);
                ocrFormData.append('type', 'app');
                let response = await OCRService.ocr(ocrFormData)
                if (response.status!==200){
                    await DocumentService.update(documentResponse.data._id, {ocrstatus: 'error'});
                    const error = await response.json();
                    throw new Error(error.message);
                }
                ocrResponses.push(response);
            }

            // Upload results
            let metadataRequestList = []
            for (let i = 0; i<ocrResponses.length; i++){
                dispatch(loadingchange({tip: `Upload metadata... ${i+1}/${preprocessResponse.data.length} processed`}))
                // Reference: https://pqina.nl/blog/convert-a-blob-to-a-file-with-javascript/
                // Upload metadata
                let metadataFileObj = new File([new Blob([JSON.stringify(ocrResponses[i].data.metadata)])], `page-${i}-ocr.json`, {
                    type: 'application/json',
                });
                let metadataFormData = new FormData();
                metadataFormData.append('location', `${documentResponse.data.userid}/${documentResponse.data._id}/metadata/${i}`)
                metadataFormData.append('file', metadataFileObj);
                metadataRequestList.push(FileService.upload(metadataFormData))
            }
            let metadataResponses = await axios.all(metadataRequestList);
            let metadataStatusList = metadataResponses.map(response => {return response.status})
            if (!metadataStatusList.every(isOK)){
                await DocumentService.update(documentResponse.data._id, {ocrstatus: 'error'});
                await FileService.remove({location: `${documentResponse.data.userid}/${documentResponse.data._id}/metadata`});
                throw new Error('Upload result failed');
            } 
            await DocumentService.update(documentResponse.data._id, {ocrstatus: 'ready'});
            dispatch(loadingchange({loading: false, tip: `completed`}))
            navigate('/result')
        } catch (err) {
            dispatch(loadingchange({loading: false, tip: `failed`}))
            message.error(err.message);
        }
    }
    return (
        <div className='home component'>
            <h1>Financial Statement OCR and Extraction</h1>
            <Dragger
                name='file'
                listType="picture"
                showUploadList={true}
                onChange={handleUploadClick}
                beforeUpload={() => false}
                fileList={files}
                multiple={false}
                maxCount={1}
                onPreview={handlePreview}
                accept="application/pdf"
            >
                <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
            </Dragger>
            <Button onClick={handleSubmit}>
                Start OCR
            </Button>
            <Modal open={previewOpen} bodyStyle={{height: '60vh'}} width={1000} title={previewTitle} footer={null} onCancel={handleCancel}>
                <iframe
                    title='Preview'
                    aria-hidden={true}
                    src={previewFile}
                    style={{
                        width: '100%',
                        height: '60vh',
                    }}
                />
            </Modal>
        </div>
    )
}

export default Home;