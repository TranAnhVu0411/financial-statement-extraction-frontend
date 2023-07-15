import { createSlice } from '@reduxjs/toolkit';

const tableSlice = createSlice({
    name: 'table',
    initialState: {
        imageurl: '', // url image crop
        celldata: [],
        merge: {},
        rowlen: {},
        columnlen: {},
        row: 0,
        column: 0,
    },
    reducers: {
        tableupdate: (state, action) => {
            state.imageurl = action.payload.imageurl !== undefined ? action.payload.imageurl : state.imageurl;
            state.celldata = action.payload.celldata !== undefined ? action.payload.celldata : state.celldata;
            state.merge = action.payload.merge !== undefined ? action.payload.merge : state.merge;
            state.rowlen = action.payload.rowlen !== undefined ? action.payload.rowlen : state.rowlen;
            state.columnlen = action.payload.columnlen !== undefined ? action.payload.columnlen : state.columnlen;
            state.row = action.payload.row !== undefined ? action.payload.row : state.row;
            state.column = action.payload.column !== undefined ? action.payload.column : state.column;
        },
        tablereset: (state, action) => {
            state.imageurl = '';
            state.celldata = [];
            state.merge = {};
            state.rowlen = {};
            state.columnlen = {};
            state.row = 0;
            state.column = 0;
        }
    },
})

export const { tableupdate, tablereset } = tableSlice.actions;

export default tableSlice.reducer;