
import  Logo from '../../assets/splash.png'

import './footer.styles.scss'

function Footer() {
    return ( 
        <div className="footer">
            <footer>
                <div className="logo-footer">
                    <img src={Logo} alt="Kamtar Logo" />
                </div>
                <div className="text-footer"></div>
            </footer>
        </div>
     );
}

export default Footer;