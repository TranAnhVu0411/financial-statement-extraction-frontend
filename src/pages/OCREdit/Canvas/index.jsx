import { useDispatch, useSelector } from "react-redux";
import {v4 as uuidv4} from "uuid";
import { Stage, Layer } from "react-konva";
import PageImage from "./PageImage";
import Rectangle from "./Rectangle";
import { canvasupdate } from "../../../redux/features/canvas.slice";
import { newupdate } from "../../../redux/features/newbb.slice";
import { message } from 'antd'

const Canvas = () => {
    const { width, height, orgwidth, orgheight, scale, bbmetadata, canvasstate, selectedbbid, highlightbb } = useSelector((state) => ({ ...state.canvas }));
    const { displaynewbb, newbbmeta, type, linemeta } = useSelector((state) => ({ ...state.newbb }));
    
    let dispatch = useDispatch()
    const handleMouseDown = e => {
        if (canvasstate==='new'){
            if (type===''){
                message.warning('Please select class type')
            } else {
                if (e.target.constructor.name === 'Image' || e.target.constructor.name === 'Rect'){
                    if (
                        (newbbmeta.length === 0) && 
                        // (displaynewbb.length === 0)
                        ((type==='table' && displaynewbb.length === 0) || (type==='line'))
                    ){
                        const { x, y } = e.target.getStage().getRelativePointerPosition();
                        const id = uuidv4();
                        dispatch(newupdate({newbbmeta: [{ x: x, y: y, width: 0, height: 0, id: id, type: 'new' }]}));
                    }
                }
            }
        }
    };
    
    const handleMouseUp = e => {
        if (canvasstate==='new'){
            if (newbbmeta.length === 1) {
                const sx = newbbmeta[0].x;
                const sy = newbbmeta[0].y;
                const { x, y } = e.target.getStage().getRelativePointerPosition();
                const id = uuidv4();
                const rectangleToAdd = {
                    x: sx,
                    y: sy,
                    width: x - sx,
                    height: y - sy,
                    id: id,
                    type: 'new'
                };
                if (rectangleToAdd.width===0 || rectangleToAdd.height===0){
                    dispatch(newupdate({newbbmeta: []}));
                }else{
                    dispatch(newupdate({newbbmeta: [], displaynewbb: type=='table'?[rectangleToAdd]:[...displaynewbb, rectangleToAdd]}));
                    if (type === 'line') {
                        dispatch(newupdate({linemeta: [...linemeta, {id: id, text: ''}]}))
                    }
                }
            }
        }
    };
    
    const handleMouseMove = e => {
        if (canvasstate==='new'){
            if (newbbmeta.length === 1) {
                const sx = newbbmeta[0].x;
                const sy = newbbmeta[0].y;
                const { x, y } = e.target.getStage().getRelativePointerPosition();
                const id = uuidv4();
                const rectangleToAdd = {
                    x: sx,
                    y: sy,
                    width: x - sx,
                    height: y - sy,
                    id: id,
                    type: 'new'
                };
                dispatch(newupdate({newbbmeta: [rectangleToAdd]}));
            }
        }
    };

    const handleMouseEnter = e => {
        e.target.getStage().container().style.cursor = "crosshair";
    };

    return(
        <Stage
            scaleX={scale}
            scaleY={scale}
            width={width} 
            height={height}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
        >
            <Layer>
                <PageImage/>
                {/* Phần Highlight */}
                {highlightbb.map((rect, i) => {
                    return (
                        <Rectangle
                            key={`highlight-${i}`}
                            shapeProps={rect}
                            isSelected={rect.id === selectedbbid}
                            canvasMeasures = {{width: width, height: height}}
                            originalMeasures={{width: orgwidth, height: orgheight}}
                            edit={false}
                            color={rect.type=='line'?'rgba(0, 0, 255, 0.3)':rect.type=='table'?'rgba(255, 0, 0, 0.3)':'rgba(0, 255, 0, 0.3)'}
                            type='highlight'
                        />
                    );
                })}
                {/* Phần Edit */}
                {bbmetadata.map((rect, i) => {
                    return (
                        <Rectangle
                            key={`display-${i}`}
                            shapeProps={rect}
                            isSelected={rect.id === selectedbbid}
                            onSelect={() => {
                                dispatch(canvasupdate({selectedbbid: rect.id}));
                            }}
                            onChange={(newAttrs) => {
                                const rects = bbmetadata.slice();
                                rects[i] = newAttrs;
                                let change = {bbmetadata: rects}
                                if (highlightbb.filter(bb => bb.id === newAttrs.id).length > 0) {
                                    change.highlightbb = highlightbb.map(bb => {
                                        if (bb.id === newAttrs.id) {
                                            return newAttrs
                                        }
                                        return bb
                                    })
                                }
                                // dispatch(canvasupdate({bbmetadata: rects}));
                                dispatch(canvasupdate(change))
                            }}
                            canvasMeasures = {{width: width, height: height}}
                            originalMeasures={{width: orgwidth, height: orgheight}}
                            edit={canvasstate==='edit'?true:false}
                            color={rect.type=='line'?'blue':'red'}
                            type='boundingbox'
                        />
                    );
                })}
                {/* Phần New */}
                {displaynewbb.concat(newbbmeta).map((rect, i) => {
                    return (
                        <Rectangle
                            key={`new-${i}`}
                            shapeProps={rect}
                            isSelected={rect.id === selectedbbid}
                            onSelect={() => {
                                dispatch(canvasupdate({selectedbbid: rect.id}));
                            }}
                            onChange={(newAttrs) => {
                                const rects = newbbmeta.slice();
                                rects[i] = newAttrs;
                                dispatch(newupdate({displaynewbb: rects}));
                            }}
                            canvasMeasures = {{width: width, height: height}}
                            originalMeasures={{width: orgwidth, height: orgheight}}
                            edit={canvasstate==='new'?true:false}
                            color={'black'}
                            type='boundingbox'
                        />
                    );
                })}
            </Layer>
        </Stage>
    )
}

export default Canvas;