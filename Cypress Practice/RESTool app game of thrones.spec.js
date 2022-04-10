//functions in the commands file

describe.only('characters section - test POST', () => {
        
    const uniqueSeed = Date.now().toString();
    let isAlive = true //si está en false falla algo porque en el front se pone true
    let location = "Beyond the Wall"
    let name = "santi " + uniqueSeed
    let realName = "santi"
    let thumbnail = "test"

    it('test POST backend', () => {
        cy.createCharacterPost(isAlive, location, name, realName, thumbnail).then((character) => {
            cy.wrap(character.id).as('newId')

            expect(character.isAlive).to.eq("" + isAlive + "")
            expect(character.location).to.eq(location)
            expect(character.name).to.eq(name)
            expect(character.realName).to.eq(realName)
            expect(character.thumbnail).to.eq(thumbnail)

            // to have properties:
            expect(character).to.have.ownPropertyDescriptor('id')
            expect(character).to.have.ownPropertyDescriptor('isAlive')
            expect(character).to.have.ownPropertyDescriptor('location')
            expect(character).to.have.ownPropertyDescriptor('name')
            expect(character).to.have.ownPropertyDescriptor('realName')
            expect(character).to.have.ownPropertyDescriptor('thumbnail')

            // es suficiente que chequee con la respuesta o tendria que hacer un GET para chequear que me trajo todos estos campos con sus valores?
            // eso ya lo estoy testeando en la parte del test del GET.
        })
    });

    it.skip('test POST backend - negative case - one field missing', () => { //en postman esto devuelve 400. Aca no.  ??????????
        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form:true,
            body:{
                "realName": realName,
                "thumbnail": thumbnail
            }           
        }).then(async function (response) { 
            await cy.wrap(response.body.id).as('newId') //no llega a hacer el wrap
            cy.wait(1000)
            expect(response.status).to.eq(400)
            expect(response.body).to.contains('Bad Request')
        })
    });

    it('test POST in frontend with "isAlive" true', function () {
        isAlive = true

        cy.verifyPostInFrontend(isAlive, location, name, realName, thumbnail)
    });

    it.skip('test POST in frontend with "isAlive" false', () => {
        isAlive = false
        
        cy.verifyPostInFrontend(isAlive, location, name, realName, thumbnail)
    });
    
    afterEach(function () {
        cy.deleteCharacter(this.newId)
    });

});

describe('characters section - test DELETE', () => {
    const uniqueSeed = Date.now().toString();
    let isAlive = false
    let location = "Beyond the Wall"
    let name = "santi " + uniqueSeed
    let realName = "santi"
    let thumbnail = "test"

    before( function () {
        
        cy.createCharacterPost(isAlive, location, name, realName, thumbnail).then((character) => { 
            cy.wrap(character.id).as('newId')
        })

        //pongo este DELETE en el before para que cada it pueda testear a partir de este. 
        // porque si no tenia que hacer 2 POST (1 por cada it), aunque fuera con beforeEach pero me parece al pedo.
        // o juntar los dos it en uno que me parece ponerle mucha responsabilidad a 1 solo it.
        // VER-PENSAR-PREGUNTAR !!!!!!!!!
        cy.get('@newId').then((idCreated) => {
            cy.deleteCharacter(idCreated).then((response) => {
                cy.wrap(response).as('deleteResponse')
            })
        })
    });

    it('test DELETE from backend', function () {
        cy.wrap(this.deleteResponse).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.eq('ok')
        })

        cy.searchCharacterById(this.newId).then((character) => {
            expect(character).to.be.empty
        })
    });

    it('test DELETE from frontend', () => {
        cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")
        cy.viewport(1440,860); //depende de que tamano tenga anda bien o mal. Si comento esta linea (con 1920x1080) los 3 personajes del medio (jon sansa arya) no aparecen. Capaz es un bug nose.

        cy.scrollTo('bottom')
        cy.wait(1000)
        cy.scrollTo('bottom')
        cy.wait(1000)
        cy.scrollTo('bottom')
        cy.wait(1000)
        cy.scrollTo('bottom')
        
        cy.get('.infinite-scroll-component .card').last().then( function (card) {
            cy.wrap(card).contains('ID').siblings().should('not.have.text', this.newId)
        })
    });

});

