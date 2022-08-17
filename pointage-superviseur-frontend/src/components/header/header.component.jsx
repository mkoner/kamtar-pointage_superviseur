import React from 'react'
import  Logo from '../../assets/splash.png'
import './header.component.scss'


const Header = () => {
    return (
        <div className="header-container">
            <div className="logo-container">
                <img src={Logo} alt="Logo Kamtar" height='50px'/>
            </div>
            <div className="nav-container">
                <nav>
                    <ul>
                        <li className="nav-item">Missions</li>
                        <li className="nav-item">Superviseurs</li>
                        <li className="nav-item">Managers</li>
                        <li className="nav-item">Admins</li>
                    </ul>
                </nav>
            </div>
            <div className="login"></div>
        </div>
    )
}
export default Header;

