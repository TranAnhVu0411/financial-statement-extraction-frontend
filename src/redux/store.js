import { configureStore } from '@reduxjs/toolkit';
import AuthReducer from "./features/auth.slice";
import DocumentReducer from "./features/document.slice";
import CanvasReducer from "./features/canvas.slice";
import NewbbSlice from "./features/newbb.slice";
import tableSlice from './features/table.slice';

export default configureStore({
    reducer: {
        auth: AuthReducer,
        document: DocumentReducer,
        canvas: CanvasReducer,
        newbb: NewbbSlice,
        table: tableSlice,
    },
})