import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Avatar, message, Typography, Dropdown } from 'antd';

import { LoginForm, RegisterForm } from './auth';
import { register, login, logout } from '../../redux/features/auth.slice';
import Guest from '../../asset/images/guest.png';
import User from '../../asset/images/user.png';
import Admin from '../../asset/images/admin.png';

const AvatarContainer = () => {
    const { user } = useSelector((state) => ({ ...state.auth }));
    const [openLogin, setOpenLogin] = useState(false);
    const [openRegister, setOpenRegister] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onRegister = (values) => {
        console.log('Received values of form: ', values);
        dispatch(register({ values, message }));
        setOpenRegister(false);
    };

    const onLogin = (values) => {
        console.log('Received values of form: ', values); 
        dispatch(login({ values, message }));
        setOpenLogin(false);
    };

    const handleMenuClick = (e) => {
        if (e.key === 'login') {
            setOpenLogin(true);
        } else if (e.key === 'register') {
            setOpenRegister(true);
        } else if (e.key === 'logout') {
            dispatch(logout());
            navigate('/');
        }
    };

    const menuChanging = (user) => {
        if (user === null) {
            return [
                {
                    label: 'Log in',
                    key: 'login',
                },
                {
                    label: 'Register',
                    key: 'register',
                },
            ]
        } else {
            return [
                {
                    label: <Typography.Text strong>{user.account.username}</Typography.Text>,
                    type: 'group',
                    key: 'username',
                    children: [
                        {
                            label: 'Edit profile',
                            key: 'info',
                        },
                        {
                            label: 'Log out',
                            danger: true,
                            key: 'logout',
                        },
                    ]
                },
            ]
        }
    }
    return (
        <div className="user-navbar-container">
            <Dropdown
                    menu={{items: menuChanging(user), onClick: handleMenuClick}}
                    placement="bottomRight"
            >
                <Avatar
                    size='large'
                    src={user === null ? Guest : user.account.role === 'user' ? User : Admin}
                    style={{border: '1px solid black', color: 'blue'}}
                />
            </Dropdown>
            <LoginForm
                open={openLogin}
                onCreate={onLogin}
                onCancel={() => {
                  setOpenLogin(false);
                }}
            />
            <RegisterForm
                open={openRegister}
                onCreate={onRegister}
                onCancel={() => {
                  setOpenRegister(false);
                }}
            />
        </div>
    )
}

export default AvatarContainer