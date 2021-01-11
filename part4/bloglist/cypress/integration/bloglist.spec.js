describe('Bloglist app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset')

    const user = {
      name: 'Rinald',
      username: 'rinald',
      password: 'rinald085',
    }

    cy.request('POST', 'http://localhost:3003/api/users', user)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function () {
    cy.contains('log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.contains('login')
  })

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('rinald')
      cy.get('#password').type('rinald085')
      cy.get('#loginButton').click()

      cy.contains('blogs')
    })

    it('fails with wrong credentials', function () {
      cy.get('#username').type('rinald2')
      cy.get('#password').type('rinald085')
      cy.get('#loginButton').click()

      cy.contains('Wrong username or password')
      cy.get('.error').should('have.css', 'color', 'rgb(255, 0, 0)')
    })
  })

  describe.only('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'rinald', password: 'rinald085' })
      cy.createBlog({
        title: 'Example',
        author: 'Rinald',
        url: 'https://example.com',
      })
    })

    it('A new blog can be created', function () {
      cy.contains('create').click()

      cy.get('#title').type('test')
      cy.get('#author').type('tester')
      cy.get('#url').type('https://example.com/test')
      cy.get('#createButton').click()

      cy.contains('test tester')
    })

    it('A blog can be liked', function () {
      cy.contains('Example Rinald')

      cy.contains('view').click()
      cy.contains('likes 0')
      cy.contains('like').click()
      cy.contains('likes 1')
    })

    it('A blog can be deleted', function () {
      cy.contains('view').click()
      cy.contains('remove').click()

      cy.contains('Example Rinald').should('not.exist')
    })
  })
})
