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
    // const { sheetRef } = useDatasheet();
    const { celldata, merge, rowlen, columnlen } = useSelector((state) => ({ ...state.table }));

    const [data, setData] = useState([{
        name: "Table", //Worksheet name
        index: 0,
        status: "1", //Worksheet active status,
        order: "0",
        row: Object.keys(rowlen).length,
        column: Object.keys(columnlen).length,
        config: {merge: merge, rowlen: rowlen, columnlen: columnlen},
        celldata: celldata,
        scrollLeft: 0,
        scrollTop: 0,
        zoomRatio: 1,
    }]);
  
  const sheetRef = useRef();
  const sheetId = 'xxxxxxxxx';
  useEffect(() => {
        const sheetElement = sheetRef.current;
        console.log('sheetElement', sheetElement)
        if (sheetElement) {
            sheetElement.setAttribute("id", sheetId);
            luckysheet.create({
                container: sheetId,
                gridKey: sheetId,
                data,
                // hook: {
                //   updated: () => {
                //     const sheetJson = luckysheet.toJson();
                //     setData(sheetJson.data);
                //   }
                // }
            });
    }
  }, [data]);

    return(
        <div style={{position: 'fixed', left: 0, right: 0, top: 0, bottom: 0, background: "rgba(0, 0, 0, 0.3)"}}>
            <button onClick={onCancel} type="button">Close</button>
            <div
                // style={{
                //     width: '50%',
                //     // height: '100%',
                //     position: "relative",
                //     overflow: "hidden",
                //     border: '1px solid black',
                //     backgroundColor: '#D3D3D3'
                // }}
                id='xxxxxxxxx'
                ref={sheetRef}
            >
            </div>
        </div>  
        // <Modal
        //     open={open} 
        //     bodyStyle={{
        //         height: '500px',
        //         display: 'flex', 
        //         flexDirection: 'row', 
        //         gap: '10px'
        //     }}
        //     width={2000}
        //     okText="Save"
        //     cancelText="Cancel"
        //     onCancel={onCancel}
        //     closable={false}
        // >
        //     <div
        //         style={{
        //             width: '50%',
        //             height: '100%',
        //             position: "relative",
        //             overflow: "hidden",
        //             border: '1px solid black',
        //             backgroundColor: '#D3D3D3',
        //             display: 'flex',
        //             justifyContent: 'center',
        //             alignItems: 'center',
        //         }}
        //     >
        //         <ReactPanZoom
        //             image={imageurl}
        //             alt="table image"
        //         />
        //     </div>
            // <div
            //     style={{
            //         width: '50%',
            //         // height: '100%',
            //         position: "relative",
            //         overflow: "hidden",
            //         border: '1px solid black',
            //         backgroundColor: '#D3D3D3'
            //     }}
            //     ref={sheetRef}
            // >
            // </div>
        // </Modal>
    )
}

export default TableEdit;
