import { Button, Popconfirm, message } from "antd"
import { useSelector, useDispatch } from "react-redux";
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import { useEffect, useState, useRef } from "react";
import luckysheet from "luckysheet";
import { toolbarConfig, rightClickConfig } from "./tableFunctionConfig"
import { tablereset } from "../../../redux/features/table.slice";
import { canvasupdate } from "../../../redux/features/canvas.slice";
import { newupdate } from "../../../redux/features/newbb.slice";

const TableEdit = ({ open, onCancel, id }) => {
    const [messageApi, contextHolder] = message.useMessage();
    const { imageurl, celldata, merge, rowlen, columnlen, row, column } = useSelector((state) => ({ ...state.table }));
    const { textmetadata, canvasstate } = useSelector((state) => ({ ...state.canvas }));
    const { tablemeta } = useSelector((state) => ({ ...state.newbb }));
    const dispatch = useDispatch();
    // Nếu là edit, lấy thông tin bảng từ table
    // Nếu là new, cho bảng trống
    const [data, setData] = useState(
        celldata.length !== 0 ?
        JSON.parse(JSON.stringify([{
            name: "Table", //Worksheet name
            index: 0,
            status: "1", //Worksheet active status,
            order: "0",
            row: row,
            column: column,
            config: {
                merge: merge,
                columnlen: columnlen,
                rowlen: rowlen,
            },
            celldata: celldata,
            scrollLeft: 0,
            scrollTop: 0,
            zoomRatio: 1,
        }])) : 
        JSON.parse(JSON.stringify([{
            name: "Table", //Worksheet name
            index: 0,
            status: "1", //Worksheet active status,
            order: "0",
            row: 36,
            column: 18,
            config: {
                merge: {},
                columnlen: {},
                rowlen: {},
            },
            celldata: [],
            scrollLeft: 0,
            scrollTop: 0,
            zoomRatio: 1,
        }]))
    )

    const sheetRef = useRef();
    const sheetId = 'table_container';
    useEffect(() => {
        const sheetElement = sheetRef.current;
        if (sheetElement) {
            sheetElement.setAttribute("id", sheetId);
            luckysheet.create({
                container: sheetId,
                gridKey: sheetId,
                showsheetbar: false,
                showinfobar: false,
                showtoolbar: false,
                showtoolbarConfig: toolbarConfig,
                cellRightClickConfig: rightClickConfig,
                enableAddRow: false,
                enableAddBackTop: false,
                data: data,
                hook: {
                updated: () => {
                    const sheetJson = luckysheet.toJson();
                    setData(sheetJson.data);
                }
                },
                defaultFontSize: 11,
            });
        }
    }, [open]);

    const handleCancel = () => {
        luckysheet.exitEditMode();
        onCancel();
    }

    const handleSave = () => {
        // Nếu state đang là edit, lưu toàn bộ thông tin bảng vào textmetadata của canvas slice
        if (data[0].celldata.length !== 0){
            if (canvasstate === 'edit'){
                let saveStructure = {
                    celldata: data[0].celldata,
                    merge: data[0].config.merge,
                    rowlen: data[0].config.rowlen,
                    columnlen: data[0].config.columnlen,
                    row: data[0].row,
                    column: data[0].column
                }
                let textmetadataCopy = textmetadata.map(metadata => {
                    if (metadata.key === id){
                        return {
                            key: id,
                            type: 'table',
                            metadata: saveStructure
                        }
                    }
                    return metadata
                });
                dispatch(canvasupdate({textmetadata: textmetadataCopy}))
            }
            // Nếu state là new, lưu toàn bộ thông tin bảng vào tablemeta của newbb slice
            else {
                    let saveStructure = {
                        celldata: data[0].celldata,
                        merge: data[0].config.merge===undefined ? {} : data[0].config.merge,
                        rowlen: data[0].config.rowlen===undefined ? {} : data[0].config.merge,
                        columnlen: data[0].config.columnlen===undefined ? {} : data[0].config.columnlen,
                        // Lấy row và column theo celldata
                        row: data[0].celldata.reduce((max, obj) => {
                            return obj.r > max ? obj.value : max;
                        }, Number.NEGATIVE_INFINITY)+1,
                        column: data[0].celldata.reduce((max, obj) => {
                            return obj.c > max ? obj.value : max;
                        }, Number.NEGATIVE_INFINITY)+1,
                    }
                    let tablemetaCopy = tablemeta.map(metadata => {
                        if (metadata.id === id){
                            return {
                                id: id,
                                data: saveStructure
                            }
                        }
                        return metadata
                    });
                    dispatch(newupdate({tablemeta: tablemetaCopy}))
            }
            dispatch(tablereset())
            handleCancel()
        } else {
            messageApi.open({
                type: 'warning',
                content: 'Please add data to table',
            });
        }
    }

    if (!open) return null;
    return(
        <div 
            style={{
                position: 'fixed', 
                left: 0, 
                right: 0, 
                top: 0, 
                bottom: 0, 
                background: "rgba(0, 0, 0, 0.3)",
                display: 'flex', 
                justifyContent: 'center',
                alignItems: 'center',
                padding: '10px',
                zIndex: 1000,
            }}
        >
            {contextHolder}
            <div
                style={{
                    flexDirection: 'column', 
                    background: "rgb(255, 255, 255)",
                    padding: '10px',
                    borderRadius: '10px',
                }}
            >
                <div
                    style={{
                        display: 'flex', 
                        flexDirection: 'row', 
                        gap: '10px',
                        width: '1200px',
                        height: '500px',
                    }}
                >
                    <div
                        style={{
                            width: '40%',
                            height: '100%',
                            position: "relative",
                            overflow: "hidden",
                            border: '1px solid black',
                            backgroundColor: '#D3D3D3',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <ReactPanZoom
                            image={imageurl}
                            alt="table image"
                        />
                    </div>
                    <div
                        style={{
                            width: '60%',
                            height: '100%',
                            position: "relative",
                            overflow: "hidden",
                            border: '1px solid black',
                            backgroundColor: '#D3D3D3',
                        }}
                        ref={sheetRef}
                    >
                    </div>
                </div>
                <div
                    style={{
                        display: 'flex', 
                        flexDirection: 'row', 
                        gap: '10px',
                        justifyContent: 'flex-end',
                        marginTop: '10px',
                    }}
                >
                    <Popconfirm
                        title="Close..."
                        description={
                            <>
                                Save change?<br />
                                Your changes will be lost if you don't save them.
                            </>
                        }
                        onConfirm={() => {
                            handleSave()
                        }}
                        onCancel={handleCancel}
                        okText="Yes"
                        cancelText="No"
                    >
                        <Button>Close</Button>
                    </Popconfirm>
                </div>
            </div>
        </div>     
    )
}

export default TableEdit;
