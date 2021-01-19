import React, { useState, useEffect } from "react";
import renderHTML from "react-render-html";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import auth from "../services/auth";

function ShowPost(props) {
  console.log("ShowPost called ////");
  const history = useHistory();
  const {
    location: {
      state: {
        post: { _id, sanitizedHtml, title },
      },
    },
  } = props;
  const {
    location: {
      state: { post },
    },
  } = props;
  // console.log(post, 'post////');
  //   const [posts, setCats] = useState([]);
  //   useEffect(() => {
  //     fetch("/api/posts")
  //       .then((res) => res.json())
  //       .then((posts) => setCats(posts));
  //   }, []);
  // console.log(post, "post////");
  // console.log(props, "state//////");
  // console.log(props.location, "state.location//////");
  // console.log(props.location.state, "state.location.state//////");
  // console.log(props.location.state.post, "state.location.state.post//////");

  const deletePost = (e) => {
    ///there is a delay after you delay react delete
    console.log(props.location.state.post._id, "props._id//////////");
    fetch(`/api/delete/${_id}`, {
      method: "DELETE",
      acition: `/api/delete/${_id}?_method=DELETE`,
      headers: {
        "Content-Type": "application/json",
        Authorization: auth.authHeader(),
      },
    }).catch((err) => {
      console.error(err);
    });

    e.preventDefault();
    history.push("/posts");
    window.location.reload();
  };

  return (
    <div>
      <h2>Posts hiya</h2>
      <h3>{title}</h3>
      <br />
      {renderHTML(renderHTML(sanitizedHtml))}
      <div class="d-flex mb-2">
        <Link
          to={{
            pathname: `/add-post/${_id}`,
            state: { post },
          }}
        >
          <button className="btn btn-success">Edit</button>
        </Link>
        <form>
          <button className="btn btn-danger mx-3" onClick={deletePost}>
            Delete
          </button>
        </form>
      </div>
    </div>
  );
}

export default ShowPost;
