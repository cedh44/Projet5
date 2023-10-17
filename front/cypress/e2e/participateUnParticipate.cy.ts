import '../support/commands.ts'

describe('Form List Detail Component spec (Participate and Unparticipate to a Session as a user)', () => {
    it('should participate to a session', () => {

        //Login as a user
        cy.loginUserWithSession()

        //On s'attend à avoir une liste de sessions
        cy.contains('Séance pour les débutants').should('be.visible')

        //Mock pour recevoir la session 1 récupérée
        cy.intercept(
            {
                method: 'GET',
                url: '/api/session/1'
            },
            {
                body: {
                    id: 1,
                    name: 'Séance pour les débutants',
                    description: 'Séance réservée aux débutants',
                    date: '2023-10-07T00:00:00.000+00:00',
                    createdAt: '2023-09-25T00:00:00.000+00:00',
                    teacher_id: 1,
                    users: []
                },
            })
        //On mocke l'appel à teacher id1
        cy.intercept(
            {
                method: 'GET',
                url: '/api/teacher/1',
            },
            [
                {
                    id: 1,
                    lastName: 'DELAHAYE',
                    firstName: 'Margot',
                    createdAt: new Date(2020, 1, 1),
                    updatedAt: new Date(2021, 1, 1)
                }
            ])

        // Clic sur Detail
        cy.contains('span.ml1', 'Detail').click()


        //On s'attend à ce que le bouton participate soit proposé
        cy.contains('span.ml1', 'Participate').should('be.visible')

        //On mock l'appel à participate
        cy.intercept('POST', '/api/session/1/participate/1', {
            statusCode: 200
        })

        //Mock pour recevoir la session 1 récupérée avec l'id 1 du user qui participe
        cy.intercept(
            {
                method: 'GET',
                url: '/api/session/1'
            },
            {
                body: {
                    id: 1,
                    name: 'Séance pour les débutants',
                    description: 'Séance réservée aux débutants',
                    date: '2023-10-07T00:00:00.000+00:00',
                    createdAt: '2023-09-25T00:00:00.000+00:00',
                    teacher_id: 1,
                    users: [
                        1
                    ]
                },
            })

        //Clic sur Participate
        cy.contains('span.ml1', 'Participate').click()

        //On s'attend à ce que le bouton Do not participate soit  proposé
        cy.contains('span.ml1', 'Do not participate').should('be.visible')

        //On mock l'appel à participate
        cy.intercept('DELETE', '/api/session/1/participate/1', {
            statusCode: 200
        })

        //Mock pour recevoir la session 1 récupérée avec l'id 1 du user qui participe
        cy.intercept(
            {
                method: 'GET',
                url: '/api/session/1'
            },
            {
                body: {
                    id: 1,
                    name: 'Séance pour les débutants',
                    description: 'Séance réservée aux débutants',
                    date: '2023-10-07T00:00:00.000+00:00',
                    createdAt: '2023-09-25T00:00:00.000+00:00',
                    teacher_id: 1,
                    users: []
                },
            })

        //Clic sur Participate
        cy.contains('span.ml1', 'Do not participate').click()

        //On s'attend à ce que le bouton Do not participate soit  proposé
        cy.contains('span.ml1', 'Participate').should('be.visible')
    })
});