describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/')
  })
  it('We should land on the home page', () => {
    cy.wait(3000);
    cy.location(loc => {
      console.log(loc)
    })
  })
})
