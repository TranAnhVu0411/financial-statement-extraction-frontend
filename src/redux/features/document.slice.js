import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import DocumentService from '../../services/document.service';
import FileService from '../../services/file.service';

export const index = createAsyncThunk("document/index", async({ values, message }, { rejectWithValue }) => {
    try {
        const response = await DocumentService.index(values.userid);
        if (response.status!==200) {
            const error = await response.json();
            throw new Error(error.message);
        }
        return {documents: response.data};
    } catch (err) {
        message.error(err.response.data.message,);
        return rejectWithValue(err.response.data);
    }
})

export const loadimages = createAsyncThunk("document/loadimages", async({ values, message }, { rejectWithValue }) => {
    try {
        const documentResponse = await DocumentService.info(values.id)
        if (documentResponse.status!==200) {
            const error = await documentResponse.json();
            throw new Error(error.message);
        }
        const fetchResponse = await FileService.loadBackgroundImages({id: documentResponse.data.id, userid: documentResponse.data.userid, pagenum: documentResponse.data.pagenum});
        if (fetchResponse.status!==200) {
            const error = await fetchResponse.json();
            throw new Error(error.message);
        }
        return {document: documentResponse.data, images: fetchResponse.data};
    } catch (err) {
        message.error(err.response.data.message,);
        return rejectWithValue(err.response.data);
    }
})

export const pageinfo = createAsyncThunk("document/pageinfo", async({ values, message }, { rejectWithValue }) => {
    try {
        const response = await FileService.loadPageInfo({id: values.id, userid: values.userid, page: values.page});
        if (response.status!==200) {
            const error = await response.json();
            throw new Error(error.message);
        }
        return {pageimages: response.data.pageimages, metadata: response.data.metadata, pageindex: values.page};
    } catch (err) {
        message.error(err.response.data.message,);
        return rejectWithValue(err.response.data);
    }
})

const documentSlice = createSlice({
    name: 'document',
    initialState: {
        documents: [],
        document: {},
        images: [],
        pageindex: -1,
        pageimages: {},
        metadata: {},
        error: "",
        loading: false,
        tip: '',
    },
    reducers: {
        setdocumentmeta: (state, action) => {
            state.document = action.payload.document;
        },
        loadingchange: (state, action) => {
            state.tip = action.payload.tip;
            state.loading = action.payload.loading!==undefined ? action.payload.loading : state.loading;
        }
    },
    extraReducers: {
        [index.pending]: (state, action) => {
            state.loading = true;
            state.tip = 'Loading documents, please wait...';
        },
        [index.fulfilled]: (state, action) => {
            state.loading = false;
            state.documents = action.payload.documents;
            state.error = '';
        },
        [index.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [loadimages.pending]: (state, action) => {
            state.loading = true;
            state.tip = 'Loading document images, please wait...';
        },
        [loadimages.fulfilled]: (state, action) => {
            state.loading = false;
            state.document = action.payload.document;
            state.images = action.payload.images;
            state.pageindex = -1;
            state.pageimages = {};
            state.metadata = {};
            state.error = '';
        },
        [loadimages.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [pageinfo.pending]: (state, action) => {
            state.loading = true;
            state.tip = 'Loading page, please wait...';
        },
        [pageinfo.fulfilled]: (state, action) => {
            state.loading = false;
            state.pageimages = action.payload.pageimages;
            state.metadata = action.payload.metadata;
            state.pageindex = action.payload.pageindex;
            state.error = '';
        },
        [pageinfo.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
    }
})

export const { loadingchange, setdocumentmeta } = documentSlice.actions;

export default documentSlice.reducer;