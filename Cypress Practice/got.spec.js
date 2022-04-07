
describe("characters section", () => {    

    it("Test POST new character", () => { 
        const uniqueSeed = Date.now().toString();       
        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form:true,
            body:{
                "isAlive":false,
                "location":"Beyond the Wall",
                "name":"santi " + uniqueSeed,
                "realName":"santi",
                "thumbnail":"test"
            }           
        }).then(async function (response) { 
            await expect(response.status).to.eq(200)
            
            cy.viewport(1080,1080); //depende de que tamano tenga anda bien o mal. Si comento esta linea (con 1920x1080) los 3 personajes del medio (jon sansa arya) no aparecen. Capaz es un bug nose.
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

            cy.get('p.pagination-state').invoke('text').then(($text) => { //hago esto para guardar la catnt de items del 'showing x items'. y desp usarlo para esperar a que los encuentre
                var totalItems = $text.split(' ')[1]
                cy.wrap(totalItems).as('numberOfCharacters')
            })

            // cy.scrollTo('bottom') 
            // cy.wait(1000)
            // cy.scrollTo('bottom') 
            // cy.wait(1000)
            // cy.scrollTo('bottom') 
            // cy.wait(1000)
            
            cy.log("name created :"+ response.body.name)
            
            // COMO HAGO PARA QUE SCROLEE HASTA QUE YA APAREZCAN TODOS LOS numberOfCharacters ??? 
            
            // cy.customCommand().should('have.length', 10)

            // cy.get('div>div:nth-child(3)>span', {timeout:10000}).should( function (namesArray) { //hay alguna diferencia entre poner: namesArray o $namesArray ???
            //     expect(namesArray).to.have.length(this.numberOfCharacters)
            // }) 
            
            let flag = true
            let arrayLength
            while(flag) { // un while(true) no esta bueno //poner un numero max de retries
                cy.scrollTo('bottom')
                cy.wait(1000)
                
                cy.get('div>div:nth-child(3)>span').then(($array) => {
                    arrayLength = $array.length
                    cy.log('largo',arrayLength)
                    cy.wrap(arrayLength).as('largoArray')
                })
                
                cy.log('arrayLength ', arrayLength)
                cy.log('numberOfCharacters ', this.numberOfCharacters)
                cy.log('largoArray ', this.largoArray) //todos me los trae como undefined
                cy.get('@numberOfCharacters').then( num => {
                    cy.log(num); //parece que anda

                    flag = false; //no anda 
                    
                })
                if( arrayLength === this.numberOfCharacters ){
                    cy.log('inside if')
                    flag = false
                }

            }

            cy.log('after while')

            cy.get('div>div:nth-child(3)>span').each(($el, index, $lis) => { 
                cy.log($el.text())               
                if ($el.text() == response.body.name) {
                    cy.log('Element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)         
            })

            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/character/' + response.body.id            
            }).then((response) => { 
                expect(response.status).to.eq(200)        
            })   
                        
        });     
    }) 

    it('test PUT editing character', () => {
        const uniqueSeed = Date.now().toString(); 
        
        cy.request({
            method: 'PUT',
            url: 'https://restool-sample-app.herokuapp.com/api/character/'+'1dkLdKI0h8jJ',
            form:true,
            body:{
                "isAlive":false,
                "location":"Beyond the Wall",
                "name":"santi " + uniqueSeed,
                "realName":"santi",
                "thumbnail":"test"
            }           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body).to.eq('ok')
        });

        cy.visit('https://dsternlicht.github.io/RESTool/#/characters?search=')
        cy.get('.card').eq(0).find('.card-row').eq(2).find('span').should('have.text', 'santi '+ uniqueSeed)

    });
});

