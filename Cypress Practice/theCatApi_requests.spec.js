describe("Testing API Endpoints Using Cypress", () => {    

    it("Test GET Cat-API", () => {      
        cy.request({
            method: 'GET',
            url: 'https://api.thecatapi.com/v1/images/search?format=json',
            form:true,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '2c1d3353-7227-468e-bd55-4e5a1c87a8e2'
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.id).to.not.be.null
        });
    })


    /*it("Test POST Cat-API", () => {   //NO ANDA   
        cy.request({
            method: 'POST',
            url: 'https://api.thecatapi.com/v1/images/upload',
            form:true,
            headers: {
                'Content-Type': 'multipart/form-data',
                //'x-api-key': '2c1d3353-7227-468e-bd55-4e5a1c87a8e2'
                'x-api-key': '17d94b92-754f-46eb-99a0-65be65b5d18f'
            },
            body: {
                //file: "C:/Cypress/cypress/fixtures/images/cat.jpg"
                file: 'C:\Cypress\cypress\fixtures\images\cat.jpg'
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            //expect(response.body.id).to.not.be.null
        });
    })*/



    it("Test GET2 Cat-API", () => {      
        cy.request({
            method: 'GET',
            url: 'https://api.thecatapi.com/v1/images/FFbzOpl75',
            form:true,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '2c1d3353-7227-468e-bd55-4e5a1c87a8e2'
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.id).to.not.be.null
        });
    })

    

    it("Test DELETE Cat-API", () => {      
        cy.request({
            method: 'DELETE',
            url: 'https://api.thecatapi.com/v1/images/FFbzOpl75',
            form:true,
            headers: {
                'Content-Type': 'application/json',
                //'x-api-key': '2c1d3353-7227-468e-bd55-4e5a1c87a8e2'
                'x-api-key': '17d94b92-754f-46eb-99a0-65be65b5d18f'
            }
        }).then((response) => {
            expect(response.status).to.be.within(200,299)
            expect(response.body.id).to.not.be.null
        });
    })




    it("Test POST favourites Cat-API", () => {      
        cy.request({
            method: 'POST',
            url: 'https://api.thecatapi.com/v1/favourites',
            //form:true,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '2c1d3353-7227-468e-bd55-4e5a1c87a8e2'
            },
            body: {
                image_id: 'sSbO8NcV7'
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.id).to.not.be.null
            expect(response.body.message).to.eq('SUCCESS')
            
        });
    })

    it("Test DELETE FAVUORITES Cat-API", () => {      
        cy.request({
            method: 'DELETE',
            url: 'https://api.thecatapi.com/v1/favourites/2149663',
            form:true,
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': '17d94b92-754f-46eb-99a0-65be65b5d18f'
            }
        }).then((response) => {
            expect(response.status).to.eq(200)
            // expect(response.body.id).to.not.be.null
        });
    })

})

