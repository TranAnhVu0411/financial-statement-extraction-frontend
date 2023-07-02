

import { useDispatch, useSelector } from 'react-redux';
import { useState, useEffect } from 'react'
import { Divider, Select, Input, Button, Space, Typography, Checkbox, Tag } from 'antd'
import { newupdate } from '../../../redux/features/newbb.slice';
import { canvasupdate, reset } from '../../../redux/features/canvas.slice';

const New = () => {
    const { checkedid, highlight, textmetadata, bbmetadata, highlightbb } = useSelector((state) => ({ ...state.canvas }))
    const { displaynewbb, type, linemeta, createnewtextbox } = useSelector((state) => ({ ...state.newbb }));
    const dispatch = useDispatch();

    const  [isInsideSelect, setIsInsideSelect] = useState(false);
    const [textBoxHighlight, setTextBoxHighlight] = useState([])
    const [textBoxSelection, setTextBoxSelection] = useState(textmetadata.map(metadata => {return metadata.key}).filter(id => id.includes('text')))

    const onTypeChange = (value) => {
        dispatch(newupdate({type: value, displaynewbb: [], newbbmeta: [], linemeta: []}))
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
        dispatch(newupdate({createnewtextbox: e.target.checked}))
    }
    const onTextBoxSelect = (value) => {
        dispatch(newupdate({textboxid: value}))
    }

    const onSubmit = (values) => {
        console.log(values);
    };
    const onChange = (id, e) => {
        let newLineMeta = linemeta.map(line => {
            if (line.id === id) {
                return {...line, text: e.target.value};
            }
            return line;
        })
        dispatch(newupdate({linemeta: newLineMeta}))
    };
    const onCheck = (id, e) => {
        let newCheckedId = checkedid
        if (e.target.checked) {
            newCheckedId = [...checkedid, id]
        } else {
            newCheckedId = newCheckedId.filter(checkedId => checkedId !== id)
        }
        let bb = displaynewbb.filter(metadata => newCheckedId.includes(metadata.id));
        dispatch(canvasupdate({checkedid: newCheckedId, highlightbb: highlight?bb:[]}))
    };

    return (
        <Space direction='vertical' style={{margin: '10px'}}>
            <Space direction='vertical'>
                <Typography.Text>
                    Class type:
                </Typography.Text>
                <Select
                    placeholder="Select class type for bounding box"
                    allowClear
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
                                    allowClear
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
                            <Space key={line.id} direction='vertical' style={{border: '1px solid rgba(140, 140, 140, 0.35)', padding: '5px'}}>
                                <Tag color = "blue">
                                    {`Line ${line.id}`}
                                </Tag>
                                <Space direction='horizontal'>
                                    <Checkbox onChange={(e) => onCheck(line.id, e)}/>
                                    <Input.TextArea rows={2} defaultValue={line.text} onChange={(e) => onChange(line.id, e)}/>
                                </Space>
                            </Space>
                        )
                    })}
                </Space>
            ):null}
            <Button onClick={onSubmit}>Save</Button>
        </Space>
    )
}

export default New;