describe('characters section - test POST', () => {
    
    it('test POST works', () => {
        const uniqueSeed = Date.now().toString();

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form:true,
            body:{
                "isAlive":false,
                "location":"Beyond the Wall",
                "name":"santi " + uniqueSeed,
                "realName":"santi",
                "thumbnail":"test"
            }           
        }).then(async function (response) { 
            await expect(response.status).to.eq(200)
            expect (response.body.name).to.eq('santi '+ uniqueSeed)
            cy.wrap(response.body.id).as('id')
            // que tenga las properties. que tenga los datos que le puse. que el id sea realmente unico ponele
        })
    });

    it('test POST in frontend', () => {
        const uniqueSeed = Date.now().toString();

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form:true,
            body:{
                "isAlive":false,
                "location":"Beyond the Wall",
                "name":"santi " + uniqueSeed,
                "realName":"santi",
                "thumbnail":"test"
            }           
        }).then(async function (response) { 
            await expect(response.status).to.eq(200)
            cy.wrap(response.body.id).as('id')

            cy.viewport(1080,1080); //depende de que tamano tenga anda bien o mal. Si comento esta linea (con 1920x1080) los 3 personajes del medio (jon sansa arya) no aparecen. Capaz es un bug nose.
            cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

            cy.get('p.pagination-state').invoke('text').then(($text) => { //hago esto para guardar la catnt de items del 'showing x items'. y desp usarlo para esperar a que los encuentre
                var totalItems = $text.split(' ')[1]
                cy.wrap(totalItems).as('numberOfCharacters')
            })

            // cy.scrollTo('bottom') 
            // cy.wait(1000)
            // cy.scrollTo('bottom') 
            // cy.wait(1000)
            // cy.scrollTo('bottom') 
            // cy.wait(1000)
            
            cy.log("name created: "+ response.body.name)
            
            // COMO HAGO PARA QUE SCROLEE HASTA QUE YA APAREZCAN TODOS LOS numberOfCharacters ??? 
            
            // cy.customCommand().should('have.length', 10)

            // cy.get('div>div:nth-child(3)>span').should('have.length', '@numberOfCharacters')  //lo hace para esperar que cargue los personajes que estan siempre  
            // cy.get('div>div:nth-child(3)>span', {timeout:10000}).should( function (namesArray) { //hay alguna diferencia entre poner: namesArray o $namesArray ???
            //     expect(namesArray).to.have.length(this.numberOfCharacters)
            // }) 
            
            let flag = true
            let arrayLength
            while(flag) {
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
            }

            cy.log('after while')

            cy.scrollTo('bottom')
            cy.wait(1000)
            cy.scrollTo('bottom')
            cy.wait(1000)
            cy.scrollTo('bottom')
            cy.wait(1000)

            let foundElement = false
            cy.get('div>div:nth-child(3)>span').each(($el, index, $lis) => { 
                cy.log($el.text())               
                if ($el.text() == response.body.name) {
                    cy.log('Element found')
                    foundElement = true
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)
                assert.isTrue(foundElement);
            })
        })
    });
    
    afterEach(function () {
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/character/' + this.id            
        })  
    });

});

describe('characters section - test CRUD', () => {
    before(() => {
        const uniqueSeed = Date.now().toString();

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form:true,
            body:{
                "isAlive":false,
                "location":"Beyond the Wall",
                "name":"santi " + uniqueSeed,
                "realName":"santi",
                "thumbnail":"test"
            }           
        }).then((response) => {
            cy.wrap(response.body.id).as('newId')
        })
    });

    it('test GET - backend', () => {
        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/character',
            form: true           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body.items).to.not.be.null
        })
    });

    it('test GET - frontend', () => {
        const responseArray = 
            cy.request({
                method: 'GET',
                url: 'https://restool-sample-app.herokuapp.com/api/character',
                form: true           
            }).then((response) => { 
                expect(response.status).to.eq(200)
            })

        cy.visit("https://dsternlicht.github.io/RESTool/#/characters?search=")

        cy.scrollTo('bottom')
        cy.wait(1000)
        // cy.scrollTo('bottom')
        // cy.wait(1000)
        // cy.scrollTo('bottom')
        // cy.wait(1000)

        let idArray = []

        cy.get('div>div:nth-child(3)>span').should('have.length.greaterThan',0)
        cy.get('div>div:nth-child(3)>span').each(($el, index, $lis) => {   
            cy.wrap($el).then((val) => {
                idArray.push(val.text());
                // cy.log(val.text())
                // cy.log(idArray[index])
                expect(responseArray).contain(val.text)
            })
        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    });

    after(function () {
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/character/' + this.newId            
        })  
    });

});

