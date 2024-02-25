import React, { useState, useEffect } from 'react'

function Login() {  
    const [userData, setUserData] = useState({})    // State to change the user's data
    const [user_id, setUser_id] = useState(null);   // State to change the user's id
    const [isAuthenticated, setIsAuthenticated] = useState(false);  // State to check if user is authenticated

    useEffect(() => {
        // Check if the user is authenticated when the component mounts
        fetch('/api/users/login', {
          method: 'GET',
          credentials: 'include', // Include credentials for cross-origin requests
        })
          .then((response) => response.json())
          .then((data) => {  
            if (data.isAuthenticated===true) {
                setUser_id(data.id);    // Update the user's id
                setIsAuthenticated(true); // Update the isAuthenticated state
            }
          })
          .catch(error => {
            console.error('Fetch error:', error);
          });
      }, []);

    
    const handleSubmit = (e) => {
        e.preventDefault()
        
        fetch("/api/users/login", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(userData),
            credentials: 'include', // Include credentials for cross-origin requests
            mode: "cors",
          })
            .then(response => {
              if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
              }
              return response.json();
            })
            .then(data => {
                // If the user's credentials aren't valid dispaly error to the user
                var element = document.getElementById("error-field");
                if (data.success) {
                    console.log(data);
                    window.location.href="/" + data.id
                } else {
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
            <h2>Welcome To Not Tinder</h2>
            <div className="row">
                <div className="col s12 m6 offset-m3">
                    <div className="card medium">
                        <div className="card-content">
                            <div className="col s12">
                                <span id="error-field"></span>
                            </div>
                            <br/>
                            {/* User can write the email address and password, then try to log in by pressing the log in */}
                            <form className="col s12" onChange={handleAction} onSubmit={handleSubmit}>
                                <div className="input-field col s6">
                                    <i className="material-icons prefix">email</i>
                                    <label className='active' htmlFor="email">Email</label>
                                    <input type="text" id="username" name="username"/><br/>
                                    <br/>
                                </div>
                                <div className="input-field col s6">
                                    <i className="material-icons prefix">security</i>
                                    <label className='active' htmlFor="password">Password</label>
                                    <input type="password" id="password" name="password"/><br/>
                                    <br/>
                                </div>
                                <div className="input-field col s6">
                                    {/* If the remeber me is pressed the website will remember the user for a week if not it would  
                                    remember the user for only 1 hour*/}
                                    <label>
                                        <input type="checkbox" id="checkbox-remember-me" name="checkbox-remember-me" className="filled-in"/>
                                        <span>Remember Me</span><br/>
                                    </label><br/>
                                    <br/>
                                </div>
                                <div className="input-field col s6">
                                    <button className="btn-large waves-effect waves-light" type="submit" name="action">Login
                                        <i className="material-icons right">send</i>
                                    </button>
                                </div>
                            </form>
                        </div>
                        {/* Show the user other actions */}
                        <div className="card-action">
                            <a href='/register'>Sign up</a><br/>
                            <a href='/'>Home</a><br/>
                        </div>
                    </div>
                </div>
            </div>    
        </div>
  )
}

export default Login