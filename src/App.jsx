import React from 'react';
import './App.css';
// import LoginPage from './components/Pages/login';
import PlaylistPages from './components/Pages/CreatePlaylist';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom'; 
import { useDispatch } from 'react-redux';
import url from './helper/auth'
import { Center, Button } from '@chakra-ui/react'
import { setToken } from './components/store/slice-token'
import { useSelector } from 'react-redux';
import {
    BrowserRouter as Router, 
    Switch, 
    Route, 
    Redirect
} from 'react-router-dom';


function App() {
    const isLogin = useSelector(state => state.token.isLogin);

    const LoginPage = () => {
        const dispatch = useDispatch();
        const history = useHistory();
    
        useEffect(() => {
            const accessToken = new URLSearchParams(window.location.hash).get('#access_token');
    
            if(accessToken !== null) {
                const setUserProfile = async () => {
                    try {
                        const requestOptions = {
                            headers: {
                                'Authorization': `Bearer ${accessToken}`,
                                'Content-Type': 'application/json',
                            }
                        };
                        const response = await fetch(
                            'https://api.spotify.com/v1/me', requestOptions
                        )
                            .then(data => data.json());
                        dispatch(setToken({
                            accessToken: accessToken,
                            user: response
                        }));
                        history.push('/create-playlist');  
                    } catch (error) {
                        alert(error);
                    }
                };
                setUserProfile();
            }
        }, [dispatch, history]);
    
        return (
            <>
                <Center mt='50px'>
                    <Button colorScheme='cyan' variant='solid'>
                        <a className='login-page' href={url}>Login</a>
                    </Button>
                </Center>
            </>
        );
    };

    return (
        <>
            <Router>
                <div >
                    <Switch>
                        <Route path="/create-playlist">
                            {isLogin ? <PlaylistPages /> : <Redirect to="/" />}
                        </Route>
                        <Route path="/">
                            <LoginPage />
                        </Route>
                    </Switch>
                </div>
            </Router>
        </>
    );
}

export default App;
