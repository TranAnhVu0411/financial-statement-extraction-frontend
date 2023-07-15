import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react'
import { Button, Space, Tag } from 'antd'
import TableEdit from '../TableEdit/index';
import { cropImageURL } from "../../../utils/imageCrop";
import { tableupdate } from "../../../redux/features/table.slice";

const NewTable = ({id}) => {
    const { displaynewbb, tablemeta } = useSelector((state) => ({ ...state.newbb }));
    const { pageimages } = useSelector((state) => ({ ...state.document }));
    const dispatch = useDispatch();
    const [openTableEdit, setOpenTableEdit] = useState(false);
    const handleClick = async(id) => {
        try{
            const tableCoordinate = displaynewbb.filter(meta => meta.id === id)[0]
            const url = await cropImageURL(pageimages['preprocess'], tableCoordinate)
            let updateTableObj = {imageurl: url}
            const tableStructure = tablemeta.filter(meta => meta.id === id)[0];
            console.log(tableStructure);
            if ('data' in tableStructure){
                updateTableObj.celldata = tableStructure.data.celldata; 
                updateTableObj.merge = tableStructure.data.merge;
                updateTableObj.rowlen = tableStructure.data.rowlen;
                updateTableObj.columnlen = tableStructure.data.columnlen;
                updateTableObj.row = tableStructure.data.row;
                updateTableObj.column = tableStructure.data.column;
            }
            dispatch(tableupdate(updateTableObj));
            setOpenTableEdit(true);
        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Space key={id} direction='vertical' style={{border: '1px solid rgba(140, 140, 140, 0.35)', padding: '5px'}}>
            <Tag color = "red">
                {`Table ${id}`}
            </Tag>
            <Button onClick={() => handleClick(id)}>Edit table</Button>
            {openTableEdit && (<TableEdit
                open={openTableEdit}
                onCancel={() => {
                    setOpenTableEdit(false);
                }}
                id={id}
            />)}
        </Space>
    )
}

export default NewTable;