export const toolbarConfig = {
  undoRedo: true, //Undo redo
  paintFormat: false, //Format brush
  currencyFormat: false, //currency format
  percentageFormat: false, //Percentage format
  numberDecrease: false, //'Decrease the number of decimal places'
  numberIncrease: false, //'Increase the number of decimal places
  moreFormats: false, //'More Formats'
  font: true, //'font'
  fontSize: true, //'Font size'
  bold: true, //'Bold (Ctrl+B)'
  italic: true, //'Italic (Ctrl+I)'
  strikethrough: true, //'Strikethrough (Alt+Shift+5)'
  underline: true, // 'Underline (Alt+Shift+6)'
  textColor: true, //'Text color'
  fillColor: true, //'Cell color'
  border: false, //'border'
  mergeCell: true, //'Merge cells'
  horizontalAlignMode: true, //'Horizontal alignment'
  verticalAlignMode: true, //'Vertical alignment'
  textWrapMode: true, //'Wrap mode'
  textRotateMode: true, //'Text Rotation Mode'
  image:false, // 'Insert picture'
  link:false, // 'Insert link'
  chart: false, //'chart' (the icon is hidden, but if the chart plugin is configured, you can still create a new chart by right click)
  postil: false, //'comment'
  pivotTable: false, //'PivotTable'
  function: false, //'formula'
  frozenMode: false, //'freeze mode'
  sortAndFilter: false, //'Sort and filter'
  conditionalFormat: false, //'Conditional Format'
  dataVerification: false, // 'Data Verification'
  splitColumn: false, //'Split column'
  screenshot: false, //'screenshot'
  findAndReplace: false, //'Find and Replace'
  protection:false, // 'Worksheet protection'
  print:false, // 'Print'
};

export const rightClickConfig = {
  copy: true, // copy
  copyAs: false, // copy as
  paste: true, // paste
  insertRow: true, // insert row
  insertColumn: true, // insert column
  deleteRow: true, // delete the selected row
  deleteColumn: true, // delete the selected column
  deleteCell: false, // delete cell
  hideRow: false, // hide the selected row and display the selected row
  hideColumn: false, // hide the selected column and display the selected column
  rowHeight: false, // row height
  columnWidth: false, // column width
  clear: false, // clear content
  matrix: false, // matrix operation selection
  sort: false, // sort selection
  filter: false, // filter selection
  chart: false, // chart generation
  image: false, // insert picture
  link: false, // insert link
  data: false, // data verification
  cellFormat: false // Set cell format
}