import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import default_picture from '../Picture/Default_picture.png';

function PartenerFinder() {
    const { id } = useParams();
    const [showndata, setData] = useState(""); // State to store the shown users data
    const [text, setText] = useState(""); // State to store edited text
    const [selectedFile, setSelectedFile] = useState(null); // State to store the image
    const [shownUserId, setShownUserId] = useState(null); // State to store the shown users id
    const [isAuthenticated, setIsAuthenticated] = useState(true); // State to check if user is authenticated
    const [matchedName, setMatchedName] = useState(""); // State to store the name of the matched user
  
    useEffect(() => {
        try {
          // Check if shownUserId is null
          if (!shownUserId) {
            // Fetch a random user the user hasn't liked
            fetch(`/api/users/${id}/unliked-user`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            .then(response => response.json())
            .then((data) => {
              if (data.isAuthenticated===false) {
                setIsAuthenticated(false); // Update the isAuthenticated state
              }
              if(!data.message) {
                setShownUserId(data._id); // Update the shown user's id
                setText(data.description);  // Update the shown user's description
                setData(data);  // Update the shown user's data
              } else {
                setText("You have liked all the users");  // Show this text if there aren't anymore users to show
              }
              if (data.image) {
                // Fetch the shown users image if there is one
                fetch(`/api/image/${data._id}`, {
                  method: "GET",
                  mode: "cors",
                })
                .then(response => response.blob())
                .then((imageData) => {
                  if (!(imageData.type === "application/json")) {
                    setSelectedFile(imageData); // Update the image if there is one
                  }
                });
              } else {
                setSelectedFile(null) // Update the image to null if the shown user doesn't have a image
              }
            });
          }
        } catch (error) {
          console.error(error);
        }
      }, [id]);
      
  
    const handleDislike = async () => {
      // If the user dislikes the shown user find another one
      if(shownUserId) {
        try {
            // Make request for a new user
            const response = await fetch(`/api/users/${id}/unliked-user`, {
                method: 'GET',
                headers: {
                'Content-Type': 'application/json',
                },
            });
        
            const data2 = await response.json();
        
            // Update states to display the new user profile
            setShownUserId(data2._id);
            setText(data2.description);
            setData(data2);
        
            // Update the profile picture if available
            if (data2.image) {
                fetch(`/api/image/${data2._id}`, {
                method: "GET",
                mode: "cors",
                })
                .then(response => response.blob())
                .then((imageData) => {
                if (!(imageData.type === "application/json")) {
                    setSelectedFile(imageData);
                }
                });
            } else {
                setSelectedFile(null);
            }
        
            } catch (error) {
            console.error(error);
            }
      }
    };      
  
    const handleLike = async () => {
      if(shownUserId) {
        try {
          const likedUserId = shownUserId; // get the ID of the user being liked;
          var response = await fetch(`/api/users/${id}/like`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user_id: likedUserId }),
          });
      
          const data = await response.json();

          if (data.message === "It's a match!") {
            // Open the modal when it's a match
            document.getElementById('myModal').style.display = 'block';
            setMatchedName(showndata.name)
          }

          // Make request for a new user
          response = await fetch(`/api/users/${id}/unliked-user`, {
              method: 'GET',
              headers: {
              'Content-Type': 'application/json',
              },
          });
      
          const data2 = await response.json();
      
          // Update state to display the new user profile if the is still users
          if(!data2.message) {
            setShownUserId(data2._id);
            setText(data2.description);
            setData(data2);
          } else {
            setText("You have liked all the users");
          }
      
          // Update the profile picture if available
          if (data2.image) {
              fetch(`/api/image/${data2._id}`, {
              method: "GET",
              mode: "cors",
              })
              .then(response => response.blob())
              .then((imageData) => {
              if (!(imageData.type === "application/json")) {
                  setSelectedFile(imageData);
              }
              });
          } else {
              setSelectedFile(null);
          }

        } catch (error) {
          console.error(error);
        }
      }
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
            <h2>{showndata.name}</h2>  {/* Show the shown users name */}
            <div className="card-image-container">
              <img
                className="materialboxed"
                width="300"
                src={selectedFile ? URL.createObjectURL(selectedFile) : default_picture}  /* Show the shown users image or default image */
                alt="Profile_Picture"
              />
            </div>
            <div className="card-content">
                  <p>{text}</p>   {/* Show the shown users description */}
            </div>
            <div className="row">
              <a className="waves-effect waves-light btn" onClick={handleLike}> {/* Like button */}
                Like
              </a>
              <a className="waves-effect waves-light btn" onClick={handleDislike}>  {/* Dislike button */}
                Dislike
              </a>
            </div>
          </div>
        </div>
          {/* Modal for match */}
        <div id="myModal" className="modal">
          <div className="modal-content">
            <h4>It's a Match!</h4>
            <p>Congratulations! You have a match with {matchedName}.</p>
          </div>
          <div className="modal-footer">
            <a href={"/" + id + "/matches"} className="waves-effect waves-light btn">
              Chat
            </a>
            <a className="waves-effect waves-light btn"
              onClick={() => {
                const modal = document.getElementById("myModal");
                modal.style.display="none";
              }}
            >
              Close
            </a>
          </div>
        </div>
      </div>
    );
  }
  
export default PartenerFinder;