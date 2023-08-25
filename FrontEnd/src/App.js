import React, {useState, useCallback, useEffect} from 'react';
import {BrowserRouter as Router, Redirect} from "react-router-dom";
import {useHttpClient} from "./shared/hooks/http-hook";
import {Route} from "react-router-dom";
import {Switch} from "react-router-dom";
import Users from "./user/pages/Users";
import NewPost from "./places/pages/NewPost";
import MainNavigation from "./shared/components/Navigation/MainNavigation";
import UserPosts from "./places/pages/UserPosts";
import UpdatePost from "./places/pages/UpdatePost";
import Auth from "./user/pages/Auth";
import {AuthContext} from "./shared/context/auth-context";
import auth from "./user/pages/Auth";
import LockOut from "./places/pages/lockOut";
import AllPosts from "./places/pages/AllPosts";

let logoutTimer;

const App = () => {
    const [token, setToken] = useState(false);
    const [tokenExpirationDate, setTokenExpirationDate] = useState();
    const [userId, setUserId] = useState(null);

    const [lockout, setLockOut] = useState(false);
    const [seconds, setSeconds] = useState();
    const {sendRequest } = useHttpClient();





    const login = useCallback((uid, token, lastLogin, timeSpent ,expirationDate) => {
        setToken(token);
        setUserId(uid);
        console.log(uid);
        if(timeSpent == null){
            setSeconds(0);
        }
        else {
            let oldDate = new Date(lastLogin);
            oldDate = oldDate.toISOString().split('T')[0]; //Last login (Yesterday)
            let todaysDate = new Date(new Date().getTime() + 1000 * 60 * 60);
            todaysDate = todaysDate.toISOString().split('T')[0];
            
            
            if(oldDate === todaysDate && timeSpent >= 5400){
                setLockOut(true);
                setSeconds(timeSpent);
            }
            else if (oldDate === todaysDate && timeSpent <5400) {
                setSeconds(timeSpent);
            }
            else{
                setSeconds(0);
            }
        }
        const tokenExpirationDate = expirationDate  || new Date(new Date().getTime() + 1000 * 60 * 60);
        setTokenExpirationDate(tokenExpirationDate);
        localStorage.setItem("userData", JSON.stringify({userId: uid,  lastLogin: lastLogin, timeSpent: timeSpent, token: token, expiration: tokenExpirationDate.toISOString()}));
        console.log("lastLoginToday" + userId)
        updateLoginTime(uid);



        //null here
    }, []);



   
        const updateLoginTime = async (uid) => {
            try {
                console.log(userId);
                const responseData = await sendRequest(
                    'http://localhost:5000/api/users/updateLastLogin',

                    'PATCH',
                    JSON.stringify({
                        userId: uid,
                        lastLogin: new Date(new Date().getTime() + 1000 * 60 * 60)
                    }),
                    {
                        'Content-Type': 'application/json',
                    }
                );
            } catch (err) {}
        };
        
    const logout = useCallback(() => {
        setToken(null);
        setTokenExpirationDate(null);
        setUserId(null);
        setLockOut(false);
        setSeconds(null);
        localStorage.clear();
    }, []);

 
    
    
    
    useEffect(() =>{
        logoutTimer = setTimeout(() => {
           // clearInterval(timerInterval);
            logout();
        })
    }, [ logout]);

    useEffect(() => {
        if(token && tokenExpirationDate) {
            const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
            logoutTimer = setTimeout(logout, remainingTime);
        } else {
            clearTimeout(logoutTimer);

        }
    }, [token, logout, tokenExpirationDate]);


    useEffect(() => {
        const time = localStorage.getItem("timeSpent");
        console.log(time);
        const storedData = JSON.parse(localStorage.getItem("userData"));


        if(storedData && storedData.token && new Date(storedData.expiration) > new Date()) {
            login(storedData.userId, storedData.token, storedData.lastLogin, parseInt(time), new Date(storedData.expiration));
        }
    }, [login]);
    

    useEffect(() => {
        if(token && tokenExpirationDate) {
            const intervalId = setInterval(() => {
                setSeconds(prevSeconds => prevSeconds + 1);
            }, 1000);
            return () => clearInterval(intervalId);
        }
        else {
        }
    }, [login, token, tokenExpirationDate]);


    useEffect(() => {
        if(seconds >=5400){
            setLockOut(true);
        }

    }, [seconds ]);
    
    useEffect(() => {
         const insertTime = async () => {
             try {
                 const responseData = await sendRequest(
                     'http://localhost:5000/api/users/timespent',
                 'PATCH',
                     JSON.stringify({
                         userId: userId,
                         timeSpent: seconds
                     }),
                     {
                         'Content-Type': 'application/json',
                     }
             );  
                 localStorage.setItem("timeSpent", seconds);

        } catch (err) {}
         };
         insertTime().then(r => console.log(r));
     }, [seconds ]);






    let routes;

    if(token && !lockout){
        routes = (
            <Switch>
                <Route path="/" exact>
                    <AllPosts/>
                </Route>
                <Route path="/allUsers" exact>
                    <Users/>
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPosts/>
                </Route>
                <Route path="/places/getAllPosts" exact>
                    <AllPosts/>
                </Route>
                <Route path="/places/new" exact>
                    <NewPost/>
                </Route>
                <Route path="/places/:placeId" exact>
                    <UpdatePost/>
                </Route>
                <Redirect to="/"/>
            </Switch>
        );
    }
    else if(lockout && token){
        routes = (
            <Switch>
                <Route path="/auth" exact>
                    <Auth/>
                </Route>
                <Route path="/" exact>
                    <LockOut/>
                </Route>
                <Route path="/:userId/places" exact>
                    <LockOut/>
                </Route>
                <Route path="/lockout" exact>
                    <LockOut/>
                </Route>
                <Route path="/places/new" exact>
                    <LockOut/>
                </Route>
                <Redirect to="/lockout"/>

            </Switch>
        )
    }
    else{
        routes = (
            <Switch>
                <Route path="/" exact>
                    <Auth/>
                </Route>
                <Route path="/:userId/places" exact>
                    <UserPosts/>
                </Route>
                <Route path="/auth" exact>
                    <Auth/>
                </Route>
                <Redirect to="/auth"/>
            </Switch>
        );

    }

    return  ( <AuthContext.Provider value={{isLoggedIn: !!token, token: token, userId: userId, login: login, logout: logout}}>
            <Router>
                <MainNavigation> </MainNavigation>
                <main>
                    {routes}
                </main>
            </Router>
        </AuthContext.Provider>
    );
}
//<redirect> is used to redirect users to an specific page no matter what
//route only works in router
//Switch allows for us to keep redierct and not redirect if path exists
export default App;