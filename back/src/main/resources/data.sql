INSERT INTO TEACHERS (first_name, last_name)
VALUES ('Margot', 'DELAHAYE'),
       ('Hélène', 'THIERCELIN');


INSERT INTO USERS (first_name, last_name, admin, email, password)
VALUES  ('Admin', 'Admin', true, 'yoga@studio.com', '$2a$10$.Hsa/ZjUVaHqi0tp9xieMeewrnZxrZ5pQRzddUXE/WjDu2ZThe6Iq'),
        ('titi', 'toto', 0, 'toto@gmail.com', '$2a$10$UVoAC3F3ksugfpByLsLWxuGwQrTJU08tJ8jWr6gBs7uetpQfpI4rS');

INSERT INTO SESSIONS (name, description, teacher_id, date)
VALUES  ('Séance pour les débutants', 'Séance pour les débutants', 1, '2023-12-01 01:00:00'),
        ('Séance avancée', 'Séance pour les confirmés', 2, '2023-12-01 01:00:00');