import React, { useState, useEffect } from "react";
import renderHTML from "react-render-html";

function ShowPost(props) {
  //   const [posts, setCats] = useState([]);
  //   useEffect(() => {
  //     fetch("/api/posts")
  //       .then((res) => res.json())
  //       .then((posts) => setCats(posts));
  //   }, []);
  // console.log(posts, "posts////");
  console.log(props, "state//////");
  console.log(props.location, "state.location//////");
  console.log(props.location.state, "state.location.state//////");
  console.log(props.location.state.post, "state.location.state.post//////");
  return (
    <div>
      <h2>Posts hiya</h2>
      <h3>{props.location.state.post.title}</h3>
      <br />
      {renderHTML(renderHTML(props.location.state.post.description))}
    </div>
  );
}

export default ShowPost;
