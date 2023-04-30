import {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function LogoutComponent() {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('UID')
        localStorage.removeItem('user_data')
        navigate('/');
        window.location.reload(true)
    }, []);
}

export default LogoutComponent;
