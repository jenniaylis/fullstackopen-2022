import PersonForm from './components/PersonForm'
import Contacts from './components/Contacts'
import Notification from './components/Notification'
import personService from './services/person'
import './App.css'
import { useState, useEffect } from 'react'


const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])


  const handleAddClick = (event) => {
    event.preventDefault() // preventing the page to refresh, not always necessary but keep this in mind :)
    console.log('set new name')

    const nameObject = {
      name: newName,
      number: newNumber,
    }

    // if new name is included to phonebook:
    const found = persons.find(person => person.name === newName)
    if (found) {
      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with new one?`)) {
        const filteredPerson = persons.filter(person => person.name === newName)
        const personId = filteredPerson[0].id
        personService
          .update(personId, nameObject)
          .then(returnedPerson => {
            setPersons(persons.map(person => person.name != newName ? person : returnedPerson))
            setPersons(persons.filter(person => person.name !== newName))
            console.log(`${newName} successfully updated`)
            window.location.reload()
          })
          .catch(error => {
            if(error.response.status===400) {
              //setPersons(persons.filter(person => person.name !== newName))
              setMessage(error.response.data.error)
              setMessageType('error')
              setTimeout(() => {
                setMessage(null)
                setMessageType('')
              }, 3000)
            } else {
            setMessageType('error')
            setMessage(`The person '${newName}' was already deleted from server`)
            setTimeout(() => {
              setMessage(null)
              setMessageType('')
            }, 3000)
          }})
        //setPersons(persons.filter(person => person.name !== newName))
        //console.log(`${newName} successfully updated`)
        setNewName('')
        setNewNumber('')
        //window.location.reload()
        //setTimeout(() => window.location.reload(), 2000) // refresh page after 2 secs
        return
      } else {
        setNewName('')
        setNewNumber('')
        return
      }
    }

    // if new name is not included to phonebook:
    if(!found) {
      personService
      .create(nameObject)
      .then(response => {
        console.log('post', response)
        setPersons(persons.concat(nameObject))
        setMessageType('success')
        setMessage(`Added ${nameObject.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 3000)
      }).catch(error => {
        console.log('error', error.response.data.error)
        setMessageType('error')
        setMessage(error.response.data.error)
        setTimeout(() => {
          setMessage(null)
          setMessageType('')
        }, 3000)
      })

      console.log('names: ', {persons})
      setNewName('') // clearing the input field
      setNewNumber('')
    }
  }

  const deletePerson = (id) => {
    console.log('delete person')
    const filteredPerson = persons.filter(person => person.id === id)
    const personName = filteredPerson[0].name
    const personId = filteredPerson[0].id
    if (window.confirm(`Delete ${personName} ?`)) {
      personService
        .remove(personId)
      console.log(`${personName} successfully deleted`)
      setPersons(persons.filter(person => person.id !== personId))
    }
  }


  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }
  const handleFilterChange = (event) => {
    setNewFilter(event.target.value)
  }

  // if filter is empty:
  if (newFilter === '') {
    return (
      <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <PersonForm 
      handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}
      newName={newName}
      newNumber={newNumber}
      handleAddClick={handleAddClick}
      />

      <h2>Numbers</h2>
      <div>
        <p>filter shown with <input onChange={handleFilterChange} placeholder={'search name'}></input></p>
      </div>
      <Contacts persons={persons} deletePerson={deletePerson} />
    </div>
    )
    // if filter is not empty:
  } else {
    return (
      <div>
      <h2>Phonebook</h2>
      <Notification message={message} type={messageType} />
      <PersonForm 
      handleNameChange={handleNameChange}
      handleNumberChange={handleNumberChange}
      newName={newName}
      newNumber={newNumber}
      handleAddClick={handleAddClick}
      />

      <h2>Numbers</h2>
      <div>
        <p>filter shown with <input onChange={handleFilterChange} placeholder={'search name'}></input></p>
      </div>
      <Contacts persons={filteredPersons} deletePerson={deletePerson}/>
    </div>
    )
  }
}

export default App
