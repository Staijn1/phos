describe('My First Test', () => {
  beforeEach(() => {
    cy.visit('http://localhost:4200/')
  })
  it('Does not do much!', () => {
    expect(cy.url()).equal('http://localhost:4200/home')
  })
})
