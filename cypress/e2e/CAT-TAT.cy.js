describe("Central de Atendimento ao Cliente TAT", () => {
  beforeEach(() => cy.visit("./src/index.html"));

  it("verifica o título da aplicação", () => {
    cy.title().should("eq", "Central de Atendimento ao Cliente TAT");
  });

  it("preenche os campos obrigatórios e envia o formulário", () => {
    const longText = Cypress._.repeat("acbdefghijklmnopqrstuvwxyz", 10);
    cy.get("#firstName").type("João");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("joao@email.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('.button[type="submit"]').click();
    cy.get(".success").should("be.visible");
  });

  it("exibe mensagem de erro ao submeter o formulário com um email com formatação inválida", () => {
    const longText = Cypress._.repeat("acbdefghijklmnopqrstuvwxyz", 10);
    cy.get("#firstName").type("João");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("joao123");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('.button[type="submit"]').click();
    cy.get(".error").should("be.visible");
  });

  it("campo telefone continua vazio quando preenchido com um valor não-numerico", () => {
    cy.get("#phone").type("abcde").should("have.value", "");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    const longText = Cypress._.repeat("acbdefghijklmnopqrstuvwxyz", 10);
    cy.get("#firstName").type("João");
    cy.get("#lastName").type("Silva");
    cy.get("#email").type("joao123@email.com");
    cy.get("#phone-checkbox").check();
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });

  it("preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("João")
      .should("have.value", "João")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Silva")
      .should("have.value", "Silva")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("joao123@email.com")
      .should("have.value", "joao123@email.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("21993727877")
      .should("have.value", "21993727877")
      .clear()
      .should("have.value", "");
  });

  it("exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.get('.button[type="submit"]').click();

    cy.get(".error").should("be.visible");
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    cy.fillMandatoryFieldsAndSubmit();

    cy.get(".success").should("be.visible");
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });

  it("seleciona um produto (Mentoria) por seu valor (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });

  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"]').check("feedback").should("be.checked");
  });

  it("marca cada tipo de atendimento", () => {
    cy.get('input[type="radio"][name="atendimento-tat"]').each(
      ($el, index, $list) => {
        cy.wrap($el).check().should("be.checked");

        cy.log(`O radio ${index} foi checado com sucesso!`);
      },
    );
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get('input[type="file"]')
      .selectFile("cypress/fixtures/example.json")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get('input[type="file"]')
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("sampleFile");
    cy.get('input[type="file"]')
      .selectFile("@sampleFile", { action: "drag-drop" })
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.contains("a", "Política de Privacidade")
      .should("have.attr", "href", "privacy.html")
      .and("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.contains("a", "Política de Privacidade")
      .should("have.attr", "href", "privacy.html")
      .invoke("removeAttr", "target")
      .click();
    cy.url().should("include", "/privacy.html");
  });
});
