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
    row: 2,
    column: 10,
    config: {
        merge: {
            "0_0": { r: 0, c: 0, rs: 2, cs: 1 },
            "0_1": { r: 0, c: 1, rs: 1, cs: 4 }
        },
        columnlen: { "0": 113 },
        rowlen: { "0": 25, "1": 26 },
    },
    celldata: [
        {
          r: 0,
          c: 0,
          v: {
            m: "Học Sinh",
            ct: { fa: "General", t: "g" },
            v: "Học Sinh",
            mc: { r: 0, c: 0, rs: 2, cs: 1 },
            bl: 1,
            ht: "0",
            bg: "#9fc5e8"
          }
        },
        {
          r: 0,
          c: 1,
          v: {
            lo: 1,
            m: "Tiền ăn",
            ct: { fa: "General", t: "g" },
            v: "Tiền ăn",
            mc: { r: 0, c: 1, rs: 1, cs: 4 },
            vt: "0",
            ht: "0",
            bl: 1,
            bg: "#9fc5e8"
          }
        },
        {
          r: 0,
          c: 2,
          v: { mc: { r: 0, c: 1 }, vt: "0", ht: "0", bl: 1, bg: "#9fc5e8" }
        },
        {
          r: 0,
          c: 3,
          v: { mc: { r: 0, c: 1 }, vt: "0", ht: "0", bl: 1, bg: "#9fc5e8" }
        },
        {
          r: 0,
          c: 4,
          v: { mc: { r: 0, c: 1 }, vt: "0", ht: "0", bl: 1, bg: "#9fc5e8" }
        },
        { r: 0, c: 5, v: { v: null, bg: "#9fc5e8" } },
        { r: 0, c: 6, v: { v: null, bg: "#9fc5e8" } },
        { r: 0, c: 7, v: { v: null, bg: "#9fc5e8" } },
        { r: 0, c: 8, v: { v: null, bg: "#9fc5e8" } },
        { r: 0, c: 9, v: { v: null, bg: "#9fc5e8" } },
        { r: 1, c: 0, v: { mc: { r: 0, c: 0 }, bl: 1, ht: "0", bg: "#9fc5e8" } },
        {
          r: 1,
          c: 1,
          v: {
            m: "Giá trị",
            ct: { fa: "General", t: "g" },
            v: "Giá trị",
            bl: 1,
            bg: "#9fc5e8",
            ht: "0",
            vt: "0"
          }
        },
        {
          r: 1,
          c: 2,
          v: {
            m: "Số lượng",
            ct: { fa: "General", t: "g" },
            v: "Số lượng",
            bl: 1,
            bg: "#9fc5e8",
            ht: "0",
            vt: "0"
          }
        },
        {
          r: 1,
          c: 3,
          v: {
            m: "Giảm giá",
            ct: { fa: "General", t: "g" },
            v: "Giảm giá",
            bl: 1,
            bg: "#9fc5e8",
            ht: "0",
            vt: "0"
          }
        },
        {
          r: 1,
          c: 4,
          v: {
            m: "Ghi chú",
            ct: { fa: "General", t: "g" },
            v: "Ghi chú",
            bl: 1,
            bg: "#9fc5e8",
            ht: "0",
            vt: "0"
          }
        },
        { r: 1, c: 5, v: { v: null, bg: "#9fc5e8" } },
        { r: 1, c: 6, v: { v: null, bg: "#9fc5e8" } },
        { r: 1, c: 7, v: { v: null, bg: "#9fc5e8" } },
        { r: 1, c: 8, v: { v: null, bg: "#9fc5e8" } },
        { r: 1, c: 9, v: { v: null, bg: "#9fc5e8" } }
    ],
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