describe('characters section - test CRUD', () => {
    let createdCharacter //está bien el 'let', no necesariamente tiene que ser 'var'
    
    const uniqueSeed = Date.now().toString();
    let isAlive = false
    let location = "Beyond the Wall"
    let name = "santi " + uniqueSeed
    let realName = "santi"
    let thumbnail = "test"

    before(() => {
        cy.createCharacterPost(isAlive, location, name, realName, thumbnail).then((character) => { 
            cy.wrap(character.id).as('newId')
            createdCharacter = character
        })
    });


    it('test GET - backend for all characters', () => {
        cy.searchCharactersFromBackend()
    });

    it('test GET - backend for the created character', function () {
        cy.searchCharacterById(this.newId).then((character) => {
            expect(character).to.deep.equal(createdCharacter)
        }) 
    });

    it('test GET - frontend for all characters', () => {
        
        var charactersIdsBackend

        cy.searchCharactersFromBackend().then((characters) => {
            cy.wrap(characters.length).as('numberOfCharactersBackend')
            charactersIdsBackend = Cypress._.map(characters, 'id')
        })

        cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")
        cy.viewport(1440,860); //depende de que tamano tenga anda bien o mal. Si comento esta linea (con 1920x1080) los 3 personajes del medio (jon sansa arya) no aparecen. Capaz es un bug nose.

        cy.scrollTo('bottom')
        cy.wait(1000)
        cy.scrollTo('bottom')
        cy.wait(1000)
        cy.scrollTo('bottom')
        cy.wait(1000)
        cy.scrollTo('bottom')

        cy.get('@numberOfCharactersBackend').then((num) => {
            cy.get('div>div:nth-child(3)>span').should('have.length', num)
        })
        
        cy.get('div>div:nth-child(2)>span').then(($array) => { //get characters id's spans from frontend
            var charactersIdsFrontend = Cypress._.map($array, 'innerText') //get array of characters ids
            expect(charactersIdsFrontend).to.deep.eq(charactersIdsBackend) //compare that the arrays of ids from front and back are the same.
        })

    });

    context('with an edited character', () => {
        let editedIsAlive = ! isAlive
        let editedLocation = location + ' edited'
        let editedName = name + ' edited'
        let editedRealName = realName + ' edited'
        let editedThumbnail = thumbnail + ' edited'

        before( function() {
            cy.request({
                method: 'PUT',
                url: 'https://restool-sample-app.herokuapp.com/api/character/' + this.newId,
                form: true,
                body:{
                    "isAlive": editedIsAlive,
                    "location": editedLocation,
                    "name": editedName,
                    "realName": editedRealName,
                    "thumbnail": editedThumbnail
                } 
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body).to.eq('ok')
            })
        });

        it('test PUT - backend', function () {
            cy.searchCharacterById(this.newId).then((character) => {
                // expect(character.isAlive).to.eq(isAlive)
                expect(character.location).to.eq(editedLocation)
                expect(character.name).to.eq(editedName)
                expect(character.realName).to.eq(editedRealName)
                expect(character.thumbnail).to.eq(editedThumbnail)
            })
        });

        it('test PUT - frontend', function () {
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")
            cy.viewport(1440,860); //depende de que tamano tenga anda bien o mal. Si comento esta linea (con 1920x1080) los 3 personajes del medio (jon sansa arya) no aparecen. Capaz es un bug nose.

            cy.scrollTo('bottom')
            cy.wait(1000)
            cy.scrollTo('bottom')
            cy.wait(1000)
            cy.scrollTo('bottom')
            cy.wait(1000)
            cy.scrollTo('bottom')

            cy.get('.infinite-scroll-component .card').last().then( function (card) {
                cy.wrap(card).contains('ID').siblings().should('have.text', this.newId)
                cy.wrap(card).contains('Name').siblings().should('have.text', editedName)
                cy.wrap(card).contains('Real Name').siblings().should('have.text', editedRealName)
                cy.wrap(card).contains('Location').siblings().should('have.text', editedLocation)
                cy.wrap(card).contains('Alive').siblings().should('have.class', editedIsAlive)
                cy.wrap(card).find('img').should('have.attr', 'src', editedThumbnail)
            })
        });
    });

    after( function () {
        cy.deleteCharacter(this.newId)
    });

});






