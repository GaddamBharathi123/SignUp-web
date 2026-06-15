import { useState } from 'react'

function Login(){
   return(
     <div className="d-flex justify-content-center align-items-center vh-100 bg-secondary">
        <div className="bg-white p-3 rounded w-25">
            <h2>Login</h2>
            <form>
                
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Email</strong>
                    </label>
                    <input type="email" 
                    placeholder="Enter Email"
                    autoComplete="off"
                    name="email"
                    className="form-control rounded-0" />
                </div>
                <div className="mb-3">
                    <label htmlFor="email">
                        <strong>Password</strong>
                    </label>
                    <input type="password" 
                    placeholder="Enter Password"
                    autoComplete="off"
                    name="password"
                    className="form-control rounded-0" />
                </div>
                <button type="submit" className="btn btn-success w-100 rounded-0">
                    Login
                </button>
                <p>Don't have an account Sign Up</p>
                <button className="btn btn-default border w-100 bg-light rounded-0 text-decoration-none">
                   Sign Up
                </button>
            </form>
        </div>
     </div>
   )
}

export default Login;
