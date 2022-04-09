// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })


Cypress.Commands.add('scrollToBottom', (num) => {
    var i 
    var arrayLength
    var flag = 5
    for (i = 0; i<4; i++) { //no puedo cortar este for, asi que no sirve mucho la funcion asi como está.
        // cy.log('i ',i)
        cy.scrollTo('bottom')
        cy.wait(1000)

        cy.get('div>div:nth-child(3)>span').then(($array) => {
            arrayLength = $array.length
            // cy.log('largo',arrayLength)
            // cy.wrap(arrayLength).as('largoArray')

            // cy.log('arraylength', arrayLength)
            // cy.log('num', num)
            if(arrayLength == num) {
                cy.log('inside ifffffffffffffffffffffffffffffffffffffffff')
                i = 505;
                // cy.log('i2: ',i)
                flag = 8
                return false;
            }

        })

        // cy.log('flag', flag)
        if(flag == 8){
            break;
        }
       
    }
})

Cypress.Commands.add('searchCharacterById', (characterId) => {
    cy.request({
        method: 'GET',
        url: 'https://restool-sample-app.herokuapp.com/api/character/' + characterId,
        form: true           
    }).then((response) => { 
        expect(response.status).to.eq(200)
        expect(response.body).to.not.be.null
        return response.body
    })
})

Cypress.Commands.add('searchCharactersFromBackend', () => {
    cy.request({
        method: 'GET',
        url: 'https://restool-sample-app.herokuapp.com/api/character',
        form: true           
    }).then((response) => { 
        expect(response.status).to.eq(200)
        expect(response.body).to.not.be.null
        return response.body.items
    })
})

