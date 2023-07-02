import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import AuthService from '../../services/auth.service';

export const register = createAsyncThunk("auth/register", async({ values, message }, { rejectWithValue }) => {
    try {
        const response = await AuthService.register(values);
        if (response.status!==200) {
            const error = await response.json();
            throw new Error(error.message);
        }
        message.success('Registration successful, please login with the account you just registered',);
        return {user: response.data};
    } catch (err) {
        message.error(err.response.data.message,);
        return rejectWithValue(err.response.data);
    }
})

export const login = createAsyncThunk("auth/login", async({ values, message }, { rejectWithValue }) => {
    try {
        const response = await AuthService.login(values);
        if (response.status!==200) {
            const error = await response.json();
            throw new Error(error.message);
        }
        message.success('Login successful');
        return {user: response.data};
    } catch (err) {
        message.error(err.response.data.message);
        return rejectWithValue(err.response.data);
    }
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: JSON.parse(localStorage.getItem('profile')),
        error: "",
        loading: false,
        tip: "",
    },
    reducers: {
        logout: (state, action) => {
            localStorage.removeItem('profile');;
            state.user = null;
        }
    },
    extraReducers: {
        [register.pending]: (state, action) => {
            state.loading = true;
            state.tip = 'Registering, please wait...';
        },
        [register.fulfilled]: (state, action) => {
            state.loading = false;
            state.error = '';
        },
        [register.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        },
        [login.pending]: (state, action) => {
            state.loading = true;
            state.tip = 'Login, please wait...';
        },
        [login.fulfilled]: (state, action) => {
            state.loading = false;
            localStorage.setItem('profile', JSON.stringify({...action.payload.user}));
            state.user = action.payload.user;
            state.error = '';
        },
        [login.rejected]: (state, action) => {
            state.loading = false;
            state.error = action.payload.message;
        }
    }
})

export const { logout } = authSlice.actions;

export default authSlice.reducer;