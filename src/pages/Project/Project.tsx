import React from 'react'
import { useParams } from 'react-router-dom';

export default function Project() {

  const { id } = useParams();

  return (
    <>
    <div>Project</div>
    <p>{id}</p>
    </>
  )
}