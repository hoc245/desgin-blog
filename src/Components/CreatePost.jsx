import React, { useEffect, useState } from 'react';
import Button from './Button';
import ReactQuill from 'react-quill';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import imageCompression from "browser-image-compression";
import {auth , db, storage} from '../firebase';
import { ref, onValue , set , update } from "firebase/database";

export default function CreatePost(props) {
    const [value, setValue] = useState('');
    const [tags,setTags] = useState();
    const [selected, setSelected] = useState();
    const [hasLogin,setHaslogin] = useState(false);
    useEffect(() => {
      auth.onAuthStateChanged(user => {
        if(user) {
            setHaslogin(true);
        }
      })
    },[])
    var mFile;
    let mm = 0
    let dd = 0
    let currentSelectDay = ""
    if (selected) {
      mm = selected.getMonth() + 1; // Months start at 0!
      dd = selected.getDate();
  
      if (dd < 10) dd = '0' + dd;
      if (mm < 10) mm = '0' + mm;
      currentSelectDay = dd + "/" + mm + "/" + selected.getFullYear()
    } else {
      currentSelectDay = "Select a day"
    }
    const addTag = (e) => {
      const value = e.currentTarget.innerHTML;
      const input = document.querySelector('.tags-input')
      const mArray = tags && tags.length > 0 ? tags.slice() : [];
      const allTags = document.querySelectorAll('.post-tags-suggestion .tag');
      if(mArray === [] || mArray === null || mArray.indexOf(value) === -1) {
        mArray.push(value);
        setTags(mArray);
        input.value = "";
        [].forEach.call(allTags, tag => {
          tag.classList.remove('is-active');
        })
      }
    }
    const removeTag = (e) => {
      const mArray = tags.slice()
      const value = e.currentTarget.innerHTML;
      mArray.splice(mArray.indexOf(value),1)
      setTags(mArray);
    }
    useEffect(() => {
      if(props.trigger) {
        let popup = document.querySelector('.create-post');
        document.body.style.overflow = "hidden";
        popup.classList.add('is-active')
      } else {
        document.body.style.overflow = "auto"
      }
    })
    var modules = {
        toolbar: [
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
      }
    var formats = [
      'bold', 'italic', 'underline', 'strike', 'blockquote',
      'list', 'bullet', 'indent',
      'link', 'image'
    ]
    const tagsSuggestion = (e) => {
        const value = e.currentTarget.value;
        const tags = document.querySelectorAll('.post-tags-suggestion .tag');
        if(value) {
            [].forEach.call(tags, tag => {
            if(tag.innerHTML.toLowerCase().includes(value)) {
                tag.classList.add('is-active');
            } else {
                tag.classList.remove('is-active');
            }
            })
        } else {
            [].forEach.call(tags, tag => {
            tag.classList.remove('is-active');
            })
        } 
    }
    const handleCatalogue = (e) => {
      const value = e.currentTarget.innerHTML;
      const catalogue = document.querySelector('.dropdown-catalogies-title-value');
      if(value === catalogue.innerHTML) {
        catalogue.innerHTML = "Choose catalogue";
      } else {
        catalogue.innerHTML = value;
      }
      document.querySelector('.dropdown-catalogies-menu').classList.toggle('is-active')
    }
    const handleDaypicker = (e) => {
      setSelected(e);
      document.querySelector('.daypicker').classList.toggle('is-active')
    }
    const closePopup = () => {
      let popup = document.querySelector('.create-post');
      popup.classList.remove('is-active');
      setTimeout(() => {
        props.setCreatePost(false)
      },200)
    }
    const newPost = () => {
      const createAt = selected ? selected.getTime() : new Date().getTime();
      const catalogies = document.querySelector('.dropdown-catalogies-title-value').innerHTML;
      const source = document.querySelector('.post-create-source input').value;
      var tags = {};
      let selectedTags = document.querySelectorAll('.tag.is-selected');
      [].forEach.call(selectedTags, item => {
        tags[`${item.innerHTML.replace("/","-")}`] = true;
      })
      const image = document.querySelector('.post-banner-preview img').src;
      const title = document.querySelector('.post-content-header').value;
      const subTitle = document.querySelector('.post-content-sub').value;
      const body = value;
      const valid = checkValid();
      var mPost = {
        createAt : "",
        catalogies : "",
        source : "",
        tags : "",
        image : "",
        title : "",
        description : "",
        body : "",
      }
      mPost[`createAt`] = createAt;
      mPost[`catalogies`] = catalogies;
      mPost[`source`] = source;
      mPost[`tags`] = tags;
      mPost[`image`] = image;
      mPost[`title`] = title;
      mPost[`description`] = subTitle;
      mPost[`body`] = body
      if(valid) {
        console.log('valid');
        set(ref(db, `/postThumb/${createAt}`),{
          catalogies : mPost.catalogies,
          description : mPost.description,
          image : mPost.image,
          tags : mPost.tags,
          title : mPost.title,
        });
        set(ref(db, `/postDetail/${createAt}`),mPost);
      } else {
        console.log('invalid');
        console.log('something went wrong');
      }
    }
    const checkValid = () => {
      const catalogies = document.querySelector('.dropdown-catalogies-title-value').innerHTML;
      var tags = {};
      let selectedTags = document.querySelectorAll('.tag.is-selected');
      [].forEach.call(selectedTags, item => {
        tags[`${item.innerHTML.replace("/","-")}`] = true;
      })
      const image = document.querySelector('.post-banner-preview img').src;
      const title = document.querySelector('.post-content-header').value;
      const body = value;
      // Container
      const daypickerSection = document.querySelector('.post-create-day');
      const catalogiesSection = document.querySelector('.post-catalogies');
      const tagsSection = document.querySelector('.post-tags');
      const bannerSection = document.querySelector('.post-banner');
      const contentSection = document.querySelector('.post-content');
      if(!selected) {
        daypickerSection.classList.add('is-invalid');
        console.log(`Error at: daypickerSection`)
      } else {
        daypickerSection.classList.remove('is-invalid');
      }
      if(catalogies === "") {
        catalogiesSection.classList.add('is-invalid');
        console.log(`Error at: catalogiesSection`)
      } else {
        catalogiesSection.classList.remove('is-invalid');
      }
      if(!Object.keys(tags).length) {
        console.log(tags);
        tagsSection.classList.add('is-invalid');
        console.log(`Error at: tagsSection`)
      } else {
        tagsSection.classList.remove('is-invalid');
      }
      if(!image || image === "") {
        bannerSection.classList.add('is-invalid');
      } else {
        bannerSection.classList.remove('is-invalid');
      }
      if(title === "" || body === "") {
        contentSection.classList.add('is-invalid');
        console.log(`Error at: contentSection`)
      } else {
        contentSection.classList.remove('is-invalid');
      }
      const invalid = document.querySelectorAll('.is-invalid');
      if(invalid.length) {
        return false
      } else {
        return true
      }

    }
    const handleFile = async (e) => {
      const options = {
        maxSizeMB: 2,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      }
      const [file] = await e.currentTarget.files;
      const time = new Date();
      const fileName = `${time.getTime()}${file.name}`;
      const preview = document.querySelector('.post-banner-preview img');
      if(file) {
          await imageCompression(file,options)
            .then((compressFile) => {
              preview.src = URL.createObjectURL(compressFile);
              preview.setAttribute('alt',fileName);
              mFile = Object.assign({},{
                file : compressFile,
                name : fileName
            })
        })
      }
    }
    return props.trigger ? (
      <>
        {hasLogin ? 
        <>
          <div className='create-post popup'>
            <Button iconLeft='close' state='is-filled popup-close' onClick={() => {closePopup()}}/>
            <div className='popup-container'>
              <section className='popup-title'>
                <h2>Create post</h2>
              </section>
              <section className='post-option'>
                <div className='post-catalogies'>
                  <h3>Catalogue</h3>
                  <div className='dropdown-catalogies'>
                    <div className='dropdown-catalogies-title' onClick={(e) => {e.currentTarget.nextSibling.classList.toggle('is-active')}}>
                      <span className="dropdown-catalogies-title-value">Choose catalogue</span> 
                      <span class="material-symbols-outlined">
                      navigate_next
                      </span>
                    </div>
                    <div className='dropdown-catalogies-menu'>
                      <p className='dropdown-catalogies-item' onClick={(e) => {handleCatalogue(e)}}>Graphic Design</p>
                      <p className='dropdown-catalogies-item' onClick={(e) => {handleCatalogue(e)}}>UI/UX Design</p>
                    </div>
                  </div>
                </div>
                <div className='post-create-day'>
                  <h3>Create at</h3>
                  <p onClick={(e) => {e.currentTarget.nextSibling.classList.toggle('is-active')}}>{currentSelectDay}</p>
                  <DayPicker className='daypicker'
                    mode="single"
                    selected={selected}
                    onSelect={(e) => {handleDaypicker(e)}}
                    />
                </div>
                <div className='post-create-source'>
                  <h3>Source (optional)</h3>
                  <input type={"text"} placeholder={"Link to post source"}/>
                </div>
                <div className='post-tags'>
                  <h3>Tags</h3>
                  <div className='post-tags-result'>
                    <div className='tags-selected'>
                      {tags && tags.map(tag => {
                        return <span key={`post-tags-${tag}`} className='tag is-selected' onClick={(e) => {removeTag(e)}}>{tag}</span>
                      })}
                    </div>
                    <input className='tags-input' type={"text"} placeholder={"Graphic, UI/UX..."} onChange={(e) => {tagsSuggestion(e)}} onFocus={(e) => {e.currentTarget.classList.add('is-focus')}} onBlur={(e) => {e.currentTarget.classList.remove('is-focus')}}/>
                  </div>
                  <div className='post-tags-suggestion'>
                    <span className='tag' onClick={(e) => {addTag(e)}}>Graphic</span>
                    <span className='tag' onClick={(e) => {addTag(e)}}>UI/UX</span>
                    <span className='tag' onClick={(e) => {addTag(e)}}>Trends</span>
                  </div>
                </div>
              </section>
              <section className='post-banner'>
                <h3>Banner</h3>
                <div className='post-banner-preview'>
                  <label htmlFor='banner-upload'>
                    <Button value="Upload" iconLeft={"add_photo_alternate"}/>
                    <input id='banner-upload' type="file" accept={"image/png, image/gif, image/jpeg"} name="filename" onChange={(e) => handleFile(e)} />
                  </label>
                  <img src='' alt='preview' />
                </div>
              </section>
              <section className='post-content'>
                <h3>Title</h3>
                <textarea className='post-content-header' rows={1}></textarea>
                <h3>Sub-title</h3>
                <textarea className='post-content-sub' rows={3}></textarea>
                <h3>Main</h3>
                <ReactQuill modules={modules} formats={formats} theme="snow" value={value} onChange={setValue} />
              </section>
              <section className="post-action">
                <Button value={"Create post"} iconLeft="add" onClick={() => newPost()}/>
                <Button value={"Cancel"} iconLeft="remove" state='is-ghost' onClick={() => {closePopup()}}/>
              </section>
            </div>
            <div className='popup-overlay'></div>
          </div>
        </>
         : 
        <>
        <div className='create-post popup' style={{display : "flex",'alignItems' : "center"}}>
            <Button iconLeft='close' state='is-filled popup-close' onClick={() => {closePopup()}}/>
            <div className='popup-container' >
              <section className='popup-title'>
                <h2 style={{'text-align': "center",width : "100%"}}>Sign in to create a post</h2>
              </section>
              <section>
                <img style={{height:"300px"}} src='https://i.pinimg.com/originals/65/dc/a6/65dca69f78972935caf61580e7c17bd9.png' />
              </section>
            </div>
            <div className='popup-overlay'></div>
          </div>
        </>}
      </>
    ) : ( <></> )
  }