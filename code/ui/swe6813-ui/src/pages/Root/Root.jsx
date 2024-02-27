import { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../../util/Api";
import Button from '../../components/Button/Button';

export default function Root() {
    const navigate = useNavigate()

    const signoutHandler = useCallback(() => {
        localStorage.removeItem('token');
        navigate('/auth');
    }, [navigate])

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            return
        }
        
        checkToken(token)
            .then((isValid) => {
                if (isValid) {
                    return
                }

                localStorage.removeItem('token')
                navigate('/auth')
            })
            .catch(console.log)
    }, [])
    
    //anything that all pages will have; like a nav bar
    return(
        <div>
            <h1>Hi, Team 4 Project</h1>
            <Button title="Sign Out" onClick={ signoutHandler }/>
        </div>
    )
}