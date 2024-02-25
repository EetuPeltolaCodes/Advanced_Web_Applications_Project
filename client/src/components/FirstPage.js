import React from 'react';
import { Link } from 'react-router-dom';

function FirstPage() {
  return (
    <div>
        <h2>Welcome To Not Tinder</h2>
        <div className="row">
        <div className="col s12 m6 offset-m3">
            <div className="card small">
            <div className="card-content">
                <div className="action-links">
                    <div className='col s12'>
                        <h4>New here? Register <Link to="/register">here</Link></h4>    {/* Give the user link to the register page */}
                    </div>
                    <br/>
                    <div className='col s12'>
                        <h4>Already have a user? Login <Link to="/login">here</Link></h4>   {/* Give the user link to the login page */}
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
}

export default FirstPage;
