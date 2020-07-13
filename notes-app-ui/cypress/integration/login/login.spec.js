context('Login', () => {
    beforeEach(() => cy.visit('/login'));

    it("Login campos vacios", () => {
        cy.get("#emailInput").click();
        cy.get("#loginButton").should("be.disabled");
    });

    it("Login campo password vacio", () => {
        cy.get("#emailInput").click();
        cy.get("#emailInput").type("kikescovino@gmail.com");
        cy.get("#loginButton").should("be.disabled");
    });

    it("Login campo email vacio", () => {
        cy.get("#passwordInput").click();
        cy.get("#passwordInput").type("Passw0rd!");
        cy.get("#loginButton").should("be.disabled");
    });

    it("Login campo email vacio", () => {
        cy.get("#emailInput").click();
        cy.get("#emailInput").type("kikescovino@gmail.com");
        cy.get("#passwordInput").click();
        cy.get("#passwordInput").type("Passw0rd!");
        cy.get("#loginButton").should("be.enabled");
        cy.get("#loginButton").click();
        cy.wait(4000);
        cy.get("#notesTab").click();
        cy.wait(4000);
        cy.get("#logoutTab").click();
        cy.wait(4000);
    });
})