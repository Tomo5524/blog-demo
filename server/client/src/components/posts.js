import React, { useState, useEffect } from "react";
function Posts() {
  const [posts, setCats] = useState([]);
  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((posts) => setCats(posts));
  }, []);
  return (
    <div>
      <h2>Posts hiya</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title} {post.description} {post.date}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
