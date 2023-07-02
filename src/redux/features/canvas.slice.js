import { createSlice } from '@reduxjs/toolkit';

const canvasSlice = createSlice({
    name: 'canvas',
    initialState: {
        imageurl: "",
        // Kích thước canvas chuyển đổi
        width: window.innerWidth,
        height: window.innerHeight,
        // Kích thước ảnh gốc (Hỗ trợ cho scale)
        orgwidth: window.innerWidth,
        orgheight: window.innerHeight,
        // Kích thước div chứa canvas
        sectionwidth: window.innerWidth,
        sectionheight: window.innerHeight,
        // Scale (Hỗ trợ phóng to/thu nhỏ)
        scale: 1,
        // Dữ liệu list câu, có cấu trúc các thành phần
        // {
        //     text: ,(Có thể có hoặc không có)
        //     key: , (Id)
        //     type: , (Text, Line, Table)
        //     children: [], (Áp dụng đối với text region - line region)
        // }
        textmetadata: [],
        checkedid: [], // các id được check trong text metadata tree (Trong quá trình edit)
        // Dữ liệu list bounding box của câu, có cấu trúc thành phần
        // {
        //     coordinate: {} (trống hoặc có toạ độ {x: , y: , width: , height: }) 
        //     id: (id của node cha)
        //     bb_id: (id của bounding box)
        //     type: ,(Line, Table)
        //  }
        bbmetadata: [],
        canvasstate: 'edit', //chế độ edit/new
        highlight: true, // Mở highlight ?
        highlightbb: [], // các box highlight sẽ làm nổi bật

        selectedbbid: null, // bounding box id đang được chọn trên canvas
    },
    reducers: {
        canvasupdate: (state, action) => {
            state.imageurl = action.payload.imageurl !== undefined ? action.payload.imageurl : state.imageurl;
            
            state.orgwidth = action.payload.orgwidth !== undefined ? action.payload.orgwidth : state.orgwidth;
            state.orgheight = action.payload.orgheight !== undefined ? action.payload.orgheight : state.orgheight;
            
            state.width = action.payload.width !== undefined ? action.payload.width : state.width;
            state.height = action.payload.height !== undefined ? action.payload.height : state.height;
            
            state.sectionwidth = action.payload.sectionwidth !== undefined ? action.payload.sectionwidth : state.sectionwidth;
            state.sectionheight = action.payload.sectionheight !== undefined ? action.payload.sectionheight : state.sectionheight;
            
            state.scale = action.payload.scale !== undefined ? action.payload.scale : state.scale;
            
            state.textmetadata = action.payload.textmetadata !== undefined ? action.payload.textmetadata : state.textmetadata;
            state.checkedid = action.payload.checkedid !== undefined ? action.payload.checkedid : state.checkedid;

            state.bbmetadata = action.payload.bbmetadata !== undefined ? action.payload.bbmetadata : state.bbmetadata;
            state.canvasstate = action.payload.canvasstate !== undefined ? action.payload.canvasstate : state.canvasstate;

            state.highlight = action.payload.highlight !== undefined ? action.payload.highlight : state.highlight;
            state.highlightbb = action.payload.highlightbb !== undefined ? action.payload.highlightbb : state.highlightbb;

            state.selectedbbid = action.payload.selectedbbid !== undefined ? action.payload.selectedbbid : state.selectedbbid;
        },
        reset: (state, action) => {
            state.checkedid = [];
            state.canvasstate = action.payload.canvasstate;
            state.highlight = true;
            state.highlightbb = [];
            state.selectedbbid = null;
        },
    },
})

export const { canvasupdate, reset } = canvasSlice.actions;

export default canvasSlice.reducer;