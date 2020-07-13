context('Login', () => {
    beforeEach(() => cy.visit('/login'));

    it("Ver detalle de una nota", () => {
        cy.get("#emailInput").click();
        cy.get("#emailInput").type("kikescovino@gmail.com");
        cy.get("#passwordInput").click();
        cy.get("#passwordInput").type("Passw0rd!");
        cy.get("#loginButton").should("be.enabled");
        cy.get("#loginButton").click();
        cy.wait(4000);
        cy.get("#notesTab").click();
        cy.wait(4000);
        cy.get("a").contains("HoHoHoHo").click();
        cy.wait(4000);
    });
})