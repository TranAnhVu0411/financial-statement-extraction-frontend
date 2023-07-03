import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const luckysheet = window.luckysheet;

const useDatasheet = () => {
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
  return { sheetRef, data };
};

export default useDatasheet;
