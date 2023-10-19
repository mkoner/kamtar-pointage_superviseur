

import logo from '../../assets/logo_picto.png'

import './logo.scss'

function Logo({onClick}) {
    return ( 
        <div className="logo-container" onClick={onClick}>
            <img src={logo} alt="kamtar logo" height={"50px"}/>
        </div>
     );
}

export default Logo;