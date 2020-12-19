import React from 'react'
import './Modal.css'

const SignupModal = (props) => {
    var username, password, email, address

    function closeSignupModal(e) {
        e.stopPropagation()
        props.closeSignupModal()
    } 

    return (
        <div 
            className="modal-signup"
            onClick={ closeSignupModal }
            style={props.displaySignupModal ? {display: 'block'} : {display: 'none'}}
             >
            <div 
                className="modal-content" 
                onClick={ e => e.stopPropagation() }>
                <span 
                    className="close"
                    onClick={ closeSignupModal }>&times;</span>
                <div className="signup-page">
                    <form onSubmit={(event) => {
                        event.preventDefault()
                        window.alert(username.value + " " + password.value + " " + email.value)
                    }}>
                        <div class="form-group">
                            <input type="text" class="form-control" id="username" placeholder="Username" ref={(input) => {username = input}} required></input>
                        </div>
                        <div class="form-group">
                            <input type="password" class="form-control" id="password" placeholder="Password" ref={(input) => {password = input}} required></input>
                        </div>
                        <div class="form-group">
                            <input type="email" class="form-control" id="email" placeholder="E-mail" ref={(input) => {email = input}} required></input>
                        </div>
                        <div class="form-group">
                            <input type="text" class="form-control" id="address" placeholder="E-mail" ref={(input) => {address = input}} required></input>
                        </div>
                        <button type="submit" class="btn btn-primary">Create account</button>
                    </form>
                </div>
                
            </div>
        </div>
    )
}

export default SignupModal