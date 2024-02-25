import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ChatInterface from './ChatInterface';  // Import the ChatInterface

function Matches() {
    const { id } = useParams();
    const [selectedMatch, setSelectedMatch] = useState(null); // State to keep track of the selected user to chat with
    const [selectedName, setSelectedName] = useState(null); // State to keep track of the selected user's name
    const [matches, setMatches] = useState([]); // State of all the matches
    const [noMatches, setNoMatches] = useState(false);  // State to see if there aren't any matches
    const [matchesData, setMatchesData] = useState([]); // State of data of all the matches
    const [activeChat, setActiveChat] = useState(null); // State to keep track of the active chat with a user
    const [currentPage, setCurrentPage] = useState(1);  // State to change the page in the pager
    const [isAuthenticated, setIsAuthenticated] = useState(true); // State to check if user is authenticated

    // Fetch all the matches that the user has
    useEffect(() => {
        fetch(`/api/${id}/matches`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.isAuthenticated===false) {
                    setIsAuthenticated(false); // Update the isAuthenticated state
                }
                if (data.matches.length === 0) {  
                    setNoMatches(true); // If there aren't any matches update the state noMatches
                } else {
                    setMatches(data.matches);   // Update the matches state if there are matches
                    setNoMatches(false);
                }
            })
            .catch((error) => {
                console.error('Fetch error:', error);
            });
    }, [id]);

    // Fetch the data of all the matches found for the user
    useEffect(() => {
        const fetchMatchData = async () => {
            try {
                const promises = matches.map(async (matchId) => {
                    try {
                        const response = await fetch(`/api/users/${matchId}`, {
                            method: 'GET',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        });
                        return await response.json();
                    } catch (error) {
                        console.error('Fetch error:', error);
                        return null;
                    }
                });
    
                const matchDataArray = await Promise.all(promises); // Set the matches data to the list
                setMatchesData(matchDataArray.filter((data) => data !== null)); // Filter out failed requests
            } catch (error) {
                console.error('Error fetching match data:', error);
            }
        };
    
        if (matches.length > 0) {
            fetchMatchData(); // Only call the fetch if there are matches
        }
    }, [matches, currentPage]);

    const handleMatchClick = (matchUserId, matchUserName) => {
        // Set the selected match when a match is clicked
        setSelectedMatch(matchUserId);
        // Set the active chat when a match is clicked
        setActiveChat(matchUserId);
        // Set the selected name when a match is clicked
        setSelectedName(matchUserName);
    };

    const handlePageChange = (page) => {
        // Set the current page when the page in the pager is changed
        setCurrentPage(page);
    };

    // Show 5 names in one page in the pager
    const itemsPerPage = 5;
    // Calculate the total number of the pages
    const totalPages = Math.ceil(matchesData.length / itemsPerPage);

    // Slice the matches so one page has 5 matches
    const visibleMatches = matchesData.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );
    
    // Change one page to the right
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
            handlePageChange(currentPage + 1);
        }
    };

    // Change one page to the left
    const handlePrevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
            handlePageChange(currentPage - 1);
        }
    };

    // Redirect to home page if not authenticated
    if (!isAuthenticated) {
        window.location.href = "/";
    return null; // Redirecting, no need to render anything
    }

    return (
        <div>
            <h4>Your Matches</h4>
            {noMatches ? (
                <p id="no-matches">You have no matches :(</p>   /* If the user has matches show them if not show the text */
            ) : (
                <>
                    <ul className="pagination">   {/* Show 5 matches in the pager */}
                        <li className="waves-effect" onClick={() => handlePrevPage()}>
                            <a><i className="material-icons">chevron_left</i></a> {/* Arrow to the left */}
                        </li>
                        {visibleMatches.map((data) => (
                            <li
                                className={`waves-effect ${activeChat === data._id ? 'active' : ''}`}  /* Show the active chat highlighted */
                                key={data._id}
                                onClick={() => handleMatchClick(data._id, data.name)}
                            >
                                <a>{data.name}</a>
                            </li>
                        ))}
                        <li className="waves-effect" onClick={() => handleNextPage()}> {/* Arrow to the right */}
                            <a><i className="material-icons">chevron_right</i></a>
                        </li>
                    </ul>
                </>
            )}

            {selectedMatch && (
                <div>
                    {/* Display chat interface for the selected match */}
                    <ChatInterface userId={id} matchUserId={selectedMatch} matchUserName={selectedName}/>
                </div>
            )}
        </div>
    );
}

export default Matches;
