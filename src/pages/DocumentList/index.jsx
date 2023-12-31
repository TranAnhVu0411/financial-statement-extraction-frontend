import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { index } from "../../redux/features/document.slice";
import { List, message } from "antd";

const DocumentList = () => {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => ({ ...state.auth }));
    const { documents } = useSelector((state) => ({ ...state.document }));
    
    useEffect(() => {
        let values = {userid: user.account._id};
        dispatch(index({values, message}));
    }, [])
    return (
        <div className="component">
            <h1>Document list</h1>
            <List
                itemLayout="horizontal"
                dataSource={documents}
                renderItem={(item, index) => (
                    <List.Item>
                        <List.Item.Meta
                            title={<a href={`/edit?id=${item._id}`}>{item.documentname}</a>}
                            description={`Time: ${item.updatedAt}`}
                        />
                    </List.Item>
                )}
            />
        </div>
    )
}

export default DocumentList;