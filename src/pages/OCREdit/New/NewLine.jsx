import { useSelector, useDispatch } from 'react-redux';
import { Input, Space, Checkbox, Tag } from 'antd'
import { newupdate } from '../../../redux/features/newbb.slice';
import { canvasupdate } from '../../../redux/features/canvas.slice';

const NewLine = ({id, text}) => {
    const { checkedid, highlight } = useSelector((state) => ({ ...state.canvas }));
    const { displaynewbb, linemeta } = useSelector((state) => ({ ...state.newbb }));

    const dispatch = useDispatch();

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

    const onChange = (id, e) => {
        let newLineMeta = linemeta.map(line => {
            if (line.id === id) {
                return {...line, text: e.target.value};
            }
            return line;
        })
        dispatch(newupdate({linemeta: newLineMeta}))
    };
    return (
        <Space key={id} direction='vertical' style={{border: '1px solid rgba(140, 140, 140, 0.35)', padding: '5px'}}>
            <Tag color = "blue">
                {`Line ${id}`}
            </Tag>
            <Space direction='horizontal'>
                <Checkbox onChange={(e) => onCheck(id, e)}/>
                <Input.TextArea rows={2} defaultValue={text} onChange={(e) => onChange(id, e)}/>
            </Space>
        </Space>
    )
}

export default NewLine;