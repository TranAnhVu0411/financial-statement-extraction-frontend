import Logo from '../../asset/images/logo.png';

import { Button } from 'antd';
import './style.scss';
import AvatarContainer from './avatar';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Navbar = () => {
    const { user } = useSelector((state) => ({ ...state.auth }));
    const navigate = useNavigate();
    return (
        <div className='navbar component'>
            <div className='logo-container'>
                <img src={Logo} alt='website logo' />
                <h1>Financial OCR</h1>
            </div>
            <div className='menu-container'>
                {user!==null ? (
                    <Button className='website-navbar-button' onClick={() => navigate('/index')}>
                        Your documents
                    </Button>
                ) : (<></>)}
                <Button className='website-navbar-button'>
                    About us
                </Button>
            </div>
            <div className='avatar-container'>
                <AvatarContainer />
            </div>
        </div>
    )
}

export default Navbar