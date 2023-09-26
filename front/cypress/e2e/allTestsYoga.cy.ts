import '../support/commands.ts'

describe('Login Logout spec', () => {

  it('should not login successfully (email not found in database)', () => {
    cy.visit('/login')

    // Mock de l'appel à l'appel à login avec retour 401
    cy.intercept('POST', '/api/auth/login', {
      statusCode: 401,
      body: {
        error: 'Bad credentials',
      },
    })

    cy.get('input[formControlName=email]').type("notfound@studio.com")
    cy.get('input[formControlName=password]').type(`${"test!1234"}{enter}{enter}`)
    // On s'attend à que le message 'An error occurred' apparaisse
    cy.contains('An error occurred').should('be.visible');
  });


  it('should login successfully', () => {
    cy.loginAdmin()
  })

  it('should logout successfully', () => {
    cy.contains('Logout').click()
    cy.url().should('include', '')
  })
});

describe('Register spec', () => {

  it('should init register form successfully', () => {
    cy.visit('/register');
    cy.get('app-register').should('be.visible');
    cy.get('app-register form').should('be.visible');
    cy.get('app-register form input[formControlName=firstName]').should('be.visible');
    cy.get('app-register form input[formControlName=lastName]').should('be.visible');
    cy.get('app-register form input[formControlName=email]').should('be.visible');
    cy.get('app-register form input[formControlName=password]').should('be.visible');
    cy.get('app-register form button[type="submit"]').should('be.visible');
  })

  it('should register successfully and then login successfully', () => {
    cy.visit('/register')

    cy.intercept('POST', '/api/auth/register', {
      body: {
        id: 1,
        username: 'userName',
        firstName: 'firstName',
        lastName: 'lastName',
        admin: true
      },
    })

    cy.intercept(
      {
        method: 'GET',
        url: '/api/session',
      },
      []).as('session')

    cy.get('input[formControlName=firstName]').type("toto")
    cy.get('input[formControlName=lastName]').type("titi")
    cy.get('input[formControlName=email]').type("toto@gmail.com")
    cy.get('input[formControlName=password]').type(`${"test123!"}{enter}{enter}`)
    
    //On s'attend à arriver sur la page de login
    cy.url().should('include', '/login')

    cy.loginUser()
  })
});

