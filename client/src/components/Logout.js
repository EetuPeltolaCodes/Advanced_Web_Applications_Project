import React, { useEffect, useState } from 'react';

function Logout() {
  const [isAuthenticated, setIsAuthenticated] = useState(true); // State to check if user is authenticated

  // Fetch the users authentication
  useEffect(() => {
    fetch(`/api/logout`, {
      method: "GET",
      mode: "cors",
    })
      .then(response => response.json())
      .then((data) => {
        if (data.isAuthenticated===false) {
          setIsAuthenticated(false); // Update the isAuthenticated state
        }
    });
  }, []);
  
    const handleLogout = async () => {
      try {
        // When user wants to logout send the information to the backend
        const response = await fetch('/api/users/logout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        const data = await response.json();
  
        console.log(data.message); // Log the server response message
  
        // Redirect to the first page after logout
        window.location.href = '/';
      } catch (error) {
        console.error(error);
      }
    };

  // Redirect to home page if not authenticated
  if (!isAuthenticated) {
    window.location.href = "/";
  return null; // Redirecting, no need to render anything
  }
  
    return (
      <div>
        <h2>Logout by pressing the button</h2>
        <a className="waves-effect waves-light btn-large" onClick={handleLogout}>Logout</a>
      </div>
    );
  }
  
  export default Logout;
  