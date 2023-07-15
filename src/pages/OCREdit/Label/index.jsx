import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from 'react'
import { Tree } from "antd";
import TreeTitle from "./TreeTitle"
import { canvasupdate } from "../../../redux/features/canvas.slice";

const Label = () => {
    const dispatch = useDispatch();
    const { textmetadata, bbmetadata, highlight } = useSelector((state) => ({ ...state.canvas }));
    const [treeData, setTreeData] = useState([]);
    const [expandedKeys, setExpandedKeys] = useState([])
    useEffect(() => {
        let tempTree = []
        let tempExpandedKeys = []
        for (let i = 0; i < textmetadata.length; i++){
            let tempTreeObj = {
                title: <TreeTitle id={textmetadata[i].key} />, 
                key: textmetadata[i].key
            }
            if (textmetadata[i].type==='text'){
                tempExpandedKeys.push(textmetadata[i].key)
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
        setExpandedKeys(tempExpandedKeys)
    },[textmetadata]);
    const onCheck = (checkedKeysValue) => {
        let filterCheckedKeysValue = checkedKeysValue.filter(checkedKey => !checkedKey.includes('text'))
        let bb = bbmetadata.filter(metadata => filterCheckedKeysValue.includes(metadata.id));
        dispatch(canvasupdate({checkedid: filterCheckedKeysValue, highlightbb: highlight?bb:[]}))
    };     

    const onDrop = (value) => {
        const dragNodeKey = value.dragNode.key; // Key của drag node (Line)
        const dropNodeKey = value.node.key; // Key của drop node (Text)
        if (dragNodeKey.includes('line') && dropNodeKey.includes('text')){
            let dropNodeChildren = textmetadata.filter(meta => meta.key === dropNodeKey)[0].children;
            // Nếu Drag Line không phải là con của Drop Text
            if (dropNodeChildren.filter(child => child.key === dragNodeKey).length===0){
                console.log("Dropping process")
                // Lấy thông tin bounding box trước khi chuyển đổi để lấy Text key của Drag Line
                let oldDragNodeBb = bbmetadata.filter(bb => bb.id === dragNodeKey)[0];
                let oldDragNodeParentId = oldDragNodeBb.parent_id;
                // Cập nhật lại parent_id của Drag Line trong bb metadata
                let newbbmetadata = bbmetadata.map(bb => {
                    if (bb.id===dragNodeKey){
                        return {...bb, parent_id: dropNodeKey}
                    }
                    return bb
                })
                // Lấy thông tin children (anh em) của Line Drag trong Text cũ
                let dragNodeSiblings = textmetadata.filter(meta => meta.key === oldDragNodeParentId)[0].children;
                // Lấy thông tin của Drag Line
                let dragNodeInfo = dragNodeSiblings.filter(meta => meta.key === dragNodeKey).slice()[0];
                // Cập nhật lại children của Text cũ
                let newDragNodeSiblings = dragNodeSiblings.filter(meta => meta.key !== dragNodeKey);
                // Cập nhật lại children của Drop Text
                let newDropNodeChildren = [...dropNodeChildren, dragNodeInfo];
                console.log(newDropNodeChildren)
                // Cập nhật lại metadata
                let newtextmetadata = []
                // Nếu sau khi cập nhật lại children của Text cũ mà số lượng children = 0
                // Loại bỏ Text cũ
                if (newDragNodeSiblings.length !== 0){
                    newtextmetadata = textmetadata.map(meta => {
                        if (meta.key === oldDragNodeParentId) {
                            return {...meta, children: newDragNodeSiblings}
                        }else if (meta.key === dropNodeKey){
                            return {...meta, children: newDropNodeChildren}
                        }
                        return meta
                    })
                }else{
                    newtextmetadata = textmetadata.map(meta => {
                        if (meta.key === dropNodeKey){
                            return {...meta, children: newDropNodeChildren}
                        }
                        return meta
                    })
                    newtextmetadata = newtextmetadata.filter(meta => meta.key !== oldDragNodeParentId)
                }
                dispatch(canvasupdate({bbmetadata: newbbmetadata, textmetadata: newtextmetadata}))
            }
        }
    }
    
    return(
        <Tree
            expandedKeys={expandedKeys}
            onExpand={expanded => setExpandedKeys([...expanded])}
            checkable
            onCheck={onCheck}
            showLine={true}
            draggable
            onDrop = {onDrop}
            treeData={treeData}
            style={{padding: '10px'}}
        />
    )
}

export default Label;