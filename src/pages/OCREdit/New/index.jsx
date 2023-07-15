import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { Divider, Select, Button, Space, Typography, Checkbox, message } from 'antd'
import { newreset, newupdate } from '../../../redux/features/newbb.slice';
import { canvasupdate, reset } from '../../../redux/features/canvas.slice';
import NewLine from './NewLine';
import NewTable from './NewTable';
import {v4 as uuidv4} from "uuid";

const New = () => {
    const [messageApi, contextHolder] = message.useMessage();
    const { highlight, textmetadata, bbmetadata, highlightbb } = useSelector((state) => ({ ...state.canvas }))
    const { type, linemeta, createnewtextbox, textboxid, tablemeta, displaynewbb } = useSelector((state) => ({ ...state.newbb }));
    const dispatch = useDispatch();

    const  [isInsideSelect, setIsInsideSelect] = useState(false);

    // Phục vụ cho hiển thị highlight text box khi hover
    const [textBoxHighlight, setTextBoxHighlight] = useState([])
    const [textBoxSelection, setTextBoxSelection] = useState(textmetadata.map(metadata => {return metadata.key}).filter(id => id.includes('text')))

    const onTypeChange = (value) => {
        dispatch(newupdate({type: value, displaynewbb: [], newbbmeta: [], linemeta: [], tablemeta: []}))
        dispatch(reset({canvasstate: 'new'}))
    };

    useEffect(() => {
        if (!isInsideSelect){
            if (highlight) {
                let removeHighlightBoxId = textBoxHighlight.map(metadata => {return metadata.id});
                let highlightBox = highlightbb.filter(metadata => !removeHighlightBoxId.includes(metadata.id));
                dispatch(canvasupdate({highlightbb: highlightBox}))
                setTextBoxHighlight([])
            }
        }
    }, [isInsideSelect])
    const onEnter = (e) => {
        if (highlight) {
            let newHighlightBox = bbmetadata.filter(metadata => metadata.parent_id === e.target.innerText);
            let removeHighlightBoxId = textBoxHighlight.map(metadata => {return metadata.id});
            let highlightBox = [...highlightbb.filter(metadata => !removeHighlightBoxId.includes(metadata.id)), ...newHighlightBox];
            setTextBoxHighlight(newHighlightBox)
            dispatch(canvasupdate({highlightbb: highlightBox}))
        }
    }
    const onCreateOption = (e) => {
        let change = {createnewtextbox: e.target.checked}
        if (e.target.checked){
            change.textboxid = ''
        }
        dispatch(newupdate(change))
    }
    const onTextBoxSelect = (value) => {
        dispatch(newupdate({textboxid: value}))
    }

    const onSubmit = () => {
        let textmetadataCopy = [];
        let bbmetadataCopy = [];
        if (type==='line') {
            let children = linemeta.map(meta => {
                return {
                    key: `line-${meta.id}`,
                    type: 'line',
                    text: meta.text
                }
            })
            if (createnewtextbox){
                let textid = `text-${uuidv4()}`;
                let newtextmetadata = {
                    key: textid,
                    type: 'text',
                    children: children
                };
                let newbbmetadata = displaynewbb.map(bb => {
                    return {
                        x: bb.x, 
                        y: bb.y, 
                        width: bb.width, 
                        height: bb.height,
                        id: `line-${bb.id}`,
                        parent_id: textid,
                        type: 'line',
                    }
                });
                textmetadataCopy = [...textmetadata, newtextmetadata];
                bbmetadataCopy = [...bbmetadata, ...newbbmetadata];
                dispatch(canvasupdate({textmetadata: textmetadataCopy, bbmetadata: bbmetadataCopy}));
                dispatch(reset({canvasstate: 'edit'}));
                dispatch(newreset());
            }else{
                if (textboxid===''){
                    messageApi.open({
                        type: 'warning',
                        content: 'Please set text box id',
                    });
                } else {
                    let linesMeta = textmetadata.filter(meta => meta.key === textboxid)[0].children.concat(children)
                    textmetadataCopy = textmetadata.map(meta => {
                        if(meta.key === textboxid) {
                            return {...meta, children: linesMeta}
                        }
                        return meta
                    })
                    let newbbmetadata = displaynewbb.map(bb => {
                        return {
                            x: bb.x, 
                            y: bb.y, 
                            width: bb.width, 
                            height: bb.height,
                            id: `line-${bb.id}`,
                            parent_id: textboxid,
                            type: 'line',
                        }
                    });
                    bbmetadataCopy = [...bbmetadata, ...newbbmetadata];
                    dispatch(canvasupdate({textmetadata: textmetadataCopy, bbmetadata: bbmetadataCopy}));
                    dispatch(reset({canvasstate: 'edit'}));
                    dispatch(newreset());
                }
            }
        } else {
            const allTableHaveData = tablemeta.every(meta => meta.hasOwnProperty('data'));
            if (allTableHaveData){
                let newbbmetadata = displaynewbb.map(bb => {
                    return {
                        x: bb.x, 
                        y: bb.y, 
                        width: bb.width, 
                        height: bb.height,
                        id: `table-${bb.id}`,
                        parent_id: `table-${bb.id}`,
                        type: 'table',
                    }
                });
                bbmetadataCopy = [...bbmetadata, ...newbbmetadata];
                let newtablemetadata = tablemeta.map(meta => {
                    return {
                        key: `table-${meta.id}`,
                        type: 'table',
                        metadata: meta.data
                    }
                })
                textmetadataCopy = [...textmetadata, ...newtablemetadata];
                dispatch(canvasupdate({textmetadata: textmetadataCopy, bbmetadata: bbmetadataCopy}));
                dispatch(reset({canvasstate: 'edit'}));
                dispatch(newreset());
            }else{
                messageApi.open({
                    type: 'warning',
                    content: 'Please edit all tables',
                });
            }
        }
    };

    return (
        <Space direction='vertical' style={{margin: '10px'}}>
            {contextHolder}
            <Space direction='vertical'>
                <Typography.Text>
                    Class type:
                </Typography.Text>
                <Select
                    placeholder="Select class type for bounding box"
                    onChange={onTypeChange}
                >
                    <Select.Option value="line">Line</Select.Option>
                    <Select.Option value="table">Table</Select.Option>
                </Select>
            </Space>
            <Divider />
            {type === 'line' ? (
                <Space direction='vertical' size='middle'>
                    <Space direction='vertical'>
                        <Space>
                            <Typography.Text>
                                Text box info:
                            </Typography.Text>
                            <Checkbox onChange={onCreateOption} defaultChecked={createnewtextbox}>Create new text box</Checkbox>
                        </Space>
                        {!createnewtextbox?(
                            <Space direction='vertical'>
                                <Typography.Text>
                                    Choose existed text box:
                                </Typography.Text>
                                <Select
                                    placeholder="Select text box"
                                    onChange={onTextBoxSelect}
                                    onMouseEnter = {() => setIsInsideSelect(true)}
                                    onMouseLeave = {() => setIsInsideSelect(false)}
                                >
                                    {
                                        textBoxSelection.map(id => {
                                            return (<Select.Option value={id} onMouseEnter={onEnter}>{id}</Select.Option>)
                                        })
                                    }
                                </Select>
                            </Space>) : 
                            null
                        }
                    </Space>
                    <Divider />
                    <Typography.Text>
                        Text line info:
                    </Typography.Text>
                    {linemeta.map(line => {
                        return (
                            <NewLine id={line.id} text={line.text}/>
                        )
                    })}
                </Space>
            ):
            type==='table' ? (
                <Space direction='vertical' size='middle'>
                    <Typography.Text>
                        Table info:
                    </Typography.Text>
                    {tablemeta.map(table => {
                        return (
                            <NewTable id={table.id}/>
                        )
                    })}
                </Space>
            ):
            null}
            <Button onClick={onSubmit}>Save</Button>
        </Space>
    )
}

export default New;
