import React, { useState, useEffect } from "react";
import renderHTML from "react-render-html";
import ShowPost from "./posts";
import { Link } from "react-router-dom";

function Posts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchBlog();

    // fetch("/api/posts")
    //   .then((res) => res.json())
    //   .then((posts) => setPosts(posts));
  }, []);

  const fetchBlog = async () => {
    const res = await fetch("http://localhost:5000/api/posts");
    // research error net::ERR_CONNECTION_REFUSED
    const data = await res.json();
    setPosts(data);
  };

  console.log(posts, "posts////");
  // if (typeof posts != "undefined" && posts.length > 0) {
  //   console.log("posts exit");
  // }
  return (
    <div>
      <h2>Posts hiya</h2>
      <ul className="list-group list-group-flush">
        {posts.map((post) => (
          <li key={post._id} className="list-group-item">
            <div>
              <div className="d-flex">
                <Link
                  to={{
                    pathname: post.slug,
                    state: { post },
                  }}
                  className="text-dark pr-1"
                >
                  {post.title}
                </Link>
                <p className="text-muted pr-1">{post.edited ? "edited" : ""}</p>
              </div>

              {post.date}
            </div>
            <br />
            {/* {renderHTML(renderHTML(post.sanitizedHtml))} */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;
