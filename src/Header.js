import React from 'react';
import { Link } from 'react-router-dom';
import { login, logout, isLoggedIn } from './Auth/AuthService';

const Header = () => (
  <header>
    <nav>
      <div className="divFont">
        {
          !isLoggedIn() && (
//page formatting
          <div className="divFont divCenter">
            <button onClick={() => login()} className="loginStyle">Log In/Register</button>
          </div>
          )
        }
        {
          isLoggedIn() && (
//page formatting
            <div className="divFont">
              <button onClick={() => logout()} className="loggedStyle">Logout</button>
              <Link to='/groupList' className="loggedHeader">View Groups List</Link>
              <Link to='/createGroup' className="loggedHeader">Create a Group</Link>
<<<<<<< HEAD
              <Link to='/' className="loggedHeader">Home</Link>
=======
>>>>>>> ba5c972965d2f8ab8959d3504f61e812cf0d9bf9
            </div>
          )
        }
      </div>
    </nav>
  </header>
)

export default Header;