describe("employees section", () => {
    
    it('test POST new employees', () => {

        const uniqueSeed = Date.now().toString();   

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/employee',
            form: true,
            body:{
                "name": 'santi '+ uniqueSeed,
                "jobTitle":"A Knows nothing dude.",
                "isFired":false
            }           
        }).then(async(response) => { 
            await expect(response.status).to.eq(200)      
            
            //si quiero navegar por la página en vez de poner la URL para que aparezcan 50 items:
            // cy.visit('https://dsternlicht.github.io/RESTool/#/employees')
            // cy.get('.query-params-form .row:nth-child(3) > input[type=text]').clear().type('50')
            // cy.get('.query-params-form .button').click()

            cy.visit("https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=50")
            // cy.get('.pagination-wrapper button[title="Previous page"]').should('have.attr', 'disabled') //VER COMO HACER ESTAS 2 LINEAS MEJOR
            // cy.get('.pagination-wrapper button[title="Next page"]').should('have.attr', 'disabled')
            // cy.get('.pagination-wrapper button').should('have.attr', 'disabled') //ESTÁ MAL pq si uno de los dos tiene disabled y el otro no pasa igual.
            cy.get('.pagination-wrapper').children('[disabled]').should('have.length',2) //está buena esta idea?
            
            cy.log("name created: " + response.body.name)
            
            // cy.get('table > tbody > tr > td:nth-child(2) > span').should('have.length.greaterThan',7)                                                          
            cy.get('table > tbody > tr > td:nth-child(2) > span').each(($el, index, $lis) => { 
                if ($el.text() == response.body.name) {
                    cy.log('Element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            })        
            
            // cy.wait(1000)    
            
            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/employee/' + response.body.id            
            }).then((response) => { 
                expect(response.status).to.eq(200)        
            })   

            cy.reload().get('tbody') //hago el get para que haga retry hasta que aparezca el tbody y así no hago el wait de abajo.
            // cy.wait(1000)
            
            cy.get('table > tbody > tr').should('not.contain', 'santi '+ uniqueSeed) //HAY ALGUNA MANERA DE NO HACERLO ASI POR SEPARADO???
            cy.get('table > tbody > tr').should('not.contain', response.body.id) //PQ ESTOY HACIENDO DOS VECES EL MISMO GET, MEDIO AL PEDO Y PIERDO TIEMPO.

        });
    });

    it("Test GET employees", () => { 
        var algo = []
        const responseArray = 
            cy.request({
                method: 'GET',
                url: 'https://restool-sample-app.herokuapp.com/api/employee',
                form: true           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body.items).to.not.be.null 

                cy.log(JSON.stringify(response.body.items))
                algo = response.body.items
                cy.log(algo)

                return response.body.items.id     
            })

        cy.log(algo)

        // cy.intercept({
        //     method: 'GET',
        //     url: 'https://restool-sample-app.herokuapp.com/api/employee'
        // }).as('getResponse')

        cy.visit("https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=50")

        // cy.wait('@getResponse').its('response.statusCode').should('eq', 200)

        let idArray = []

        cy.get("table > tbody>tr>td:nth-child(1)>span").should('have.length.greaterThan',0)
        cy.get("table > tbody>tr>td:nth-child(1)>span").each(($el, index, $lis) => {   
            cy.wrap($el).then((val) => {
                idArray.push(val.text());
                // cy.log(val.text())
                // cy.log(idArray[index])
                expect(responseArray).contain(val.text)
            })
        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    })

    it('test PUT editing employee', () => { //NO ANDA. opcion intentando hacer un before para el GET.
        
        //voy a intentar obtener el id con un GET
        /*before(() => {  //NO ME DEJA PONER UN BEFORE EN UN IT. LO ARREGLO CON CONTEXTS?
            var firstID = 0;
            cy.request({
                method: 'GET',
                url: 'https://restool-sample-app.herokuapp.com/api/employee',
                form:true           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body.items).to.not.be.null
                
                cy.wrap(response.body.items[0].id).as('id1')
                firstID = response.body.items[0].id
                cy.log(firstID)
    
                // cy.log(JSON.stringify(response.body.items))
                // algo = response.body.items
                // cy.log(algo)
    
                return response.body.items.id     
            })
        })
        
        cy.log(firstID)*/

        const uniqueSeed = Date.now().toString(); 

        /*cy.request({
            method: 'PUT',
            url: 'https://restool-sample-app.herokuapp.com/api/employee/'+'BZlnMLA2IuI7',
            form:true,
            body:{
                "name":"santi "+ uniqueSeed,
                "jobTitle":"RESTool creator 😎",
                "isFired":false
            }           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body).to.eq('ok')
        });

        cy.visit('https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=50')
        cy.get('table > tbody > tr:nth-child(1) > td:nth-child(2) > span').should('have.text', 'santi '+ uniqueSeed)*/

    });

    it('test PUT editing employee - OPTION 2', () => { //opcion anidando el PUT adentro del GET para obtener el ID del primer empleado. ES UNA BUENA PRACTICA ESO?

        const uniqueSeed = Date.now().toString(); 

        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/employee',
            form: true           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body.items).to.not.be.null
            
            // cy.wrap(response.body.items[0].id).as('id1') //llamandolo con @id1 me tira error el vsc. y con this.id1 me lo deja como undefinded
            // con alias no funciona acá. cambié lo de arrow function pero igual. SUPONGO QUE PQ ESTÁ EN EL MISMO BLOQUE TODO, NO?
            let firstID = response.body.items[0].id

            cy.request({
                method: 'PUT',
                url: 'https://restool-sample-app.herokuapp.com/api/employee/' + firstID,
                form:true,
                body:{
                    "name":"santi "+ uniqueSeed,
                    "jobTitle":"RESTool creator newwww 😎",
                    "isFired":false
                }           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body).to.eq('ok')
            });
    
            cy.visit('https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=50')
            cy.get('table > tbody > tr:nth-child(1) > td:nth-child(2) > span').should('have.text', 'santi '+ uniqueSeed)

        })
    });

});

