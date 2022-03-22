/// <reference types="cypress" />
//nose para q es esto. nose si de la extension

//const { describe } = require("mocha");

var number_for_email = 100;

describe('automation practice website', () => {
    before(() => {
        cy.visit('http://automationpractice.com/index.php')
    }) 

    it('browser title is My Store', () => {
        cy.title().should('eq','My Store')
    })

    it('sign in button appears', () => {
        //cy.get('.login')//no se que selector usar//si se usara en dos lados distintos es choto esto. 
        cy.get('.login').parent().should('have.class', 'header_user_info')//entonces puedo buscar el parent de esto y buecar que sea el header
        //cy.get('.header_user_info .login') //o puedo hacer esto pero la desventaja de esto ultimo es que estamos como usando xpath 
                                            //y si llegan a agregar un div en el medio ya me rompe.
    })


    context('in sign in page', () => {
        before(() => {
            cy.get('.login').click()
        })

        it('browser title is Login - My Store', () => {
            cy.title().should('eq','Login - My Store')
        })

        it('URL is My account', () => {
            cy.url().should('eq','http://automationpractice.com/index.php?controller=authentication&back=my-account')
        })


        it('can create account', () => {
            cy.get('#email_create').type('mail_santiago@gmail.com'+number_for_email++)

            cy.get('#SubmitCreate').click()
        })


        context('in account creation page', () => {
            before(() => {
                cy.get('#email_create').type('mail_santiago@gmail.com'+number_for_email++)
                cy.get('#SubmitCreate').click()
            })

            var firstName = 'Santiago'
            var lastName = 'Orlando'

            it('URL is account creation', () => {
                cy.url().should('eq','http://automationpractice.com/index.php?controller=authentication&back=my-account#account-creation')
            })


            it('can check title field', () => {
                cy.get('#id_gender1').click()
            })

            it('first name field title is visible', () => {
                cy.get('#customer_firstname').parent().find('label').should('contain','First name')
            })

            it('can add first name', () => {
                cy.get('#customer_firstname').type(firstName)
                cy.get('#customer_firstname').should('have.value',firstName)
            })

            it('can add last name', () => {
                cy.get('#customer_lastname').type(lastName)
            })

            it('can modify email', () => {
                cy.get('#email').clear().type('mail_santiago@gmail.com'+number_for_email++)
            })

            it('can add password', () => {
                cy.get('#passwd').type('123456')
            })

            it('can add date of birth', () => {
                cy.get('#days').select('4')
                cy.get('#months').select('March')
                cy.get('#years').select('2019')
            })

            it('can sign up for newsletter', () => {
                cy.get('#newsletter').click()
            })

            it('can sign up for offers', () => {
                cy.get('#uniform-optin').click()
            })

            it('check address section has first and last name entered before', () => {
                cy.get('#firstname').should('have.value',firstName)
                cy.get('#lastname').should('have.value',lastName)
            })

            it('can add company', () => {
                cy.get('#company').type('compania')
            })

            it('can add address', () => {
                cy.get('#address1').type('av corrientes')
                cy.get('#address2').type('1000')
            })

            it('can add city', () => {
                cy.get('#city').type('bs as')
            })
            
            it('can select state', () => {
                cy.get('#id_state').select('Alaska')
            })

            it('can add zip or postal code', () => {
                cy.get('#postcode').type('12000')
            })

            it('can select country', () => {
                cy.get('#id_country').select('United States')
            })

            it('can add additional information', () => {
                cy.get('#other').type('texto')
            })

            it('can add home phone', () => {
                cy.get('#phone').type('12345678')
            })

            it('can add mobile phone', () => {
                cy.get('#phone_mobile').type('1122334455')
            })

            it('can add an address alias', () => {
                cy.get('#alias').type('santiagos address')
            })

            it('can submit form', () => {
                cy.get('#submitAccount').click()
            })


        })

    })

})