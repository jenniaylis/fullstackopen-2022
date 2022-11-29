import { useState, useEffect } from "react"
import './App.css'
import blogService from './services/blog'
import axios from "axios"
import blog from "./services/blog"

function App() {
  const [blogs, setBlogs] = useState([
    {
      author: 'Nalle Puh',
      title: 'Tarinoita Puolenhehtaarin metsästä',
      url: 'www.google.com',
      likes: 5
    }
  ])
  const [newAuthor, setNewAuthor] = useState('')
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')

  useEffect(() => {
    console.log('effect')
    blogService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setBlogs(response.data)
      })
  }, [])

  const handleAddBlogClick = (event) => {
    event.preventDefault();

    const blogObject = {
      author: newAuthor,
      title: newTitle,
      url: newUrl,
      likes: 0,
    }

    blogService
    .create(blogObject)
    .then(response => {
      console.log('post', response.data)
      setBlogs(blogs.concat(response.data))
      setNewAuthor('')
      setNewTitle('')
      setNewUrl('')
    })
    console.log('blogs:', blogs)
  }


  const handleLikeClick = (name) => {
    console.log('clicked like to', name)
    const likedBlog = blogs.filter(blog => blog.title===name)
    console.log('liked blog', likedBlog[0])
    const likes = likedBlog[0].likes + 1
    console.log('new likes', likes)

    const changedBlog = {
      author: likedBlog[0].author,
      title: likedBlog[0].title,
      url: likedBlog[0].url,
      likes: likes
    }

    blogService
    .update(likedBlog[0].id, changedBlog)
    .then(response => {
      setBlogs(blogs.map(blog => blog.id !== likedBlog[0].id ? blog : response.data))
    })
  }


  const handleAuthorChange = (event) => {
    console.log(event.target.value)
    setNewAuthor(event.target.value)
  }
  const handleTitleChange = (event) => {
    console.log(event.target.value)
    setNewTitle(event.target.value)
  }
  const handleUrlChange = (event) => {
    console.log(event.target.value)
    setNewUrl(event.target.value)
  }


  return (
    <div className="App">
      <h1>Blogs</h1>
      <p>Add new blog below</p>
      <form onSubmit={handleAddBlogClick}>
        <input placeholder="author" value={newAuthor} onChange={handleAuthorChange}></input>
        <input placeholder="title" value={newTitle} onChange={handleTitleChange}></input>
        <input placeholder="url" value={newUrl} onChange={handleUrlChange}></input>
        <button>add</button>
      </form>
      <h2>All Blogs</h2>
      <div>
        {blogs.map((blog, id) => <div key={id} className="box"> 
        <p><b>{blog.title}</b> by {blog.author}</p>
         <a href={blog.url}>{blog.url}</a>
         <p className="liketext">Likes {blog.likes}</p>
         <button className="likebutton" onClick={() => handleLikeClick(blog.title)}>Like ♥</button>
      </div>)}
      </div>
    </div>
  );
}

export default App;
