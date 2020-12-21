import React, { Component } from 'react';
import './Navbar.css'
import {Link} from 'react-router-dom'

class Navbar extends Component {
    render() {
        return (
            <React.Fragment>
                <div className="nav">
                    <div className="logo">
                        <Link to='/shop'>BRANGU.LT</Link>
                    </div>
                    <div className="nav-links">
                        <div>
                            <Link to='/sell'>Sell</Link>
                        </div>
                        <div>
                            <Link to="/shop">Shop</Link>
                        </div>
                        <div>
                            <Link to="/" onClick={this.props.logout}>Sign out</Link>
                        </div>
                    </div>
                </div>
                <div id="shadow-layer"></div>
            </React.Fragment>
        )
    }
}

export default Navbar