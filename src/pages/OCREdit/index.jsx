import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { loadimages, pageinfo, loadingchange } from "../../redux/features/document.slice";
import { canvasupdate, reset } from "../../redux/features/canvas.slice";
import { newupdate, newreset } from "../../redux/features/newbb.slice";
import { Card, Col, Row, message, List, Image, Button, Switch, Space } from "antd";
import './style.scss';
// import { urltoFile } from '../../utils/convertBase64ToFileObj';
import Canvas from "./Canvas/index";
import { json2tree } from "../../utils/json2tree";
import Label from "./Label/index";
import New from "./New/index";
import FileService from "../../services/file.service";

const SCALEBY = 1.25;

const OCREdit = () => {
    const dispatch = useDispatch();
    const { images, document, metadata, pageimages, pageindex } = useSelector((state) => ({ ...state.document }));
    const { width, height, scale, canvasstate, highlight, bbmetadata, textmetadata, checkedid, selectedbbid, disablemenu } = useSelector((state) => ({ ...state.canvas }));
    const { displaynewbb, linemeta, tablemeta, type } = useSelector((state) => ({ ...state.newbb }));
    const [searchParams] = useSearchParams();
    const ref = useRef(null)
    const [imageState, setImageState] = useState(true);
    
    useEffect(() => {
        let values = {id: searchParams.get('id')};
        dispatch(loadimages({values, message}))
        dispatch(canvasupdate({width: ref.current.offsetWidth, height: ref.current.offsetHeight, sectionwidth: ref.current.offsetWidth, sectionheight: ref.current.offsetHeight}))
    }, []);
    
    const handleImageClick = async(idx) => {
        let values = {id: document.id, userid: document.userid, page: idx};
        dispatch(pageinfo({values, message}))
        // let fileObj = await urltoFile(images[idx], `temp.jpg`,'image/jpeg');
        // let url =  URL.createObjectURL(fileObj)
        dispatch(canvasupdate({imageurl: images[idx], disablemenu: false}));
        dispatch(reset({canvasstate: 'edit'}));
        dispatch(newreset());
        setImageState(true);
    }

    useEffect(() => {
        if (Object.keys(metadata).length !== 0){
            let treeMetadata = json2tree(metadata)
            dispatch(canvasupdate({textmetadata: treeMetadata['text'], bbmetadata: treeMetadata['bb']}))
        }
    }, [metadata]);

    const zoomIn = () => {
        dispatch(canvasupdate({width: width*SCALEBY, height: height*SCALEBY, scale: scale*SCALEBY}))
    }

    const zoomOut = () => {
        dispatch(canvasupdate({width: width/SCALEBY, height: height/SCALEBY, scale: scale/SCALEBY}))
    }

    const switchState = (checked) => {
        dispatch(reset({canvasstate: checked?'edit':'new'}))
        dispatch(newreset())
    }

    const switchHighlight = (checked) => {
        if (canvasstate==='edit'){
            let bb = bbmetadata.filter(metadata => checkedid.includes(metadata.id));
            dispatch(canvasupdate({highlight: checked, highlightbb: checked?bb:[]}))
        } else {
            let bb = displaynewbb.filter(metadata => checkedid.includes(metadata.id));
            dispatch(canvasupdate({highlight: checked, highlightbb: checked?bb:[]}))
        }
    }

    const switchImageState = async(checked) => {
        if (checked) {
            // let fileObj = await urltoFile(pageimages['original'], `temp.jpg`,'image/jpeg');
            // let url =  URL.createObjectURL(fileObj)
            dispatch(canvasupdate({imageurl: pageimages['original']}));
        } else {
            // let fileObj = await urltoFile(pageimages['preprocess'], `temp.jpg`,'image/jpeg');
            // let url =  URL.createObjectURL(fileObj)
            dispatch(canvasupdate({imageurl: pageimages['preprocess']}));
        }
        setImageState(checked);
    }

    const handleKeyDown = e => {
        // Xoá bounding box khi ấn delete/backspace
        if (e.keyCode === 8 || e.keyCode === 46) {
            if (selectedbbid !== null) {
                if (canvasstate==='new'){
                    let displaynewbbCopy = displaynewbb.filter(bb => bb.id !== selectedbbid)
                    if (type === 'line') {
                        let linemetaCopy = linemeta.filter(meta => meta.id !== selectedbbid)
                        dispatch(newupdate({displaynewbb: displaynewbbCopy, linemeta: linemetaCopy}))
                    }else{
                        let tablemetaCopy = tablemeta.filter(meta => meta.id !== selectedbbid)
                        dispatch(newupdate({displaynewbb: displaynewbbCopy, tablemeta: tablemetaCopy}))
                    }
                } else {
                    let textmetadataCopy = []
                    if (selectedbbid.includes('table')){
                        textmetadataCopy = textmetadata.filter(meta => meta.key !== selectedbbid)
                    } else {
                        let parentId = bbmetadata.filter(meta => meta.id === selectedbbid)[0].parent_id
                        let linesMeta = textmetadata.filter(meta => meta.key === parentId)[0].children
                        let linesMetaCopy = linesMeta.filter(
                            meta => meta.key !== selectedbbid
                        )
                        if (linesMetaCopy.length === 0){
                            textmetadataCopy = textmetadata.filter(
                                meta => meta.key !== parentId
                            )
                        }else{
                            textmetadataCopy = textmetadata.map(meta => {
                                if(meta.key === parentId) {
                                    return {...meta, children: linesMetaCopy}
                                }
                                return meta
                            })
                        }
                    }
                    const bbmetadataCopy = bbmetadata.filter(
                        meta => meta.id !== selectedbbid
                    )
                    dispatch(canvasupdate({bbmetadata: bbmetadataCopy, textmetadata: textmetadataCopy}))
                }
            }
        }
    };

    const handleSave = async() => {
        try {
            dispatch(loadingchange({loading: true, tip: "Save page changes..."}))
            let text_metadata = {};
            let table_metadata = [];
            for(let i = 0; i < bbmetadata.length; i++) {
                if (bbmetadata[i].type === 'line'){
                    if (!(bbmetadata[i].parent_id in text_metadata)){
                        text_metadata[bbmetadata[i].parent_id]=[]
                    }
                    let text = textmetadata.filter(metadata => metadata.key === bbmetadata[i].parent_id)[0].children.filter(metadata => metadata.key === bbmetadata[i].id)[0].text
                    text_metadata[bbmetadata[i].parent_id].push({
                        line_coordinates: [bbmetadata[i].x, bbmetadata[i].y, bbmetadata[i].width, bbmetadata[i].height], 
                        text: text
                    })
                } else {
                    let table_meta = textmetadata.filter(metadata => metadata.key === bbmetadata[i].parent_id)[0].metadata
                    table_metadata.push({
                        table_coordinate: [bbmetadata[i].x, bbmetadata[i].y, bbmetadata[i].width, bbmetadata[i].height], 
                        table_structure: table_meta
                    })
                }
            }
            let updated_metadata = {table_metadata: table_metadata, text_metadata: Object.values(text_metadata)}
            let metadataFileObj = new File([new Blob([JSON.stringify(updated_metadata)])], `page-${pageindex}-ocr.json`, {
                type: 'application/json',
            });
            let metadataFormData = new FormData();
            metadataFormData.append('location', `${document.userid}/${document.id}/metadata/${pageindex}`)
            metadataFormData.append('file', metadataFileObj);
            await FileService.upload(metadataFormData); 
            dispatch(loadingchange({loading: false, tip: `completed`}))
        } catch (error) {
            console.log(error)
            dispatch(loadingchange({loading: false, tip: `failed`}))
        }
    }

    return(
        <div className="ocredit component">
            <Row style={{ marginBottom: 8 }}>
                <Col span={24} type="flex" align="middle">
                    <Space size={20}>
                        <Button onClick = {zoomIn} disabled={disablemenu}>+</Button>
                        <Button onClick = {zoomOut} disabled={disablemenu}>-</Button>
                        <span>
                            <span>Image:</span>
                            <Switch 
                                style={{backgroundColor: imageState ? 'blue' : 'green'}}
                                checkedChildren="Original"
                                unCheckedChildren="Preprocess"
                                onChange={switchImageState}
                                checked={imageState}
                                disabled={disablemenu}
                            />
                        </span>
                        <span>
                            <span>Highlight:</span>
                            <Switch
                                onChange={switchHighlight}
                                checked={highlight}
                                disabled={disablemenu}
                            />
                        </span>
                        <span>
                            <span>State:</span>
                            <Switch 
                                style={{backgroundColor: canvasstate==='edit' ? 'blue' : 'green'}}
                                checkedChildren="Edit"
                                unCheckedChildren="New"
                                onChange={switchState}
                                checked={canvasstate==='edit'?true:false}
                                disabled={disablemenu}
                            />
                        </span>
                        <Button 
                            type='primary'
                            onClick={handleSave}
                            disabled={disablemenu}
                        >
                            Save changes
                        </Button>
                    </Space>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={4}>
                    <List
                        dataSource = {images}
                        renderItem={(item, idx) => {
                            return (
                                <Card
                                    hoverable
                                    key={idx} 
                                    cover={
                                        <Image
                                            src={item}
                                            preview={false}
                                            onClick = {() => handleImageClick(idx)}
                                        />}
                                    style={{margin: '10px'}}
                                >
                                    <Card.Meta description={`Page ${idx}`} />
                                </Card>
                            )
                        }}
                        className="content-section"
                    />
                </Col>
                <Col span={14}>
                    <div className="content-section" ref={ref} tabIndex={1} onKeyDown={handleKeyDown}>
                        <Canvas />
                    </div>
                </Col>
                <Col span={6}>
                    <div className="content-section">
                        {canvasstate==='edit'?<Label/>:<New/>}
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default OCREdit;