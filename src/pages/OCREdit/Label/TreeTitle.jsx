import { useSelector, useDispatch } from "react-redux";
import { Space, Tag, Typography, Popover, Button} from "antd";
import { CheckOutlined, HighlightOutlined } from '@ant-design/icons';
import { useState } from 'react';
import TableEdit from '../TableEdit/index'
import { cropImageURL } from "../../../utils/imageCrop";
import { tableupdate } from "../../../redux/features/table.slice";
import { canvasupdate } from "../../../redux/features/canvas.slice";

const { Paragraph } = Typography;

const TreeTitle = (props) => {
    const [openTableEdit, setOpenTableEdit] = useState(false);
    const { textmetadata, bbmetadata } = useSelector((state) => ({ ...state.canvas }));
    const { pageimages } = useSelector((state) => ({ ...state.document }));
    const dispatch = useDispatch();

    let type = "";
    if (props.id.includes('line')){
        type = "line";
    } else if (props.id.includes('text')){
        type = "text"
    } else {
        type = "table";
    }

    const handleLineChange = (value) => {
        let parentId = bbmetadata.filter(meta => meta.id === props.id)[0].parent_id
        let linesMeta = textmetadata.filter(meta => meta.key === parentId)[0].children
        let linesMetaCopy = linesMeta.map(meta => {
            if (meta.key === props.id) {
                return {...meta, text: value}
            }
            return meta
        })
        let textmetadataCopy = textmetadata.map(meta => {
            if(meta.key === parentId) {
                return {...meta, children: linesMetaCopy}
            }
            return meta
        })
        dispatch(canvasupdate({textmetadata: textmetadataCopy}))
    }

    const handleClick = async(id) => {
        try{
            // Lấy thông tin bảng từ textmetadata trong canvas slice chuyển vào table slice
            const tableStructure = textmetadata.filter(meta => meta.key === id)[0].metadata;
            const tableCoordinate = bbmetadata.filter(meta => meta.id === id)[0]
            const url = await cropImageURL(pageimages['preprocess'], tableCoordinate)
            console.log(tableStructure)
            dispatch(tableupdate({
                imageurl: url, 
                celldata: tableStructure.celldata, 
                merge: tableStructure.merge,
                rowlen: tableStructure.rowlen,
                columnlen: tableStructure.columnlen,
                row: tableStructure.row,
                column: tableStructure.column
            }))
            setOpenTableEdit(true)
        } catch (e) {
            console.log(e)
        }
    }
    if (type === "text"){
        return (
            <Popover content={props.id}>
                <Tag className="title-tag" color = "green">
                    {/* {type === "text" ? `Text box ${props.id}` : `Table box ${props.id}`} */}
                    {props.id}
                </Tag>
            </Popover>
        )
    } else if (type === "table") {
        return (
            <Space align="start" size={0}>
                <Popover content={props.id}>
                    <Tag className="title-tag" color = "red">
                        {/* {type === "text" ? `Text box ${props.id}` : `Table box ${props.id}`} */}
                        {props.id}
                    </Tag>
                </Popover>
                <Popover content='Edit table'>
                    <Button type="link" shape="circle" icon={<HighlightOutlined />} size='small' onClick={() => {handleClick(props.id)}} />
                </Popover>
                {openTableEdit && (<TableEdit
                    open={openTableEdit}
                    onCancel={() => {
                        setOpenTableEdit(false);
                    }}
                    id={props.id}
                />)}
            </Space>
        )
    } 
    else {
        return (
            <Space direction="vertical" size="middle">
                <Popover content={props.id}>
                    <Tag className="title-tag" color = "blue">
                        {/* {`Line ${props.id}`} */}
                        {props.id}
                    </Tag>
                </Popover>
                <Paragraph
                    editable={{
                        icon: <HighlightOutlined />,
                        tooltip: 'click to edit text',
                        enterIcon: <CheckOutlined />,
                        onChange: handleLineChange,
                    }}
                >
                    {props.text}
                </Paragraph>
            </Space>
        )
    }
}

export default TreeTitle;