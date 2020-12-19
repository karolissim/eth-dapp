import React from 'react'
import './Modal.css'

const LoginModal = (props) => {
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
                    <form>
                        <div class="form-group">
                            <label for="exampleInputEmail1">Email address</label>
                            <input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email"></input>
                        </div>
                        <div class="form-group">
                            <label for="exampleInputPassword1">Password</label>
                            <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password"></input>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit</button>
                    </form>
                </div>
                
            </div>
        </div>
    )
}

export default LoginModal