describe('employees section 2 - PARA EL PUT', () => { //opcion con describe aparte para poner el before con el alias que obtenemos del GET, y después usarlo en el it()

    //obtengo el id con un GET

    before(() => { //si no hago el describe y este before no se como usar el alias id1
        
        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/employee',
            form: true           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body.items).to.not.be.null
            
            cy.wrap(response.body.items[0].id).as('id1')

            return response.body.items.id     
        })

    })

    const uniqueSeed = Date.now().toString(); 

    it('PUT edit employee', function () { //hago funcion anonima y no arrow porque el alias no anda con arrow.

        // cy.visit('https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=50')
        expect(this.id1).to.eq('LtbefzswS3eC')

        cy.request({
            method: 'PUT',
            url: 'https://restool-sample-app.herokuapp.com/api/employee/' + this.id1,
            form: true,
            body:{
                "name": 'santi '+ uniqueSeed,
                "jobTitle":"RESTool creator nooooo 😎",
                "isFired": false 
            }           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body).to.eq('ok')
        });

        cy.visit('https://dsternlicht.github.io/RESTool/#/employees?search=&page=1&limit=50')
        
        cy.get('table > tbody > tr:nth-child(1) > td:nth-child(2) > span').should('have.text', 'santi '+ uniqueSeed)
        cy.get('table > tbody > tr:nth-child(1) > td:nth-child(4) > div').should('have.class', 'bool false') //y falla y está bien que falle
        //PERO ES UN BUG DE LA PÁGINA O ES PROBLEMA DE CYPRESS?

        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/employee/' + this.id1,
            form:true           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body.isFired).to.eq('false') //esto da bien pq en el back si lo pone en false
        })

    });

});

