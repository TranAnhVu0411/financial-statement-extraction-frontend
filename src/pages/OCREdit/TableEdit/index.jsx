import { Modal, Space } from "antd"
import { useSelector } from "react-redux";
import ReactPanZoom from 'react-image-pan-zoom-rotate';
import { useEffect, useState, useRef } from "react";
// import { Workbook } from "@fortune-sheet/react";
// import "@fortune-sheet/react/dist/index.css"
import luckysheet from "luckysheet";
import useDatasheet from "./useDatasheet";

const TableEdit = ({ open, onCancel, id }) => {
    const { imageurl } = useSelector((state) => ({ ...state.table }));
    const { sheetRef } = useDatasheet();

    return(
        <Modal
            open={open} 
            bodyStyle={{
                height: '500px',
                display: 'flex', 
                flexDirection: 'row', 
                gap: '10px'
            }}
            width={2000}
            okText="Save"
            cancelText="Cancel"
            onCancel={onCancel}
            closable={false}
        >
            <div
                style={{
                    width: '50%',
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
                    width: '50%',
                    // height: '100%',
                    position: "relative",
                    overflow: "hidden",
                    border: '1px solid black',
                    backgroundColor: '#D3D3D3'
                }}
                ref={sheetRef}
            >
                {/* <Workbook
                    data={data}
                    toolbarItems={["undo","redo","merge-cell"]}
                    showSheetTabs={false}
                    cellContextMenu={["copy",
                    "paste",
                    "|",
                    "insert-row",
                    "insert-column",
                    "delete-row",
                    "delete-column",]}
                /> */}
            </div>
        </Modal>
    )
}

export default TableEdit;