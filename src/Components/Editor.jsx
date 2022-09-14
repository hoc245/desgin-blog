import React, { useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import { uploadBytes, ref as sRef, getDownloadURL } from "@firebase/storage";
import { storage } from "../firebase";
import { uid } from "uid";
import imageCompression from "browser-image-compression";
import imageUploader from "quill-image-uploader";
import 'quill-paste-smart';

Quill.register("modules/imageUploader", imageUploader);

export default function Editor(props) {
  const [text, setText] = useState("");
  let uidd = uid();
  let imageRef = "";

  let options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
  };
  let modules = {
    // #3 Add "image" to the toolbar
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
    // # 4 Add module and upload function
    imageUploader: {
      upload: (file) => {
        return new Promise((resolve, reject) => {
          //   const formData = new FormData();
          //   formData.append("image", file);
          //   console.log(file.name);
          imageRef = sRef(storage, `images/${uidd}.${file.name.substr(-3)}`);
          imageCompression(file, options).then((compressFile) => {
            uploadBytes(imageRef, compressFile)
              .catch((error) => {
                reject("Upload failed");
                console.error("Error:", error);
              })
              .then(() => {
                getDownloadURL(
                  sRef(storage, `images/${uidd}.${file.name.substr(-3)}`)
                )
                  .catch((error) => console.log(error))
                  .then((url) => {
                    resolve(url);
                  });
              });
          });
        });
      },
    },
    clipboard: {
      allowed: {
          tags: ['a', 'b', 'strong', 'u', 's', 'i', 'p', 'br', 'ul', 'ol', 'li', 'span', 'h1', 'h2', 'h3', 'img'],
          attributes: ['href', 'rel', 'target', 'class','src']
      },
      keepSelection: false,
      magicPasteLinks: true,
    },
  };
  let formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];
  return (
    <ReactQuill
      theme="snow"
      modules={modules}
      formats={formats}
      value={text}
      onChange={(e) => {
        props.sendValue(e);
      }}
    >
      <div className="my-editing-area" />
    </ReactQuill>
  );
}
