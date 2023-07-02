import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import LuckyExcel from "luckyexcel";
import { urltoFile } from '../../../utils/convertBase64ToFileObj';

const luckysheet = window.luckysheet;

const useDatasheet = () => {
  const { excelurl, tablename } = useSelector((state) => ({ ...state.table }));
  const sheetRef = useRef();
  const sheetId = 'xxxxxxxxx';
  useEffect(() => {
    const getFileObj = async () => {
      let excelFileObj = await urltoFile(excelurl, `${tablename}.xlsx`,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      return excelFileObj
    }
    const sheetElement = sheetRef.current;
    if (sheetElement) {
      let data = getFileObj()
      LuckyExcel.transformExcelToLucky(
        data,
        function (exportJson, luckysheetfile) {
          // After obtaining the converted table data, use luckysheet to initialize or update the existing luckysheet workbook
          // Note: Luckysheet needs to introduce a dependency package and initialize the table container before it can be used
          console.log(exportJson.sheets);
          sheetElement.setAttribute("id", sheetId);
          luckysheet.create({
            container: sheetId,
            gridKey: sheetId,
            data: exportJson.sheets,
            // hook: {
            //   updated: () => {
            //     const sheetJson = luckysheet.toJson();
            //     setData(sheetJson.data);
            //   }
            // }
          });
        },
        function (err) {
          console.error("Import failed. Is your fail a valid xlsx?");
        },
        {
          encode: 'utf-8' // Specify the charset here, such as 'utf-8'
        }
      )
    }
  }, []);
  return { sheetRef };
};

export default useDatasheet;
