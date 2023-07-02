import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react'
import { Tree } from "antd";
import TreeTitle from "./TreeTitle"
import { canvasupdate } from "../../../redux/features/canvas.slice";

const Label = () => {
    const dispatch = useDispatch();
    const { textmetadata, bbmetadata, highlight } = useSelector((state) => ({ ...state.canvas }));
    const [treeData, setTreeData] = useState([]);
    useEffect(() => {
        let tempTree = []
        for (let i = 0; i < textmetadata.length; i++){
            let tempTreeObj = {
                title: <TreeTitle id={textmetadata[i].key} />, 
                key: textmetadata[i].key
            }
            if (textmetadata[i].children !== undefined){
                let tempChildren = []
                for (let j = 0; j < textmetadata[i].children.length; j++){
                    tempChildren.push({
                        title: <TreeTitle id={textmetadata[i].children[j].key} text={textmetadata[i].children[j].text}/>,
                        key: textmetadata[i].children[j].key
                    })
                }
                tempTreeObj.children = tempChildren
            }
            tempTree.push(tempTreeObj)
        }
        setTreeData(tempTree)
    },[textmetadata]);
    const onCheck = (checkedKeysValue) => {
        let bb = bbmetadata.filter(metadata => checkedKeysValue.includes(metadata.id));
        dispatch(canvasupdate({checkedid: checkedKeysValue, highlightbb: highlight?bb:[]}))
    };
    return(
        <Tree
            checkable
            treeData={treeData}
            onCheck={onCheck}
            defaultExpandParent={true}
            showLine={true}
            style={{padding: '10px'}}
        />
    )
}

export default Label;