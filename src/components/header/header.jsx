import React from 'react';
import './header.css';
import Logout from '../logout/logout';

const Header = () => {
  return (
    <header className="header">
      <div className="header-title">EduFeedbackAI</div>
      <div className="header-logout">
        <Logout />
      </div>
    </header>
  );
};

export default Header;