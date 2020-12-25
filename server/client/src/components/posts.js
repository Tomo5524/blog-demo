import React, { useState, useEffect } from "react";
import Content from "./content";
import renderHTML from "react-render-html";

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
            {post.title} {post.date}
            {/* {post.description} */}
            {/* <br /> */}
            {/* <div dangerouslySetInnerHTML={{ __html: post.description }} /> */}
            {/* <br /> */}
            {/* {renderHTML(post.description)} */}
            <br />
            {renderHTML(renderHTML(post.description))}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
