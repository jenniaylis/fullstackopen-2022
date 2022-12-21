describe('Blog ', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
        name: 'Jenni',
        username: 'jenniaylis',
        password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    cy.visit('http://localhost:3001')
  })

  it('Login form is shown', function() {
    cy.contains('Login')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
        cy.get('input[name="Username"]').type('jenniaylis') // with #username -> Timed out retrying after 4000ms: Expected to find element: #username, but never found it.
        cy.get('input[name="Password"]').type('salainen') // -> fix: use DOM-element details (check them on browser: developer tools > elements)
        cy.contains('login').click()
    
        cy.contains('Jenni logged in')
    })

    it('fails with wrong credentials', function() {
        cy.get('input:first').type('mluukkai')
        cy.get('input:last').type('salainen')
        cy.contains('login').click()
    
        cy.contains('wrong username or password')
        cy.get('.error').should('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
        cy.get('input:first').type('jenniaylis')
        cy.get('input:last').type('salainen')
        cy.contains('login').click()
    })

    it('A blog can be created', function() {
        cy.contains('add new blog').click()
        cy.get('input[placeholder="title"]').type('another blog')
        cy.get('input[placeholder="author"]').type('cypress')
        cy.get('input[placeholder="url"]').type('google.com')
        cy.get('button[type="submit"]').click()

        cy.wait(5500) // because new blog is displayed to the list after 5 secs
        cy.get('div[class="box"]').contains('another blog')
    })
  })
})