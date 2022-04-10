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


Cypress.Commands.add('createCharacterPost', (isAlive, location, name, realName, thumbnail) => {
    cy.request({
        method: 'POST',
        url: 'https://restool-sample-app.herokuapp.com/api/character',
        form:true,
        body:{
            "isAlive": isAlive,
            "location": location,
            "name": name,
            "realName": realName,
            "thumbnail": thumbnail
        }           
    }).then(async function (response) { 
        await expect(response.status).to.eq(200)
        return response.body //return the created character
    })
})


Cypress.Commands.add('verifyCreatedCharacterInFront', (id, isAlive, location, name, realName, thumbnail) => {
    cy.get('.infinite-scroll-component .card:last-child').then((card) => {
        cy.wrap(card).contains('ID').siblings().should('have.text', id)
        cy.wrap(card).contains('Name').siblings().should('have.text', name)
        cy.wrap(card).contains('Real Name').siblings().should('have.text', realName)
        cy.wrap(card).contains('Location').siblings().should('have.text', location)
        cy.wrap(card).contains('Alive').siblings().should('have.class', isAlive) //si está en false falla algo porque en el front se pone true
        // el tema es que es algo de cypress pq con postman ese error no pasa. Pero al backend si se le envia bien el false.
        cy.wrap(card).find('img').should('have.attr', 'src', thumbnail)
    })
})


Cypress.Commands.add('verifyPostInFrontend', (isAlive, location, name, realName, thumbnail) => {
    
    cy.createCharacterPost(isAlive, location, name, realName, thumbnail).then((character) => { 
        cy.wrap(character.id).as('newId')
    })

    cy.viewport(1080,1080); //depende de que tamano tenga anda bien o mal. Si comento esta linea (con 1920x1080) los 3 personajes del medio (jon sansa arya) no aparecen. Capaz es un bug nose.
    cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

    cy.get('p.pagination-state').invoke('text').then(($text) => { //hago esto para guardar la catnt de items del 'showing x items'. y desp usarlo para esperar a que los encuentre
        var totalItems = $text.split(' ')[1]
        cy.wrap(totalItems).as('numberOfCharacters')
    })

    cy.get('@numberOfCharacters').then( num => {
        // cy.log(num); //parece que anda
        cy.scrollToBottom(num)
    })

    cy.log('after for')

//que manera de testear lo del front es mejor????
    cy.get('@newId').then((id) => {
        cy.get('div:last-child > div:nth-child(2) > span').contains(id) //opcion 1 - selector mas generico pero mas corto
        cy.get('.infinite-scroll-component .card:last-child > div:nth-child(2) > span').contains(id) //opcion 2 - selector mas especifico pero mas largo

        cy.get('.infinite-scroll-component .card:last-child').then( function (card) {
            cy.wrap(card).contains('ID').siblings().should('have.text', id) //opcion 3 - busco por el campo ID (un poco mas declarativo) y si agrego un campo mas no romperia
            // cy.wrap(card).contains('Name').siblings().should('have.text', name)
            // cy.wrap(card).contains('Real Name').siblings().should('have.text', realName)
            // cy.wrap(card).contains('Location').siblings().should('have.text', location)
            // cy.wrap(card).contains('Alive').siblings().should('have.class', isAlive) 
            // cy.wrap(card).find('img').should('have.attr', 'src', thumbnail)
        }) 
        //cuando resuelva la duda borrar esto que esta hecho en la funcion de abajo
        cy.verifyCreatedCharacterInFront(id ,isAlive, location, name, realName, thumbnail)
    })
})


Cypress.Commands.add('deleteCharacter', (id) => {
    cy.request({
        method: 'DELETE',
        url: 'https://restool-sample-app.herokuapp.com/api/character/' + id          
    })
})

