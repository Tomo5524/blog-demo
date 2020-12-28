import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

function example_image_upload_handler(blobInfo, success, failure, progress) {
  var xhr, formData;

  xhr = new XMLHttpRequest();
  xhr.withCredentials = false;
  xhr.open("POST", "http://localhost:5000/api/posts");

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

    success(json.location);
  };

  xhr.onerror = function () {
    failure(
      "Image upload failed due to a XHR Transport error. Code: " + xhr.status
    );
  };

  formData = new FormData();
  formData.append("file", blobInfo.blob(), blobInfo.filename());

  xhr.send(formData);
}

function AddPost() {
  const [title, settTitle] = useState("");
  const [description, setDescription] = useState("");
  let history = useHistory();
  // useEffect(() => {
  //   fetch("/api/posts")
  //     .then((res) => res.json())
  //     .then((posts) => setCats(posts));
  // }, []);
  const titleChange = (e) => {
    settTitle(e.target.value);
  };
  const descriptionChange = (e) => {
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

    fetch("/api/add-post", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // We convert the React state to JSON and send it as the POST body
      // body: JSON.stringify(title, description), does not work
      body: JSON.stringify({ title, description }),
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

    e.preventDefault();
    history.push("/posts");
  };

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group>
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter title"
            name="title"
            onChange={titleChange}
          />
        </Form.Group>

        <Form.Group>
          <Form.Label>Description</Form.Label>
          <Editor
            apiKey={process.env.tinyAPI}
            name="description"
            onChange={descriptionChange}
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

              // /* we override default upload handler to simulate successful upload*/
              // images_upload_handler: function (blobInfo, success, failure) {
              //   setTimeout(function () {
              //     /* no matter what you upload, we will turn it into TinyMCE logo :)*/
              //     success(
              //       "http://moxiecode.cachefly.net/tinymce/v9/images/logo.png"
              //     );
              //   }, 2000);
              // },
              // content_style:
              //   "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
              ///////
              // images_upload_url: "http://localhost:5000/api/posts",
              images_upload_handler: example_image_upload_handler,
              ////////
              // image_title: true,
              // automatic_uploads: false,
              // file_picker_types: "image",
              // // relative_urls: true,
              // // remove_script_host: false,
              // // convert_urls: true,
              // file_picker_callback: function (cb, value, meta) {
              //   var input = document.createElement("input");
              //   input.setAttribute("type", "file");
              //   input.setAttribute("accept", "image/*");
              //   input.onchange = function () {
              //     var file = this.files[0];
              //     console.log(file);
              //     var reader = new FileReader();
              //     reader.onload = function () {
              //       var id = "blobid" + new Date().getTime();
              //       // console.log(id, "id///////");
              //       var blobCache =
              //         window.tinymce.activeEditor.editorUpload.blobCache;
              //       // console.log(blobCache, "blobCache///////");
              //       let base64 = reader.result.split(",")[1];
              //       // console.log(reader.result, "reader.result//////");
              //       // console.log(base64, "base64///////");
              //       // base64 = base64.slice(0, 10);
              //       var blobInfo = blobCache.create(id, file, base64);
              //       blobCache.add(blobInfo);
              //       // console.log(file.name, "file.name/////");

              //       cb(blobInfo.blobUri(), { title: file.name });
              //     };
              //     reader.readAsDataURL(file);
              //   };
              //   input.click();
              // },
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
