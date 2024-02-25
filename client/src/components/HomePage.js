import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import default_picture from '../Picture/Default_picture.png'

function HomePage() {
  const { id } = useParams();
  const [data, setData] = useState(""); // State to store data
  const [editable, setEditable] = useState(false); // State to manage editing
  const [editedText, setEditedText] = useState(""); // State to store edited text
  const [selectedFile, setSelectedFile] = useState(null); // State to store the image
  const [isAuthenticated, setIsAuthenticated] = useState(true); // State to check if user is authenticated

  useEffect(() => {
    // Fetch the user information
    fetch(`/api/users/${id}`, {
      method: "GET",
      mode: "cors",
    })
      .then(response => response.json())
      .then((data) => {
        if (data.isAuthenticated===false) {
          setIsAuthenticated(false); // Update the isAuthenticated state
      }
        setData(data);  // Set the data of the user
        setEditedText(data.description); // Set initial value for editing
      });
  }, [id]);

  useEffect(() => {
    // Fetch image of the user 
      fetch(`/api/image/${id}`, {
        method: "GET",
        mode: "cors",
      })
        .then(response => response.blob())
        .then((data) => {
          if (!(data.type==="application/json")) {
            setSelectedFile(data) // If the user has a image update the selected file
          }
        });
  }, [id]);

  const handleEditToggle = () => {
    setEditable(!editable); // Toggle the editable state
  };

  const handleSaveChanges = () => {
    // You can send editedText to the server or update your state accordingly
    console.log("Saving changes");

   // Prepare the data to be sent to the server
    const formData = new FormData();
    formData.append("description", editedText);

    // Post new user information
    fetch(`/api/users/${id}`, {
       method: "POST",
       body: formData,
     })
    .then(response => response.json())
    .then((data) => {
      setData(data);  // Update the user data
      setEditedText(data.description);  // Update the user description
    });

    // After saving changes, you can toggle the editable state if needed
    setEditable(false);
  };

  const handleFileChange = (event) => {
    // Get the image from the upload
    const newFile = event.target.files[0];
  
    // Update the selected file state
    setSelectedFile(newFile);

    // Prepare the data to be sent to the server
    const formData = new FormData();
    formData.append("description", editedText);
    formData.append("profilePicture", newFile);
  
    // Send the new image to the backend
    fetch(`/api/users/${id}`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setData(data);  // Update the users data
        if (data.description) {
          setEditedText(data.description);  // If the response includes description update it
        }
        console.log("Image updated");
      });
  };

  // Redirect to home page if not authenticated
  if (!isAuthenticated) {
    window.location.href = "/";
  return null; // Redirecting, no need to render anything
  }

  return (
    <div className="row">
      <div className="col s12 m6 offset-m3">
        <div className="row-content">
          <h2>{data.name}</h2>  {/* Show the name of the logged in user */}
          <div className="card-image-container">
            {/* Show the picture of the logged in user */}
            <img
                className="materialboxed"
                width="300"
                src={selectedFile ? URL.createObjectURL(selectedFile) : default_picture}
                alt="Profile_Picture"
            />
            {/* Give the user the change to change the user picture and the description text */}
            <form onChange={handleFileChange}>
              <div className="file-field input-field">
                <div className="btn">
                  <span>Change Picture</span>
                  <input type="file" accept='image/*'/>
                </div>
                <div className="file-path-wrapper">
                  <input className="file-path validate" type="text"/>
                </div>
              </div>
            </form>
                    </div>
          <div className="card-content">
            {editable ? (
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                rows="4"
              />
            ) : (
              <p>{data.description}</p> /* Show the user description */
            )}
          </div>
          {/* Show the Edit button or the Cancel and Submit buttons when the user is editing the description */}
          <div className="card-action">
            <a className="waves-effect waves-light btn-small" onClick={handleEditToggle}>
              {editable ? "Cancel" : "Edit"}
            </a>
            <br/>
            {editable && (
              <a className="waves-effect waves-light btn-small" onClick={handleSaveChanges}>
                Submit
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
