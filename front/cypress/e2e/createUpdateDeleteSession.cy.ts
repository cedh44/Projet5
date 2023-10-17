import '../support/commands.ts'

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