describe('extras section', () => { //todos los its por separado - choto
    
    it("GET extras", () => { //hecho por Guille
        const array = //no se puede acceder a este array normalmente pq no es que estamos haciendo 'const array = [a,b,c]', sino que es algo más raro.
            cy.request({
                method: 'GET',
                url: 'https://restool-sample-app.herokuapp.com/api/extra',
                form: true           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body.items.name).to.not.be.null //para mi sin el .name
                cy.log(JSON.stringify(response.body.items))
                return response.body.items.id  //devuelve un array de ids efectivamente   
            });

        // cy.log(array)
        // cy.log(JSON.stringify(array))

        cy.visit("https://dsternlicht.github.io/RESTool/#/extras")

        let idArray = []

        cy.get("table > tbody>tr>td:nth-child(1)>span").should('have.length.greaterThan',0)
        cy.get("table > tbody>tr>td:nth-child(1)>span").each(($el, index, $lis) => {   
            cy.wrap($el).then((val) => {

                // let arrr = [{'id':'a','name':'sss'},{'id':'b','name':'ttt'}];
                // expect(arrr).to.deep.contain({'id':'a','name':'sss'})

                idArray.push(val.text());
                expect(array).to.deep.include(val.text) //Aliases: contain, includes, contains - son lo mismo  
                // el 'to.deep' lo agregué yo
                //SE ESTÁ HACIENDO ESTA LINEA? EN CYPRESS NI APARECE              
            })
        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    })

    it('POST - new extra', () => {
        const uniqueSeed = Date.now().toString();   

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/extra',
            form: true,
            body:{ "name": "santi "+ uniqueSeed }           
        }).then(async(response) => { 
            await expect(response.status).to.eq(200)      
            
            cy.visit("https://dsternlicht.github.io/RESTool/#/extras")

            cy.log("name created: " + response.body.name)
            
            // cy.get('table > tbody > tr > td:nth-child(2) > span').should('have.length.greaterThan',7)                                                          

            cy.get('table > tbody > tr').each(($el, index, $lis) => { //selecciono solo el selector de cada fila de la tabla, y sobre eso itero
            // pero está bueno esto? Pq abajo estoy haciendo get($el) osea que está buscando de nuevo, no se si conviene. Capaz en vez de esto conviene lo de más abajo.

                // let extrasName = cy.get($el).find('td:nth-child(2) > span').invoke('text')
                // cy.log(extrasName) // devuelve "Object{5}"
                //eso de arriba no anda pq: you cannot assign or work with the return values of any cypress command. Commands are enqueued and run asynchronously.
                //you cannot return a value from cy commands. But you can do so in the .then block
                cy.get($el).find('td:nth-child(2) > span').then(($name) => {
                    if ($name.text() == response.body.name) {
                        cy.log('name element found')
                        return
                    }  
                })   
                
                cy.get($el).find('td:nth-child(1) > span').then(($id) => {
                    if ($id.text() == response.body.id) {
                        cy.log('id element found')
                        return
                    }  
                })
                               
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            }) 

            //otra opcion: hacer los dos así por separado. CUAL CONVIENE?
            /*cy.get('table > tbody > tr > td:nth-child(2) > span').each(($el, index, $lis) => { 
                if ($el.text() == response.body.name) {
                    cy.log('name element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            }) 

            cy.get('table > tbody > tr > td:nth-child(1) > span').each(($el, index, $lis) => { 
                if ($el.text() == response.body.id) {
                    cy.log('id element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            }) */

            // cy.wait(1000)    
            
            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/extra/' + response.body.id            
            }).then((response) => { 
                expect(response.status).to.eq(200)        
            })   

            cy.reload().get('tbody') //hago el get para que haga retry hasta que aparezca el tbody y así no hago el wait de abajo.
            // cy.wait(1000)
            
            cy.get('table > tbody > tr').should('not.contain', 'santi '+ uniqueSeed) //HAY ALGUNA MANERA DE NO HACERLO ASI POR SEPARADO???
            cy.get('table > tbody > tr').should('not.contain', response.body.id) //PQ ESTOY HACIENDO DOS VECES EL MISMO GET, MEDIO AL PEDO Y PIERDO TIEMPO.

        });
    });

    it('PUT - edit extra', () => {
        
        const uniqueSeed = Date.now().toString(); 

        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/extra',
            form: true           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body.items).to.not.be.null
            
            let firstID = response.body.items[0].id

            cy.request({
                method: 'PUT',
                url: 'https://restool-sample-app.herokuapp.com/api/extra/' + firstID,
                form: true,
                body:{ "name": "santi "+ uniqueSeed }           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body).to.eq('ok')
            });
    
            cy.visit('https://dsternlicht.github.io/RESTool/#/extras')
            cy.get('table > tbody > tr:nth-child(1) > td:nth-child(2) > span').should('have.text', 'santi '+ uniqueSeed)
        })
    });

});

