import React, { useState, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useHistory } from "react-router-dom";

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
    console.log(
      e.target.getContent({ format: "html" }),
      "e.target.getContent({ format: 'html' })"
    );
    setDescription(e.target.getContent());
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
      console.log(description, "description//////");
      console.log(response, "response//////");
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

              file_browser_callback_types: "image",
              entity_encoding: "raw",
              // encoding: "xml",
              // selector: "textarea#myTextArea",
              cleanup: true,
              forced_root_block: false,
              menubar: "insert",
              a11y_advanced_options: true,
              // oninit: "setPlainText",
              image_title: true,
              automatic_uploads: true,
              file_picker_types: "image",
              file_picker_callback: function (cb, value, meta) {
                var input = document.createElement("input");
                input.setAttribute("type", "file");
                input.setAttribute("accept", "image/*");
                input.onchange = function () {
                  var file = this.files[0];
                  var reader = new FileReader();
                  reader.onload = function () {
                    var id = "blobid" + new Date().getTime();
                    var blobCache =
                      window.tinymce.activeEditor.editorUpload.blobCache;
                    var base64 = reader.result.split(",")[1];
                    var blobInfo = blobCache.create(id, file, base64);
                    blobCache.add(blobInfo);

                    cb(blobInfo.blobUri(), { title: file.name });
                  };
                  reader.readAsDataURL(file);
                };
                input.click();
              },
            }}
            onChange={descriptionChange}
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
