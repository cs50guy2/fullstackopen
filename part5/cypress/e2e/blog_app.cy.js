describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3001/api/testing/reset');
    const user = {
      name: 'abc man',
      username: 'abcd',
      password: 'asdf',
    };
    cy.request('POST', 'http://localhost:3001/api/users/', user);
    cy.visit('http://localhost:3000');
  });
  it('Login form is shown', function () {
    cy.contains('log in to application');
    cy.contains('username');
    cy.contains('password');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.get('#username').type('abcd');
      cy.get('#password').type('asdf');
      cy.get('#login-button').click();
      cy.contains('abc man logged-in');
    });
    it('fails with wrong credentials', function () {
      cy.get('#username').type('abcd');
      cy.get('#password').type('badpassword');
      cy.get('#login-button').click();
      cy.get('#notification').should('contain', 'wrong credentials');
      cy.get('#notification').should('have.css', 'color', 'rgb(255, 0, 0)');
    });
  });
  describe('When logged in', function () {
    beforeEach(function () {
      cy.login({ username: 'abcd', password: 'asdf' });
    });

    it('A blog can be created', function () {
      cy.contains('create blog').click();
      cy.get('#title').type('harry potter');
      cy.get('#author').type('jane austin');
      cy.get('#url').type('https://www.books.com');
      cy.get('#create').click();
      cy.contains('harry potter jane austin');
    });
    describe('and a blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'batman returns',
          author: 'kyle',
          url: 'https://www.iamthebat.com',
        });
      });
      it('a blog can be liked', function () {
        cy.contains('batman returns kyle')
          .contains('view')
          .click()
          .get('#likes')
          .click();
        cy.contains('likes 1');
      });
      it('a blog can be deleted', function () {
        cy.contains('batman returns kyle').contains('remove').click();
        cy.contains('batman returns kyle').should('not.exist');
      });
    });
    describe('and a multiple blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'batman origin',
          author: 'kyle',
          url: 'https://www.iamthebat.com',
        });
        cy.createBlog({
          title: 'batman returns',
          author: 'kyle',
          url: 'https://www.iamthebat.com',
        });
        cy.createBlog({
          title: 'batman forever',
          author: 'kyle',
          url: 'https://www.iamthebat.com',
        });
      });
      it('blogs are sorted by highest likes', function () {
        cy.contains('batman origin kyle').contains('view').click();
        cy.contains('batman returns kyle').contains('view').click();
        cy.contains('batman forever kyle').contains('view').click();

        cy.contains('batman origin')
          .find('#likes')
          .click()
          .wait(1)
          .click()
          .wait(1);
        cy.contains('batman returns')
          .find('#likes')
          .click()
          .wait(1)
          .click()
          .wait(1)
          .click()
          .wait(1);
        cy.contains('batman forever').find('#likes').click();

        cy.get('.blog').eq(0).should('contain', 'batman returns');
        cy.get('.blog').eq(1).should('contain', 'batman origin');
        cy.get('.blog').eq(2).should('contain', 'batman forever');
      });
    });
  });
});
