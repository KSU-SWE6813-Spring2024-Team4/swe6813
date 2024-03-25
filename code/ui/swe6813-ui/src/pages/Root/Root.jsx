import * as React from 'react';
import {
    useCallback,
    useEffect
} from "react";
import { useNavigate } from "react-router-dom";
import { checkToken } from "../../util/Api";
import SWEButton from '../../components/SWEButton/SWEButton';

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
            // TODO: dispatch error modal action with message
            .catch(console.log)
    }, [])
    
    //anything that all pages will have; like a nav bar
    return(
        <div>
            <h1>Hi, Team 4 Project</h1>
            <h2>Our CI/CD Workflow works correctly!</h2>
            {/* TODO: just here for testing full auth flow */}
            <SWEButton
                title="Sign Out"
                onClick={ signoutHandler }
            />
        </div>
    )
}