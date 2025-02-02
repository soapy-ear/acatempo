CREATE DATABASE acatempoMain;

CREATE TABLE student(
    student_id SERIAL PRIMARY KEY, -- Automatically increments student ID
    first_name VARCHAR(50) NOT NULL, -- Student's first name
    surname VARCHAR(50) NOT NULL, -- Student's surname
    date_of_birth DATE NOT NULL, -- Student's date of birth
    address TEXT, -- Student's address
    email VARCHAR(100) NOT NULL UNIQUE, -- Email must be unique
    contact_number VARCHAR(15), -- Optional phone number
    course_registered VARCHAR(200), -- change to FK later
    modules_registered TEXT, -- change to FK later
    diversity_attributes JSONB, -- Stores structured diversity information
    reasonable_adjustments JSONB -- Stores structured reasonable adjustment data

);

--ALTER TABLE student
--ADD CONSTRAINT fk_course
--FOREIGN KEY (course_registered)
--REFERENCES course(course_id)
--ON DELETE SET NULL;

--ALTER TABLE student
--ADD CONSTRAINT fk_modules
--FOREIGN KEY (modules_registered)
--REFERENCES module(module_id)
--ON DELETE SET NULL;

--set extension
CREATE TABLE users(
    user_id uuid PRIMARY KEY DEFAULT 
    uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

--test users
INSERT INTO users(user_name, user_email, user_password) VALUES ('sophie', 'sophieearish@gmail.com', '12345');
INSERT INTO users(user_name, user_email, user_password) VALUES ('jae', 'jaewon.lfa@gmail.com', 'mabelcat');

CREATE TABLE module(
    mod_id SERIAL PRIMARY KEY,
    mod_name VARCHAR(50) NOT NULL,
    mod_cod VARCHAR(15) NOT NULL,
    description VARCHAR(255)
);

INSERT INTO module(mod_name, mod_cod) VALUES ('Software Development I', '4COSC001W');
INSERT INTO module(mod_name, mod_cod) VALUES ('Mathematics for Computing', '4COSC002W');
INSERT INTO module(mod_name, mod_cod) VALUES ('Trends in Computer Science', '4COSC003W');
INSERT INTO module(mod_name, mod_cod) VALUES ('Computer System Fundamentals', '4COSC004W');
INSERT INTO module(mod_name, mod_cod) VALUES ('Software Development II', '4COSC005W');
INSERT INTO module(mod_name, mod_cod) VALUES ('Web Design and Development', '4COSC011W');

ALTER TABLE module
ALTER COLUMN description TYPE VARCHAR(1500);

UPDATE module
SET description = 'An introduction to computer programming in a high-level programming language. The module concentrates on teaching the fundamentals of programming and algorithm design. Basic coding structures such as sequence, selection, and iteration will be covered. There will be an emphasis on practical exercises to develop programming experience and confidence.'
WHERE mod_cod = '4COSC001W';

UPDATE module
SET description = 'This module provides an in-depth exploration of the mathematical concepts and theories that form the backbone of computer science and software engineering disciplines. Designed for first-year students, it spans a broad range of topics, including discrete mathematics, linear algebra, and statistical methods, specifically emphasising set theory, number theory, functions, matrices, vectors, graph theory, and probabilistic and statistical reasoning. The curriculum is structured to go beyond theoretical learning, promoting the practical application of these mathematical foundations in computing contexts. Students will engage with algorithmic thinking, data representation, and analysis, employing their mathematical knowledge to tackle problems directly related to their field of study. This approach ensures that learners not only grasp the essential mathematical processes but also understand their application in real-world computing scenarios, preparing them for subsequent modules and their future careers in technology and engineering.'
WHERE mod_cod = '4COSC002W';

UPDATE module
SET description = 'The module focuses on trends in Computer Science which currently attract considerable industry and academic interest. It allows students to develop critical thinking skills by research and exploration of these topics. The module also develops employability skills in order to better support employability prospects and placements. It introduces key aspects of working as a professional in the world of computing, including consideration of ethics, privacy, data protection and confidentiality, and how these are incorporated into professional codes of practice such as the BCS Code of Conduct.'
WHERE mod_cod = '4COSC003W';

UPDATE module
SET description = 'This module is centred on the fundamental aspects of the way that a typical computer function either as a standalone entity or as part of a computer network. Discussion of the main hardware components of a computer system provides the backdrop to introduce the Von Neumann fetch–decode–execute cycle as well as the way in which data and information are stored in the computer. Students will learn about the various number systems (denary, binary and hexadecimal) that are utilised in computer systems. Progressing from the hardware level, students are introduced to the lowest programming level that humans can understand in the form of assembly programming. Above the assembly layer, there is the operating system layer. Students will be able to apply their knowledge of Binary number conversions and Logical Operations to perform Networking Calculations.'
WHERE mod_cod = '4COSC004W';

UPDATE module
SET description = 'The module aims to develop skills in the selection and implementation of problem-solving algorithms while learning the Java programming language. It will strengthen abilities in the implementation of algorithms, in terms of adherence to requirements, design and modelling, through to the application of sound programming principles. The understanding of structures and advanced programming methods will also be developed, including sorting, the implementation of classes and methods, as well as more sophisticated data structures such as lists, queues, and stacks. '
WHERE mod_cod = '4COSC005W';

UPDATE module
SET description = 'This module introduces web technologies and covers theoretical and practical concepts of web development. It covers a variety of commonly used Internet programming languages. Students will gain practical experience of Web page development, and they will be expected to write programs and Web pages conforming to given guidelines.'
WHERE mod_cod = '4COSC011W';