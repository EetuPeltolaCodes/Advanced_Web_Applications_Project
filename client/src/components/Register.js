import React, { useState, useEffect } from 'react'

function Register() {
    const [userData, setUserData] = useState({})    // State to update the user's data
    const [user_id, setUser_id] = useState(null);   // State to update the user's id
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // State to check if user is authenticated

    useEffect(() => {
        // Check if the user is authenticated when the component mounts
        fetch('/api/users/register', {
          method: 'GET',
          credentials: 'include', // Include credentials for cross-origin requests
        })
          .then((response) => response.json())
          .then((data) => {  
            if (data.isAuthenticated===true) {
                setUser_id(data.id);    // Update the users id if the user is already logged in
                setIsAuthenticated(true); // Update the isAuthenticated state
            }
          })
          .catch(error => {
            console.error('Fetch error:', error);
          });
      }, []);

    const handleSubmit = (e) => {
        e.preventDefault()
        
        // Send the register information to the backend
        fetch("/api/users/register", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(userData),
            mode: "cors",
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
                if (data.success) {
                    console.log(data);
                    window.location.href= "/login"; // If the register is successful send the user to the login page
                } else {
                    // If the user's credentials aren't valid dispaly error to the user
                    var element = document.getElementById("error-field");
                    element.textContent = data.message;
                    element.style.color = "Red";
                    element.style.fontSize = "large";
                }
            })
            .catch(error => {
              console.error("Fetch error:", error);
            });
            
        }

    const handleAction = (e) => {
        // Set user's data when it is changed
        setUserData({...userData, [e.target.name]: e.target.value})
    }

    // Redirect to home page if already authenticated
    if (isAuthenticated) {
        console.log(user_id)
        window.location.href = "/" + user_id;
    return null; // Redirecting, no need to render anything
    }

  return (

    <div>
        <h2>
            Welcome To Not Tinder
        </h2>
        <div className="row">
            <div className="col s12 m6 offset-m3">
                <div className="card medium">
                    <div className="card-content">
                        <div className="col s12">
                            <text id="error-field"></text>
                        </div>
                        {/* User fills in the inputs and try to register by pressing the register button */}
                        <form className="col s12" onChange={handleAction} onSubmit={handleSubmit}>
                            <div className="input-field col s6">
                                <i className="material-icons prefix">account_circle</i>
                                <label className='active' htmlFor="firstname">First Name</label>
                                <input type="text" id="firstname" name="firstname"/><br/>
                                <br/>
                            </div>
                            <div className="input-field col s6">   
                                <label className='active' htmlFor="lastname">Last Name</label>
                                <input type="text" id="lastname" name="lastname"/><br/>
                                <br/>
                            </div>
                            <div className="input-field col s6">
                                <i className="material-icons prefix">email</i>
                                <label className='active' htmlFor="email">Email Address</label>
                                <input type="text" id="email" name="email"/><br/>
                                <br/>
                            </div>
                            <div className="input-field col s6">
                                <i className="material-icons prefix">security</i>
                                <label className='active' htmlFor="password">Password</label>
                                <input type="password" id="password" name="password"/><br/>
                                <br/>
                            </div>
                            <div className="input-field col s12">
                                <button className="btn-large waves-effect waves-light" type="submit" name="action">Register
                                    <i className="material-icons right">send</i>
                                </button>
                            </div>
                        </form>
                    </div>
                    {/* Show the user other actions */}
                    <div className="card-action">
                        <a href='/login'>Login</a><br/>
                        <a href='/'>Home</a><br/>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}

export default Register