describe('Me spec (Register)', () => {
    it('should login successfully and display account informations successfully', () => {
      
      cy.intercept({
          method: 'GET',
          url: '/api/session'
      })
  
      const user = {
          email: 'toto@gmail.com',
          firstName: 'toto',
          lastName: 'titi',
          admin: false,
          createdAt: new Date(2023, 9, 21),
          updatedAt: new Date(2023, 9, 25)
      }
      // Mock du user en retour
      cy.intercept('GET', '/api/user/1', {
          body: {
              email: 'toto@gmail.com',
              firstName: 'toto',
              lastName: 'titi',
              admin: false,
              createdAt: new Date(2023, 9, 21),
              updatedAt: new Date(2023, 9, 25)
          }
      })
      //Login as a user
      cy.loginUser()
  
      cy.url().should('include', '/sessions')
  
      // On s'attend à ce que le bouton Account soit visible
      cy.contains('span.link', 'Account').should('be.visible')
  
      // Clic sur Account
      cy.contains('span.link', 'Account').click()
  
      //On vérifie que les informations mockées s'affichent correctement
      cy.contains('Name: toto TITI').should('be.visible')
      cy.contains('Email: toto@gmail.com').should('be.visible');
      cy.contains('Delete my account:').should('be.visible');
      cy.contains('Create at: October 21, 2023').should('be.visible');
      cy.contains('Last update: October 25, 2023').should('be.visible');
  
    })
  
    it('should delete my account', () => {
  
          //On mocke l'appel DELETE du user 1 (retour 200 OK attendu)
          cy.intercept('DELETE', 'api/user/1', {
            statusCode: 200,
          })
      
          //Clic sur Delete
          cy.contains('span.ml1', 'Delete').click()
      
          //On s'attend à avoir le message 'Session deleted !'
          cy.contains('Your account has been deleted !').should('be.visible')
          cy.wait(3000)
    })
  });

  describe('Form List Detail Component spec (Create Update Delete Session as an Admin)', () => {
    it('should create a session and appears in the list', () => {
      //Mock appel pour recevoir la liste des teachers et alimenter la listbox
      cy.intercept(
        {
          method: 'GET',
          url: '/api/teacher',
        },
        [
          {
            id: 1,
            lastName: 'DELAHAYE',
            firstName: 'Margot',
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2021, 1, 1)
          },
          {
            id: 1,
            lastName: 'THIERCELIN',
            firstName: 'Hélène',
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2021, 1, 1)
          }
        ])
  
      //Mock pour la création (CREATE) de session
      cy.intercept(
        {
          method: 'POST',
          url: '/api/session',
        },
        {
          id: 1,
          name: 'Séance pour les débutants',
          description: 'Séance réservée aux débutants',
          date: new Date(2023, 7, 10),
          teacher_id: 1,
          createdAt: new Date(2023, 9, 25)
        })
  
      //Login as an admin
      cy.loginAdmin()
  
      // On s'attend à ce que le bouton Create soit visible
      cy.contains('span.ml1', 'Create').should('be.visible')
  
      // Clic sur Create
      cy.contains('span.ml1', 'Create').click()
  
      // On s'attend à avoir Create Session sur la page
      cy.contains('Create session').should('be.visible')
  
      //On remplit les champs de saisie du formulaire
      cy.get('input[formControlName=name]').type('Séance pour les débutants')
      cy.get('input[formControlName=date]').type('2023-07-10')
      cy.get('mat-select[formControlName=teacher_id]').click().get('mat-option').contains('Margot DELAHAYE').click()
      cy.get('textarea[formControlName=description]').type('Séance réservée aux débutants')
  
      //Mock pour la récupération des sessions
      cy.intercept(
        {
          method: 'GET',
          url: '/api/session',
        },
        {
          body: [
            {
              id: 1,
              name: 'Séance pour les débutants',
              description: 'Séance réservée aux débutants',
              date: new Date(2023, 7, 10),
              teacher_id: 1,
              users: [],
            },
          ],
        })
  
      // Clic sur Save
      cy.get('button[type=submit]').click();
  
      //On s'attend à revenir la page des sessions, avoir le message Session created et voir la session créée !
      cy.url().should('include', '/sessions')
      cy.contains('Session created !').should('be.visible')
      //Temporisation de 3s pour observer le message matSnackBar
      cy.wait(3000)
      cy.contains('Séance pour les débutants').should('be.visible')
  
    })
  
    it('should update a session and appears in the list updated', () => {
      //Mock appel pour recevoir la liste des teachers et alimenter la listbox
      cy.intercept(
        {
          method: 'GET',
          url: '/api/teacher',
        },
        [
          {
            id: 1,
            lastName: 'DELAHAYE',
            firstName: 'Margot',
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2021, 1, 1)
          },
          {
            id: 1,
            lastName: 'THIERCELIN',
            firstName: 'Hélène',
            createdAt: new Date(2020, 1, 1),
            updatedAt: new Date(2021, 1, 1)
          }
        ])
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
  
      // Clic sur Create
      cy.contains('span.ml1', 'Edit').click()
  
      //On remplit les champs de saisie du formulaire (ajout de 'modifiée')
      cy.get('input[formControlName=name]').type(' modifiée')
      cy.get('textarea[formControlName=description]').type(' modifiée')
  
  
      //Mock pour la récupération des sessions
      cy.intercept(
        {
          method: 'GET',
          url: '/api/session'
        },
        {
          body: [
            {
              id: 1,
              name: 'Séance pour les débutants modifiée',
              description: 'Séance réservée aux débutants modifiée',
              date: new Date(2023, 7, 10),
              teacher_id: 1,
              users: [],
            },
          ],
        })
  
      //Mock pour la modification (UPDATE) de session
      cy.intercept(
        {
          method: 'PUT',
          url: '/api/session/1',
        },
        {
          id: 1,
          name: 'Séance pour les débutants modifiée',
          description: 'Séance réservée aux débutants modifiée',
          date: new Date(2023, 7, 10),
          teacher_id: 1,
          updatedAt: new Date(2023, 9, 26)
        })
  
      cy.get('button[type=submit]').click();
  
      //On s'attend à revenir la page des sessions, avoir le message Session updated et voir la session modifiée !
      cy.url().should('include', '/sessions')
      cy.contains('Session updated !').should('be.visible')
      //Temporisation de 3s pour observer le message matSnackBar
      cy.wait(3000)
      cy.contains('Séance pour les débutants modifiée').should('be.visible')
    })
  
  
    it('should see the detail of a session and delete it', () => {
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
  
      //On mocke l'appel pour récupérer la session 1
      cy.intercept(
        {
          method: 'GET',
          url: '/api/session/1'
        },
        {
        body: {
          id: 1,
          name: 'Séance pour les débutants modifiée',
          description: 'Séance réservée aux débutants modifiée',
          date: '2023-10-07T00:00:00.000+00:00',
          createdAt: '2023-09-25T00:00:00.000+00:00',
          updateAd: '2023-09-26T00:00:00.000+00:00',
          teacher_id: 1,
          users: []
        },
      })
  
      // Clic sur Detail
      cy.contains('span.ml1', 'Detail').click()
  
      //On s'attend à avoir les détails de la session (on vérifie la description)
      cy.contains('div.description', 'Séance réservée aux débutants modifiée').should('be.visible')
  
      //On mocke l'appel DELETE la session 1 (retour 200 OK attendu)
      cy.intercept('DELETE', '/api/session/1', {
        statusCode: 200
      })
  
      //Clic sur Delete
      cy.contains('span.ml1', 'Delete').click()
  
      //On s'attend à revenir sur la liste et avoir le message 'Session deleted !'
      cy.url().should('include', '/sessions')
      cy.contains('Session deleted !').should('be.visible')
      //Temporisation de 3s pour observer le message matSnackBar
      cy.wait(3000)
    })
  });
  
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

describe('Not Found Spec', () => {
    it('should redirect to the not found page', () => {
      //Redirection vers une page inexistante
        cy.visit('/notexist');
  
      //On s'attend à être redirigé vers /404 et à avoir le message 'Page not found'
      cy.url().should('include', '/404')
      cy.contains('h1','Page not found').should('be.visible');

    });
})