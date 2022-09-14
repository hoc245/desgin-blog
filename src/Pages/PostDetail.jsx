import React from 'react'
import { useParams } from 'react-router-dom'

function PostDetail() {
  const param = useParams();
  console.log(param);
  return (
    <div>PostDetail</div>
  )
}

export default PostDetail