import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import renderHTML from "react-render-html";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";
import auth from "../services/auth";

function example_image_upload_handler(blobInfo, success, failure, progress) {
  var xhr, formData;

  xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open("POST", "api/image-upload"); // right
  // xhr.setRequestHeader("Accept", "application/json");

  // xhr.open("POST", "http://localhost:5000/api/posts"); // wrong

  xhr.upload.onprogress = function (e) {
    progress((e.loaded / e.total) * 100);
  };

  xhr.onload = function () {
    var json;

    if (xhr.status === 403) {
      failure("HTTP Error: " + xhr.status, { remove: true });
      return;
    }

    if (xhr.status < 200 || xhr.status >= 300) {
      failure("HTTP Error: " + xhr.status);
      return;
    }

    json = JSON.parse(xhr.responseText);

    if (!json || typeof json.location != "string") {
      failure("Invalid JSON: " + xhr.responseText);
      return;
    }

    console.log("sucessfully updated");
    success(json.location);
  };

  xhr.onerror = function () {
    failure(
      "Image upload failed due to a XHR Transport error. Code: " + xhr.status
    );
  };

  formData = new FormData();
  formData.append("file", blobInfo.blob(), blobInfo.filename());
  console.log("hiya check at 51 in addPost///");
  xhr.send(formData);
}

function AddPost(props) {
  // console.log("AddPost called");
  console.log(props, "props////");

  const [title, settTitle] = useState("");
  const [description, setDescription] = useState("");
  let history = useHistory();

  let Title;
  let Description;
  let id;
  let Date;
  if (typeof props.location.state != "undefined") {
    const {
      location: {
        state: {
          post: { title, description, _id, date },
        },
      },
    } = props;
    Title = title;
    Description = renderHTML(description);
    id = _id;
    Date = date;
  }

  useEffect(() => {
    console.log("useEffect called");
    if (typeof props.location.state != "undefined") {
      getTitle();
      getDescription();
    }
  }, []);

  const getTitle = () => {
    console.log("getTitle called");
    settTitle(Title);
  };

  const getDescription = () => {
    console.log("getDescription called");
    setDescription(Description);
  };

  const titleChange = (e) => {
    settTitle(e.target.value);
  };
  const descriptionChange = (e) => {
    console.log("sucessfully descriptionChange called/////");
    // console.log(
    //   e.target.getContent({ format: "text" }),
    //   "e.target.getContent()"
    // );
    console.log(e.target.getContent(), "e.target.getContent()");
    // console.log(
    //   window.tinymce.activeEditor.getContent(),
    //   "window.tinymce.activeEditor.getContent()"
    // );
    setDescription(window.tinymce.activeEditor.getContent());
  };

  const handleSubmit = (e) => {
    console.log(description, "description//////");

    if (id) {
      console.log(Date, "Date//////////");
      console.log("edit was called");
      fetch(`http://localhost:5000/api/edit/${id}`, {
        method: "POST",
        acition: `/api/edit/${id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.authHeader(),
        },
        // We convert the React state to JSON and send it as the POST body
        // body: JSON.stringify(title, description), does not work
        body: JSON.stringify({ title, description, Date }),
        // returned in the following format
        // {
        //   "title": "safdsadf",
        //   "description": "sdafasdf"
        // }
      }).then(function (response) {
        // console.log(description, "description//////");
        // console.log(response, "response//////");
        return response.json();
      });
    } else {
      console.log("new post was called");
      fetch("http://localhost:5000/api/add-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: auth.authHeader(),
        },
        // We convert the React state to JSON and send it as the POST body
        // body: JSON.stringify(title, description), does not work
        body: JSON.stringify({ title, description }),
        // returned in the following format
        // {
        //   "title": "safdsadf",
        //   "description": "sdafasdf"
        // }
      }).then(function (response) {
        // console.log(response, "response//////");
        return response.json();
      });
    }
    // window.location.reload();
    e.preventDefault();
    history.push("/posts");
    window.location.reload();
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            value={title}
            name="title"
            onChange={titleChange}
          />
        </Form.Group>

        <Form.Group>
          {/* <Form.Label>Description</Form.Label> */}
          <Editor
            apiKey={process.env.tinyAPI}
            name="description"
            // value={description}
            onChange={descriptionChange}
            // value="hiya"
            init={{
              plugins: [
                "advlist autolink lists link image charmap print preview anchor",
                "searchreplace visualblocks code fullscreen",
                "insertdatetime media table contextmenu paste imagetools wordcount help code",
              ],
              toolbar:
                "undo redo | formatselect | styleselect | fontsizeselect | bold italic | \
                | link image | alignleft aligncenter alignright alignjustify  | \
                bullist numlist outdent indent | removeformat | help",

              setup: function (editor) {
                editor.on("init", async function (e) {
                  await editor.setContent(description);
                });
              },
              /////
              // file_browser_callback_types: "image",
              // entity_encoding: "raw",
              // encoding: "xml",
              // selector: "textarea#myTextArea",
              // cleanup: true,
              // forced_root_block: false,
              // a11y_advanced_options: true,
              // // oninit: "setPlainText",
              // //
              // images_upload_url: "postAcceptor.php",

              ///////
              images_upload_url: "api/image-upload",
              images_upload_handler: example_image_upload_handler,
              // images_upload_handler: function (blobInfo, success, failure) {
              //   setTimeout(function () {
              //     /* no matter what you upload, we will turn it into TinyMCE logo :)*/
              //     success('http://moxiecode.cachefly.net/tinymce/v9/images/logo.png');
              //   }, 2000);
              // },
              ////////
              // image_title: true,
              // automatic_uploads: false,
              ////
              // images_upload_url: "api/add-post",
              // images_upload_base_path: "/some/basepath",
              // images_upload_credentials: true,

              // image_class_list: [
              //   { title: "Responsive", value: "img-responsive" },
              // ],
              //           file_picker_types: "image",
              //           /* and here's our custom image picker*/
              //           file_picker_callback: function (cb, value, meta) {
              //             var input = document.createElement("input");
              //             input.setAttribute("type", "file");
              //             input.setAttribute("accept", "image/*");

              //             /*
              //   Note: In modern browsers input[type="file"] is functional without
              //   even adding it to the DOM, but that might not be the case in some older
              //   or quirky browsers like IE, so you might want to add it to the DOM
              //   just in case, and visually hide it. And do not forget do remove it
              //   once you do not need it anymore.
              // */

              //             input.onchange = function () {
              //               var file = this.files[0];

              //               var reader = new FileReader();
              //               reader.onload = function () {
              //                 /*
              //       Note: Now we need to register the blob in TinyMCEs image blob
              //       registry. In the next release this part hopefully won't be
              //       necessary, as we are looking to handle it internally.
              //     */
              //                 var id = "blobid" + new Date().getTime();
              //                 var blobCache =
              //                   window.tinymce.activeEditor.editorUpload.blobCache;
              //                 var base64 = reader.result.split(",")[1];
              //                 var blobInfo = blobCache.create(id, file, base64);
              //                 blobCache.add(blobInfo);

              //                 /* call the callback and populate the Title field with the file name */
              //                 cb(blobInfo.blobUri(), { title: file.name });
              //               };
              //               reader.readAsDataURL(file);
              //             };

              //             input.click();
              //           },
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default AddPost;
