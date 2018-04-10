//Home.js
import React, { Component } from 'react';
import { Link } from "react-router-dom";
import style from './style';

class Home extends Component {

      render() {

          return (
            <div>
            <h1 style={style.title}>TIED</h1>
            <li>
            <Link to="/login" style={{ textDecoration: 'none'}}>Login</Link>
            </li>
            <li>
            <Link to="/signup" style={{ textDecoration: 'none'}}>Sign Up</Link>
            </li>
            <li>
            <Link to="/createGroup" style={{ textDecoration: 'none'}}>Create Group</Link>
            </li>
            <li>
            <Link to="/groupList" style={{ textDecoration: 'none'}}>Group List</Link>
            </li>
            </div>
          )
      }
  }

  export default Home;
