import React from 'react'
import { useHistory } from 'react-router-dom'
import './Modal.css'

const LoginModal = (props) => {
    const history = useHistory()
    var email, password
    function closeModal(e) {
        e.stopPropagation()
        props.closeLoginModal()
    }

    return(
        <div 
            className="modal-login"
            onClick={ closeModal }
            style={ props.displayLoginModal ? {display:'block'} : {display:'none'} } >
            <div 
                className="modal-content" 
                onClick={ e => e.stopPropagation() }>
                <span 
                    className="close"
                    onClick={ closeModal }>&times;</span>
                <div className="login-page">
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        props.login(email.value, password.value)
                        history.push("/shop")
                    }}>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" class="form-control" id="user-email" placeholder="Enter email" ref={(input) => {email = input}} required></input>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="user-password" placeholder="Password" ref={(input) => {password = input}} required></input>
                        </div>
                        <button type="submit" class="btn btn-primary">LOGIN</button>
                    </form>
                </div>
                
            </div>
        </div>
    )
}

export default LoginModal