describe.only('extras section - complete CRUD workflow', () => {
    var itemCreated
    it("GET extras", function () { //hecho por Guille
        const array = //no se puede acceder a este array normalmente pq no es que estamos haciendo 'const array = [a,b,c]', sino que es algo más raro.
            cy.request({
                method: 'GET',
                url: 'https://restool-sample-app.herokuapp.com/api/extra',
                form: true           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body.items.name).to.not.be.null //para mi sin el .name
                cy.log(JSON.stringify(response.body.items))
                cy.wrap(response.body.items.length).as('numberOfItemsGet') //number of extra items
                return response.body.items.id  //devuelve un array de ids efectivamente   
            });

        // cy.log(array)
        // cy.log(JSON.stringify(array))

        cy.visit("https://dsternlicht.github.io/RESTool/#/extras")

        let idArray = []

        // cy.get("table > tbody>tr>td:nth-child(1)>span").should('have.length', this.numberOfItemsGet) //  PQ NO FUNCIONA ESTO. me lo toma como undefinded
        cy.get("table > tbody>tr>td:nth-child(1)>span").each(($el, index, $lis) => {   
            cy.wrap($el).then((val) => {

                // let arrr = [{'id':'a','name':'sss'},{'id':'b','name':'ttt'}];
                // expect(arrr).to.deep.contain({'id':'a','name':'sss'})

                idArray.push(val.text());
                expect(array).to.deep.include(val.text) //Aliases: contain, includes, contains - son lo mismo  
                // el 'to.deep' lo agregué yo
                //SE ESTÁ HACIENDO ESTA LINEA? EN CYPRESS NI APARECE              
            })
        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    })

    it('POST - new extra', () => {
        const uniqueSeed = Date.now().toString();   

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/extra',
            form: true,
            body:{ "name": "santi "+ uniqueSeed }           
        }).then(async(response) => { 
            await expect(response.status).to.eq(200)      
            
            cy.visit("https://dsternlicht.github.io/RESTool/#/extras")

            cy.log("name created: " + response.body.name)

            cy.wrap(response.body.id).as('newId')
            cy.wrap(response.body).as('newItemCreated') // no anda bien. pero el alias queda con el objeto que quiero
            cy.wrap(response.body.name).as('newName')
            cy.log(response.body)
            cy.log(response.body.name)
            itemCreated = response.body
            cy.log(itemCreated)

            cy.get('table > tbody > tr > td:nth-child(2) > span').should('have.length.greaterThan',5)
            cy.get('table > tbody > tr').each(($el, index, $lis) => { //selecciono solo el selector de cada fila de la tabla, y sobre eso itero
            // pero está bueno esto? Pq abajo estoy haciendo get($el) osea que está buscando de nuevo, no se si conviene. Capaz en vez de esto conviene lo de más abajo.

                // let extrasName = cy.get($el).find('td:nth-child(2) > span').invoke('text')
                // cy.log(extrasName) // devuelve "Object{5}"
                //eso de arriba no anda pq: you cannot assign or work with the return values of any cypress command. Commands are enqueued and run asynchronously.
                //you cannot return a value from cy commands. But you can do so in the .then block
                cy.get($el).find('td:nth-child(2) > span').then(($name) => {
                    if ($name.text() == response.body.name) {
                        cy.log('name element found')
                        return
                    }  
                })   
                
                cy.get($el).find('td:nth-child(1) > span').then(($id) => {
                    if ($id.text() == response.body.id) {
                        cy.log('id element found')
                        return
                    }  
                })
                               
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            }) 

            //otra opcion: hacer los dos así por separado. CUAL CONVIENE?
            /*cy.get('table > tbody > tr > td:nth-child(2) > span').each(($el, index, $lis) => { 
                if ($el.text() == response.body.name) {
                    cy.log('name element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            }) 

            cy.get('table > tbody > tr > td:nth-child(1) > span').each(($el, index, $lis) => { 
                if ($el.text() == response.body.id) {
                    cy.log('id element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            }) */

        });
    });

    it('GET extras after POST', () => {
       
        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/extra',
            form: true           
        }).then( function (response) { 
            expect(response.status).to.eq(200)
            cy.log(this.newItemCreated) //no me trae el objeto por alguna razón, pero antes lo guardó bien. Los alias no guaradaran objetos parece.
            cy.log(this.newName)
            cy.log(itemCreated) // con var funciona
            expect(response.body.items).to.have.length(this.numberOfItemsGet + 1)
        });

    });

    it('PUT - edit extra', function () {
        
        const uniqueSeed = Date.now().toString();
        cy.wrap(uniqueSeed).as('newNameNumber')

        cy.request({
            method: 'PUT',
            url: 'https://restool-sample-app.herokuapp.com/api/extra/' + this.newId,
            form: true,
            body:{ "name": "santi put "+ uniqueSeed }           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body).to.eq('ok')
        });

         //puedo agregar un GET para ver que en el back tenga la misma info que acá

        cy.visit('https://dsternlicht.github.io/RESTool/#/extras')
        cy.get('table > tbody > tr:nth-child('+ (this.numberOfItemsGet + 1) +') > td:nth-child(2) > span').should('have.text', 'santi put ' + uniqueSeed) 
        
    });

    it('DELETE extra', function () {
        
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/extra/' + this.newId            
        }).then((response) => { 
            expect(response.status).to.eq(200)        
        })   

        cy.reload().get('tbody') //hago el get para que haga retry hasta que aparezca el tbody y así no hago el wait de abajo.
        // cy.wait(1000)
        
        cy.get('table > tbody > tr').should('not.contain', 'santi put'+ this.newNameNumber) //HAY ALGUNA MANERA DE NO HACERLO ASI POR SEPARADO???
        cy.get('table > tbody > tr').should('not.contain', this.newId) //PQ ESTOY HACIENDO DOS VECES EL MISMO GET, MEDIO AL PEDO Y PIERDO TIEMPO.

    });

});

