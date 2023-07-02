import { createSlice } from '@reduxjs/toolkit';

const newbbSlice = createSlice({
    name: 'newbb',
    initialState: {
        displaynewbb: [], // bounding box mới được tạo sẽ hiển thị {x, y, width, height, id}
        newbbmeta: [], // bounding box tạm {x, y, width, height, id}
        type: '', // Loại bounding box sẽ vẽ (line/table)
        linemeta: [], // metadata của text line {id, text}
        createnewtextbox: true, // Tạo text box mới cho các line được tạo nếu là true, nếu không thì chọn các text box có sẵn để chứa vào
        textboxid: '', // textbox id có sẵn trước đó 
    },
    reducers: {
        newupdate: (state, action) => {
            state.displaynewbb = action.payload.displaynewbb !== undefined ? action.payload.displaynewbb : state.displaynewbb;
            state.newbbmeta = action.payload.newbbmeta !== undefined ? action.payload.newbbmeta : state.newbbmeta;
            state.type = action.payload.type !== undefined ? action.payload.type : state.type;
            state.linemeta = action.payload.linemeta !== undefined ? action.payload.linemeta : state.linemeta;
            state.createnewtextbox = action.payload.createnewtextbox !== undefined ? action.payload.createnewtextbox : state.createnewtextbox;
            state.textboxid = action.payload.textboxid !== undefined ? action.payload.textboxid : state.textboxid;
        },
    },
})

export const { newupdate } = newbbSlice.actions;

export default newbbSlice.reducer;