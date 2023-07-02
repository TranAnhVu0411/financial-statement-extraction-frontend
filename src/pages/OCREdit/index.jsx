import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { loadimages, pageinfo } from "../../redux/features/document.slice";
import { canvasupdate, reset } from "../../redux/features/canvas.slice";
import { newupdate } from "../../redux/features/newbb.slice";
import { Card, Col, Row, message, List, Image, Button, Switch, Space } from "antd";
import './style.scss';
// import { urltoFile } from '../../utils/convertBase64ToFileObj';
import Canvas from "./Canvas/index";
import { json2tree } from "../../utils/json2tree";
import Label from "./Label/index";
import New from "./New/index";

const SCALEBY = 1.25;

const OCREdit = () => {
    const dispatch = useDispatch();
    const { images, document, metadata, pageimages } = useSelector((state) => ({ ...state.document }));
    const { width, height, scale, canvasstate, highlight, bbmetadata, checkedid, selectedbbid } = useSelector((state) => ({ ...state.canvas }));
    const { displaynewbb, linemeta } = useSelector((state) => ({ ...state.newbb }));
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
        dispatch(canvasupdate({imageurl: images[idx]}));
        dispatch(reset({canvasstate: 'edit'}));
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
                if (canvasstate === 'edit'){
                    const newRectangles = bbmetadata.filter(
                        rectangle => rectangle.id !== selectedbbid
                    );
                    dispatch(canvasupdate({bbmetadata: newRectangles}));
                } else {
                    const newRectangles = displaynewbb.filter(
                        rectangle => rectangle.id !== selectedbbid
                    );
                    const newLines = linemeta.filter(
                        line => line.id !== selectedbbid
                    );
                    dispatch(newupdate({displaynewbb: newRectangles, linemeta: newLines}));
                }
            }
        }
    };

    return(
        <div className="ocredit component">
            <Row style={{ marginBottom: 8 }}>
                <Col span={24} type="flex" align="middle">
                    <Space size={20}>
                        <Button onClick = {zoomIn}>+</Button>
                        <Button onClick = {zoomOut}>-</Button>
                        <span>
                            <span>Image:</span>
                            <Switch 
                                style={{backgroundColor: imageState ? 'blue' : 'green'}}
                                checkedChildren="Original"
                                unCheckedChildren="Preprocess"
                                onChange={switchImageState}
                                checked={imageState}
                            />
                        </span>
                        <span>
                            <span>Highlight:</span>
                            <Switch
                                onChange={switchHighlight}
                                checked={highlight}
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
                            />
                        </span>
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