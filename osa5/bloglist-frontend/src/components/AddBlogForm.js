import Notification from './Notification'
import blogService from '../services/blogs'
import { useState } from 'react'

const AddBlogForm = ( {blogs, setBlogs} ) => {

    const [newAuthor, setNewAuthor] = useState('')
    const [newTitle, setNewTitle] = useState('')
    const [newUrl, setNewUrl] = useState('')
    const [errorMessage, setErrorMessage] = useState(null)
    const [messageType, setMessageType] = useState('')

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

    const handleAddBlogClick = async(event) => {
        event.preventDefault();
    
        const blogObject = {
          author: newAuthor,
          title: newTitle,
          url: newUrl,
          likes: 0,
        }
    
        await blogService.create(blogObject)
        console.log('post', blogObject)
        setBlogs(blogs.concat(blogObject))
        setNewAuthor('')
        setNewTitle('')
        setNewUrl('')
        setErrorMessage(`Added ${blogObject.title}`)
        console.log('error message', errorMessage)
        setMessageType('success')
        setTimeout(() => {
          setErrorMessage(null)
          setMessageType('')
        }, 5000)
        console.log('blogs:', blogs)
      }
    return (
        <form onSubmit={handleAddBlogClick}>
            <h3>add new blog</h3>
            <Notification message={errorMessage} type={messageType}/>
            <input
              value={newAuthor}
              onChange={handleAuthorChange}
              placeholder='author'
            />
            <input
              value={newTitle}
              onChange={handleTitleChange}
              placeholder='title'
            />
            <input
              value={newUrl}
              onChange={handleUrlChange}
              placeholder='url'
            />
            <button type="submit">add</button>
        </form>
    )
}

export default AddBlogForm