describe('deads section', () => { //todos los its por separado - choto
    
    it("GET deads", () => {
        const array = //no es un simple array
            cy.request({
                method: 'GET',
                url: 'https://restool-sample-app.herokuapp.com/api/dead',
                form: true           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body.items.name).to.not.be.null //para mi sin el .name
                cy.log(JSON.stringify(response.body.items))
                return response.body.items.id
            });

        // cy.log(array)
        // cy.log(JSON.stringify(array))

        cy.visit("https://dsternlicht.github.io/RESTool/#/deads")

        let idArray = []

        cy.get("table > tbody>tr>td:nth-child(1)>span").should('have.length.greaterThan',0)
        cy.get("table > tbody>tr>td:nth-child(1)>span").each(($el, index, $lis) => {   
            cy.wrap($el).then((val) => {

                // let arrr = [{'id':'a','name':'sss'},{'id':'b','name':'ttt'}];
                // expect(arrr).to.deep.contain({'id':'a','name':'sss'})

                idArray.push(val.text());
                expect(array).to.deep.include(val.text) //Aliases: contain, includes, contains - son lo mismo  
                //SE ESTÁ HACIENDO ESTA LINEA? EN CYPRESS NI APARECE              
            })
        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    })

    it('POST - new dead', () => {
        
        const uniqueSeed = Date.now().toString();   

        const deathReason = (Math.random() + 1).toString(36).substring(7); //genera un texto con 5 caracteres cualquiera
        
        cy.request({ //hago un GET aca para sacar la cantidad de deads antes del POST.
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/dead',
            form: true
        }).then((getResponse) => {
            cy.wrap(getResponse.body.items.length).as('largoGetInicial')
        });

        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/dead',
            form: true,
            body:{ 
                "name": "santi " + uniqueSeed,
                "reason": deathReason
            }           
        }).then(async(response) => { 
            await expect(response.status).to.eq(200)      

            cy.visit("https://dsternlicht.github.io/RESTool/#/deads")

            cy.log("name created: " + response.body.name)
            cy.log("reason created: "+ response.body.reason)
            
            // cy.get('table > tbody > tr > td:nth-child(2) > span').should('have.length.greaterThan',7)                                                          
            cy.get('table > tbody > tr > td:nth-child(2) > span').each(($el, index, $lis) => { 
                if ($el.text() == response.body.name) {
                    cy.log('Element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            })
         

            //puedo agregar un GET para ver que en el back tenga la misma info que aca
            cy.request({
                method: 'GET',
                url: 'https://restool-sample-app.herokuapp.com/api/dead',
                form: true
            }).then( function (getResponse) {
                expect(getResponse.body.items).to.have.length(this.largoGetInicial + 1)
                expect(getResponse.body.items[this.largoGetInicial]).to.deep.equal(response.body)
            });
          

            cy.request({
                method: 'DELETE',
                url: 'https://restool-sample-app.herokuapp.com/api/dead/' + response.body.id
            }).then((response) => { 
                expect(response.status).to.eq(200)        
            })   

            cy.reload().get('tbody') //hago el get para que haga retry hasta que aparezca el tbody y así no hago el wait de abajo.
            // cy.wait(1000)
            
            cy.get('table > tbody > tr').should('not.contain', 'santi ' + uniqueSeed) //HAY ALGUNA MANERA DE NO HACERLO ASI POR SEPARADO???
            cy.get('table > tbody > tr').should('not.contain', response.body.id) //PQ ESTOY HACIENDO DOS VECES EL MISMO GET, MEDIO AL PEDO Y PIERDO TIEMPO.

        });
    });

    it('PUT - edit dead', () => {
        
        const uniqueSeed = Date.now().toString(); 

        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/dead',
            form: true           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body.items).to.not.be.null
            
            let firstID = response.body.items[0].id

            cy.request({
                method: 'PUT',
                url: 'https://restool-sample-app.herokuapp.com/api/dead/' + firstID,
                form: true,
                body:{ 
                    "name": "santi put " + uniqueSeed,
                    "reason": "razon del put"
                }           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body).to.eq('ok')
            });

            //puedo agregar un GET para ver que en el back tenga la misma info que acá
    
            cy.visit('https://dsternlicht.github.io/RESTool/#/deads')
            // cy.get('table > tbody > tr:nth-child(1) > td:nth-child(2) > span').should('have.text', 'santi put '+ uniqueSeed)
            cy.get('table > tbody > tr:nth-child(1) > td:nth-child(2) > span').should('have.text', 'santi put ' + uniqueSeed)
        })
    });

});

