
describe('characters section - test POST', () => {
        
    const uniqueSeed = Date.now().toString();
    let isAlive = true //si está en false falla algo porque en el front se pone true
    let location = "Beyond the Wall"
    let name = "santi " + uniqueSeed
    let realName = "santi"
    let thumbnail = "test"

    it('test POST backend', () => {

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
            cy.wrap(response.body.id).as('newId')

            expect(response.body.isAlive).to.eq("" + isAlive + "")
            expect(response.body.location).to.eq(location)
            expect(response.body.name).to.eq(name)
            expect(response.body.realName).to.eq(realName)
            expect(response.body.thumbnail).to.eq(thumbnail)
            // que tenga las properties.

            // es suficiente que chequee con la respuesta o tendria que hacer un GET para chequear que me trajo todos estos campos con sus valores?
        })
    });

    it('test POST in frontend with "isAlive" true', () => {
        isAlive = true
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
            cy.wrap(response.body.id).as('newId')

            cy.viewport(1080,1080); //depende de que tamano tenga anda bien o mal. Si comento esta linea (con 1920x1080) los 3 personajes del medio (jon sansa arya) no aparecen. Capaz es un bug nose.
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

            cy.get('p.pagination-state').invoke('text').then(($text) => { //hago esto para guardar la catnt de items del 'showing x items'. y desp usarlo para esperar a que los encuentre
                var totalItems = $text.split(' ')[1]
                cy.wrap(totalItems).as('numberOfCharacters')
            })
            
            // COMO HAGO PARA QUE SCROLEE HASTA QUE YA APAREZCAN TODOS LOS numberOfCharacters ??? 
            
            // cy.get('div>div:nth-child(3)>span').should('have.length', '@numberOfCharacters')  //lo hace para esperar que cargue los personajes que estan siempre  
            // cy.get('div>div:nth-child(3)>span', {timeout:10000}).should( function (namesArray) { //hay alguna diferencia entre poner: namesArray o $namesArray ???
            //     expect(namesArray).to.have.length(this.numberOfCharacters)
            // }) 
            
            // let flag = true
            // let arrayLength
           /* while(flag) {
                cy.scrollTo('bottom')
                cy.wait(1000)
                
                cy.get('div>div:nth-child(3)>span').then(($array) => {
                    arrayLength = $array.length
                    cy.log('largo',arrayLength)
                    cy.wrap(arrayLength).as('largoArray')
                })
                
                cy.log('largo1 ', arrayLength)
                cy.log('largo2 ', this.numberOfCharacters)
                cy.log('largo3 ', this.largoArray) //todos me los trae como undefined
                if( arrayLength === this.numberOfCharacters ){
                    cy.log('inside if')
                    flag = false
                }
            }*/
            /*let i 
            for (i = 0; i<5; i++) {
                cy.scrollTo('bottom')
                cy.wait(1000)

                cy.get('div>div:nth-child(3)>span').then(($array) => {
                    arrayLength = $array.length
                    // cy.log('largo',arrayLength)
                    cy.wrap(arrayLength).as('largoArray')

                    cy.get('@numberOfCharacters').then( num => {
                        // cy.log(num); //parece que anda
    
                        cy.log('arraylength', arrayLength)
                        if(arrayLength == num) {
                            cy.log('inside ifffffffffffffffffffffffffffffffffffffffff')
                            i = 505;
                        }
                    })

                })

            }*/
            cy.get('@numberOfCharacters').then( num => {
                // cy.log(num); //parece que anda
                cy.scrollToBottom(num)
            })

            cy.log('after for')

            let foundElement = false
            cy.get('div>div:nth-child(3)>span').each(($el, index, $lis) => { 
                // cy.log($el.text())          
                if ($el.text() == response.body.name) {
                    cy.log('Element found')
                    foundElement = true
                    // expect(response.body.isAlive).to.eq("" + isAlive + "")
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)
                assert.isTrue(foundElement);
            })

            cy.get('.infinite-scroll-component .card').last().then( function (card) {
                cy.wrap(card).contains('ID').siblings().should('have.text', this.newId)
                cy.wrap(card).contains('Name').siblings().should('have.text', name)
                cy.wrap(card).contains('Real Name').siblings().should('have.text', realName)
                cy.wrap(card).contains('Location').siblings().should('have.text', location)
                cy.wrap(card).contains('Alive').siblings().should('have.class', isAlive) //si está en false falla algo porque en el front se pone true
                // el tema es que es algo de cypress pq con postman ese error no pasa. Pero al backend si se le envia bien el false.
                cy.wrap(card).find('img').should('have.attr', 'src', thumbnail)
            })

        })
    });

    it('test POST in frontend with "isAlive" false', () => {
        isAlive = false
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
            cy.wrap(response.body.id).as('newId')

            cy.viewport(1080,1080); //depende de que tamano tenga anda bien o mal. Si comento esta linea (con 1920x1080) los 3 personajes del medio (jon sansa arya) no aparecen. Capaz es un bug nose.
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

            cy.get('p.pagination-state').invoke('text').then(($text) => { //hago esto para guardar la catnt de items del 'showing x items'. y desp usarlo para esperar a que los encuentre
                var totalItems = $text.split(' ')[1]
                cy.wrap(totalItems).as('numberOfCharacters')
            })
            
            // COMO HAGO PARA QUE SCROLEE HASTA QUE YA APAREZCAN TODOS LOS numberOfCharacters ??? 
            
            // cy.get('div>div:nth-child(3)>span').should('have.length', '@numberOfCharacters')  //lo hace para esperar que cargue los personajes que estan siempre  
            // cy.get('div>div:nth-child(3)>span', {timeout:10000}).should( function (namesArray) { //hay alguna diferencia entre poner: namesArray o $namesArray ???
            //     expect(namesArray).to.have.length(this.numberOfCharacters)
            // }) 
            
            // let flag = true
            // let arrayLength
           /* while(flag) {
                cy.scrollTo('bottom')
                cy.wait(1000)
                
                cy.get('div>div:nth-child(3)>span').then(($array) => {
                    arrayLength = $array.length
                    cy.log('largo',arrayLength)
                    cy.wrap(arrayLength).as('largoArray')
                })
                
                cy.log('largo1 ', arrayLength)
                cy.log('largo2 ', this.numberOfCharacters)
                cy.log('largo3 ', this.largoArray) //todos me los trae como undefined
                if( arrayLength === this.numberOfCharacters ){
                    cy.log('inside if')
                    flag = false
                }
            }*/
            /*let i 
            for (i = 0; i<5; i++) {
                cy.scrollTo('bottom')
                cy.wait(1000)

                cy.get('div>div:nth-child(3)>span').then(($array) => {
                    arrayLength = $array.length
                    // cy.log('largo',arrayLength)
                    cy.wrap(arrayLength).as('largoArray')

                    cy.get('@numberOfCharacters').then( num => {
                        // cy.log(num); //parece que anda
    
                        cy.log('arraylength', arrayLength)
                        if(arrayLength == num) {
                            cy.log('inside ifffffffffffffffffffffffffffffffffffffffff')
                            i = 505;
                        }
                    })

                })

            }*/
            cy.get('@numberOfCharacters').then( num => {
                // cy.log(num); //parece que anda
                cy.scrollToBottom(num)
            })

            cy.log('after for')

            let foundElement = false
            cy.get('div>div:nth-child(3)>span').each(($el, index, $lis) => { 
                // cy.log($el.text())          
                if ($el.text() == response.body.name) {
                    cy.log('Element found')
                    foundElement = true
                    // expect(response.body.isAlive).to.eq("" + isAlive + "")
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)
                assert.isTrue(foundElement);
            })

            cy.get('.infinite-scroll-component .card').last().then( function (card) {
                cy.wrap(card).contains('ID').siblings().should('have.text', this.newId)
                cy.wrap(card).contains('Name').siblings().should('have.text', name)
                cy.wrap(card).contains('Real Name').siblings().should('have.text', realName)
                cy.wrap(card).contains('Location').siblings().should('have.text', location)
                cy.wrap(card).contains('Alive').siblings().should('have.class', isAlive) //si está en false falla algo porque en el front se pone true
                // el tema es que es algo de cypress pq con postman ese error no pasa. Pero al backend si se le envia bien el false.
                cy.wrap(card).find('img').should('have.attr', 'src', thumbnail)
            })

        })
    });
    
    afterEach(function () {
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/character/' + this.newId            
        })  
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
        }).then((response) => {
            cy.wrap(response.body.id).as('newId')
        })

        //pongo este DELETE en el before para que cada it pueda testear a partir de este. 
        // porque si no tenia que hacer 2 POST (1 por cada it), aunque fuera con beforeEach pero me parece al pedo.
        // o juntar los dos it en uno que me parece ponerle mucha responsabilidad a 1 solo it.
        // VER-PENSAR-PREGUNTAR !!!!!!!!!
        cy.get('@newId').then((idCreated) => {
            cy.request({ 
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/character/' + idCreated
            }).then((response) => {
                cy.wrap(response).as('deleteResponse')
            })
        })
    });

    it('test DELETE from backend', function () {
        cy.wrap(this.deleteResponse).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body).to.eq('ok')
        })

        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/character/' + this.newId,
            form: true
        }).then((response) => { 
            expect(response.status).to.eq(200) //medio choto pero la pagina esta devuelve 200 aunque hagamos un GET del personaje borrado.
            //pero el body está vacio asiq chequeo con eso
            expect(response.body).to.be.empty
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

describe.only('characters section - test CRUD', () => {
    let createdCharacter //está bien el 'let', no necesariamente tiene que ser 'var'
    
    const uniqueSeed = Date.now().toString();
    let isAlive = false
    let location = "Beyond the Wall"
    let name = "santi " + uniqueSeed
    let realName = "santi"
    let thumbnail = "test"

    before(() => {
        
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
        }).then((response) => {
            cy.wrap(response.body.id).as('newId')
            createdCharacter = response.body
        })
    });


    it('test GET - backend for all characters', () => {
        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form: true           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body.items).to.not.be.null
        })
    });

    it('test GET - backend for the created character', function () {
        cy.searchCharacterById(this.newId).then((character) => {
            expect(character).to.deep.equal(createdCharacter)
        })
        
    });

    it('test GET - frontend for all characters', () => {
        
        const responseArray = 
            cy.request({
                method: 'GET',
                url: 'https://restool-sample-app.herokuapp.com/api/character',
                form: true           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                cy.wrap(response.body.items.length).as('numberOfCharactersBackend')
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

        /*cy.get('div>div:nth-child(3)>span').each(($el, index, $lis) => {   
            cy.wrap($el).then((val) => {
                // cy.log(val.text())
                expect(responseArray).contain(val.text)
            })
        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)        
        })
////
        let foundElement = false
        cy.get('div>div:nth-child(3)>span').each(($el, index, $lis) => { 
            // cy.log($el.text())          
            if ($el.text() == response.body.name) {
                cy.log('Element found')
                foundElement = true
                return
            }                                 
        }).then(($lis) => {
            expect($lis).to.have.length.greaterThan(1)
            assert.isTrue(foundElement);
        })*/

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
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/character/' + this.newId            
        })
    });

});






