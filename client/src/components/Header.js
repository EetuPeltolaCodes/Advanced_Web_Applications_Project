import React from 'react';
import { useParams } from 'react-router-dom';

function Header() {
    const { id } = useParams();

    return (
        <div>
            <nav>
                <div className="nav-wrapper">
                    <ul className="left">
                        <li>
                            <a href={"/" + id}>
                                <i className="material-icons prefix">account_circle</i> {/* Show the profile site link as a profile icon */}
                            </a>
                        </li>
                        <li>
                            <a href={"/" + id + "/browse"}>
                                <i className="material-icons prefix">person_search</i> {/* Show the browse site link as a search icon */}
                            </a>
                        </li>
                        <li>
                            <a href={"/" + id + "/matches"}>
                                <i className="material-icons prefix">chat</i>   {/* Show the matches site link as a chat icon */}
                            </a>
                        </li>
                        <li>
                            <a href={"/" + id + "/logout"}>
                                <i className="material-icons prefix">logout</i> {/* Show the logout site link as a logout icon */}
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>

            <ul className="sidenav">    {/* Make sure that the header also works on mobile if the headers are too long and the hamburger is needed */}
              <li>
                  <a href={"/" + id}>
                      <i className="material-icons prefix">account_circle</i>
                  </a>
              </li>
              <li>
                  <a href={"/" + id + "/browse"}>
                      <i className="material-icons prefix">person_search</i>
                  </a>
              </li>
              <li>
                  <a href={"/" + id + "/matches"}>
                      <i className="material-icons prefix">chat</i>
                  </a>
              </li>
              <li>
                  <a href={"/" + id + "/logout"}>
                      <i className="material-icons prefix">logout</i>
                  </a>
              </li>
          </ul>            
        </div>
    );
}

export default Header;
