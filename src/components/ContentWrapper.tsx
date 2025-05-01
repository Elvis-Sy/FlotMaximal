import React from 'react'
import Header from './Header';
import Footer from './Footer';

type ContentWrapper = {
    children: React.ReactNode;
};

const ContentWrapper: React.FC<ContentWrapper> = ({children}) => {
  return (
    <div className="app-container">
      <Header />
        <main className="content">{children}</main>
      <Footer />
    </div>
  )
}

export default ContentWrapper