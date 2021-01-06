import React, { useState, useEffect } from "react";
import Content from "./content";
import renderHTML from "react-render-html";
import ShowPost from "./posts";
import { Link } from "react-router-dom";

function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    };
    fetchBlog();

    // fetch("/api/posts")
    //   .then((res) => res.json())
    //   .then((posts) => setPosts(posts));
  }, []);
  // console.log(posts, "posts////");
  return (
    <div>
      <h2>Posts hiya</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link
              to={{
                pathname: post.slug,
                state: { post },
              }}
            >
              {post.title}
            </Link>
            {post.date}
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