describe('deads section - complete CRUD workflow', () => {
    
    it("GET deads", function () {
        const array = //no es un simple array
            cy.request({
                method: 'GET',
                url: 'https://restool-sample-app.herokuapp.com/api/dead',
                form: true           
            }).then((response) => { 
                expect(response.status).to.eq(200)
                expect(response.body.items.name).to.not.be.null //para mi sin el .name
                cy.log(JSON.stringify(response.body.items))
                cy.wrap(response.body.items.length).as('numberOfItemsGet') //number of dead items
                return response.body.items.id
            });

        // cy.log(array)
        // cy.log(JSON.stringify(array))

        cy.visit("https://dsternlicht.github.io/RESTool/#/deads")

        // cy.get("table > tbody>tr>td:nth-child(1)>span").should('have.length', this.numberOfItemsGet) //  PQ NO FUNCIONA ESTO. me lo toma como undefinded
        cy.get("table > tbody>tr>td:nth-child(1)>span").should('have.length.greaterThan',4)
        cy.get("table > tbody>tr>td:nth-child(1)>span").each(($el, index, $lis) => {   
            cy.wrap($el).then((val) => {

                // let arrr = [{'id':'a','name':'sss'},{'id':'b','name':'ttt'}];
                // expect(arrr).to.deep.contain({'id':'a','name':'sss'})

                expect(array).to.deep.include(val.text) //Aliases: contain, includes, contains - son lo mismo  
                //SE ESTÁ HACIENDO ESTA LINEA? EN CYPRESS NI APARECE              
            })
        }).then(($lis) => {
            expect($lis).to.have.length.of.at.least(1)            
        })
    })

    it('POST - new dead', () => {
        
        const uniqueSeed = Date.now().toString();   

        const deathReason = (Math.random() + 1).toString(36).substring(7); //genera un texto con 5 caracteres cualquiera
        
        cy.request({
            method: 'POST',
            url: 'https://restool-sample-app.herokuapp.com/api/dead',
            form: true,
            body:{ 
                "name": "santi " + uniqueSeed,
                "reason": deathReason
            }           
        }).then(async(response) => { 
            await expect(response.status).to.eq(200)      

            cy.visit("https://dsternlicht.github.io/RESTool/#/deads")

            cy.log("name created: " + response.body.name)
            cy.log("reason created: "+ response.body.reason)

            cy.wrap(response.body.id).as('newId')
            cy.wrap(response.body).as('newItemCreated') // no anda bien. pero el alias queda con el objeto que quiero
            cy.wrap(response.body.reason).as('reasonn')
            cy.log(response.body)
            
            cy.get('table > tbody > tr > td:nth-child(2) > span').should('have.length.greaterThan',5)                                                          
            cy.get('table > tbody > tr > td:nth-child(2) > span').each(($el, index, $lis) => { 
                if ($el.text() == response.body.name) {
                    cy.log('Element found')
                    return
                }                                 
            }).then(($lis) => {
                expect($lis).to.have.length.greaterThan(1)             
            })
              
        });
    });

    it('GET deads after POST', function () {
        
        cy.request({
            method: 'GET',
            url: 'https://restool-sample-app.herokuapp.com/api/dead',
            form: true
        }).then( function (getResponse) {
            expect(getResponse.body.items).to.have.length(this.numberOfItemsGet + 1)
            cy.log(this.newItemCreated) //no me trae el objeto por alguna razón, pero antes lo guardó bien
            cy.log(this.reasonn)
            // expect(getResponse.body.items[this.numberOfItemsGet]).to.deep.equal(this.newItemCreated)
        });

    });

    it('PUT - edit dead', function () {
        
        const uniqueSeed = Date.now().toString(); 
        cy.wrap(uniqueSeed).as('newNameNumber')
            
        cy.request({
            method: 'PUT',
            url: 'https://restool-sample-app.herokuapp.com/api/dead/' + this.newId, //para que ande este this.newId la arrow function la tengo que sacar solo de response del GET, no del it()
            form: true,
            body:{ 
                "name": "santi put " + uniqueSeed,
                "reason": "razon del put"
            }           
        }).then((response) => { 
            expect(response.status).to.eq(200)
            expect(response.body).to.eq('ok')
        });

        //puedo agregar un GET para ver que en el back tenga la misma info que acá

        cy.visit('https://dsternlicht.github.io/RESTool/#/deads')
        cy.get('table > tbody > tr:nth-child('+ (this.numberOfItemsGet + 1) +') > td:nth-child(2) > span').should('have.text', 'santi put ' + uniqueSeed) 
        
    });

    it('DELETE dead', function () {
       
        cy.request({
            method: 'DELETE',
            url: 'https://restool-sample-app.herokuapp.com/api/dead/' + this.newId
        }).then((response) => { 
            expect(response.status).to.eq(200)        
        }) 
        
        cy.reload().get('tbody') //hago el get para que haga retry hasta que aparezca el tbody y así no hago el wait de abajo.
        // cy.wait(1000)
        
        cy.get('table > tbody > tr').should('not.contain', 'santi ' + this.newNameNumber) //HAY ALGUNA MANERA DE NO HACERLO ASI POR SEPARADO???
        cy.get('table > tbody > tr').should('not.contain', this.newId) //PQ ESTOY HACIENDO DOS VECES EL MISMO GET, MEDIO AL PEDO Y PIERDO TIEMPO.
    });

});

