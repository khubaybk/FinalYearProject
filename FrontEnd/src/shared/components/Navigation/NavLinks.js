import React, {useContext} from "react";
import {NavLink} from "react-router-dom";
import './NavLinks.css';
import {AuthContext} from "../../context/auth-context";


const NavLinks = props => {
    const auth = useContext(AuthContext);
    
    return ( <ul className="nav-links">
            {auth.isLoggedIn &&
                <li>
                    <NavLink to="/places/getAllPosts" exact>Home</NavLink>
                </li>
            }
            {auth.isLoggedIn &&
                <li>
                    <NavLink to={`/${auth.userId}/places`}                        >My Posts </NavLink>
                </li>
            }
            {auth.isLoggedIn &&
                <li>
                    <NavLink to="/places/new"> Add Post</NavLink>
                </li>
            }
             {auth.isLoggedIn &&
                 <li>
                 <NavLink to="/allUsers" exact> All Users</NavLink>
             </li>
            }

            {!auth.isLoggedIn &&
                <li>
                    <NavLink to="/auth"> Authenticate </NavLink>
                </li>
            }
            
            {auth.isLoggedIn &&
                <li>
                    <button onClick={auth.logout}> LogOut </button>
                </li>
            }
        </ul>
    );
};

export default NavLinks