import { createSlice } from '@reduxjs/toolkit';

const tableSlice = createSlice({
    name: 'table',
    initialState: {
        imageurl: '', // url image crop
        excelurl: '', // url excel
        tablename: '', // tablename
    },
    reducers: {
        tableupdate: (state, action) => {
            state.imageurl = action.payload.imageurl !== undefined ? action.payload.imageurl : state.imageurl;
            state.excelurl = action.payload.excelurl !== undefined ? action.payload.excelurl : state.excelurl;
            state.tablename = action.payload.tablename !== undefined ? action.payload.tablename : state.tablename;
        },
    },
})

export const { tableupdate } = tableSlice.actions;

export default tableSlice.reducer;