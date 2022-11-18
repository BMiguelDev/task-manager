import React from 'react'
import { Outlet } from 'react-router-dom';

import Footer from './Footer';
import Navbar from './Navbar';
import styles from './Layouts.module.scss';


export default function PageLayout() {
  return (
      <div className={styles.app_container}>
          <Navbar />
          <Outlet />
          <Footer />
      </div>
  );
}