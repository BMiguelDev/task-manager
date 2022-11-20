import React from 'react'
import { Link } from 'react-router-dom';

import styles from './ErrorPage.module.scss';

export default function ErrorPage() {
  return (
    <main className={styles.errorpage_container}>
      <img src={require('../../assets/images/404.webp')} alt="Error 404, page not found" />
      <p>Page not found</p>
      <Link to='/task-manager' className={styles.error_page_link}>Take me back Home</Link>
    </main>
  )
}