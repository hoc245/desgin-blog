import React, { Component, useState } from "react";
import ReactQuill, { Quill } from "react-quill";
import { uploadBytes , ref as sRef, getDownloadURL , getMetadata } from "@firebase/storage";
import {storage } from '../firebase';
import { uid } from "uid";
import imageCompression from "browser-image-compression";

// #1 import quill-image-uploader
import ImageUploader from "quill-image-uploader";

// #2 register module
Quill.register("modules/imageUploader", ImageUploader);

class Editor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: ""
    };
  }
  uidd = uid();
  options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  }
  imageRef = ""
  modules = {
    // #3 Add "image" to the toolbar
    toolbar: [
        ['bold', 'italic', 'underline','strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
        ['link', 'image'],
        ['clean']
    ],
    // # 4 Add module and upload function
    imageUploader: {
      upload: file => {
        return new Promise((resolve, reject) => {
        //   const formData = new FormData();
        //   formData.append("image", file);
        //   console.log(file.name);
          this.imageRef = sRef(storage, `images/${this.uidd}.${file.name.substr(-3)}`);
          imageCompression(file,this.options)
            .then((compressFile) => {
                uploadBytes(this.imageRef , compressFile)
                .catch(error => {
                    reject("Upload failed");
                    console.error("Error:", error);
                })
                .then(() => {
                    getDownloadURL(sRef(storage, `images/${this.uidd}.${file.name.substr(-3)}`))
                        .catch(error => console.log(error))
                        .then(url => {
                            resolve(url)
                        })
                })
        })
        });
      }
    }
  };

  formats = [
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
    "imageBlot" // #5 Optinal if using custom formats
  ]

  render() {
    return (
      <ReactQuill
        theme="snow"
        modules={this.modules}
        formats={this.formats}
        value={this.state.text}
        onChange={this.props.sendValue}
      >
        <div className="my-editing-area" />
      </ReactQuill>
    );
  }
}

export default Editor;


