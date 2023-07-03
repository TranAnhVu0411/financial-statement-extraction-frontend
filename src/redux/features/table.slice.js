import { createSlice } from '@reduxjs/toolkit';

const tableSlice = createSlice({
    name: 'table',
    initialState: {
        imageurl: '', // url image crop
        celldata: [], // url excel
        merge: {}, // tablename
        rowlen: {},
        columnlen: {}
    },
    reducers: {
        tableupdate: (state, action) => {
            state.imageurl = action.payload.imageurl !== undefined ? action.payload.imageurl : state.imageurl;
            state.celldata = action.payload.celldata !== undefined ? action.payload.celldata : state.celldata;
            state.merge = action.payload.merge !== undefined ? action.payload.merge : state.merge;
            state.rowlen = action.payload.rowlen !== undefined ? action.payload.rowlen : state.rowlen;
            state.columnlen = action.payload.columnlen !== undefined ? action.payload.columnlen : state.columnlen;
        },
    },
})

export const { tableupdate } = tableSlice.actions;

export default tableSlice.reducer;