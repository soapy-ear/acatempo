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
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
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

ALTER TABLE module
ADD COLUMN semester VARCHAR(20);

UPDATE module
SET semester = "1"
WHERE mod_cod = '4COSC001W';

UPDATE module
SET semester = 1
WHERE mod_cod = '4COSC002W';

UPDATE module
SET semester = 2
WHERE mod_cod = '4COSC003W';

UPDATE module
SET semester = 1
WHERE mod_cod = '4COSC004W';

UPDATE module
SET semester = 2
WHERE mod_cod = '4COSC005W';

UPDATE module
SET semester = 2
WHERE mod_cod = '4COSC011W';

UPDATE module SET semester = '1' WHERE semester = 1;

UPDATE module SET semester = '2' WHERE semester = 2;


ALTER TABLE users ADD COLUMN role VARCHAR(20) CHECK (role IN ('student', 'staff', 'admin')) NOT NULL DEFAULT 'student';

INSERT INTO users (user_name, user_email, user_password, role) 
VALUES ($1, $2, $3, $4) RETURNING *;

CREATE TABLE students (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    student_number VARCHAR(50) UNIQUE NOT NULL
);



CREATE TABLE staff (
    user_id INT PRIMARY KEY REFERENCES users(user_id) ON DELETE CASCADE,
    department VARCHAR(255) NOT NULL
);

CREATE TABLE user_modules (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    mod_id INT NOT NULL REFERENCES module(mod_id) ON DELETE CASCADE,
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, mod_id)
);


INSERT INTO user_modules (user_id, mod_id) VALUES (1, 5);

SELECT * FROM user_modules;

SELECT u.user_name, m.mod_name, m.mod_cod
FROM users u
JOIN user_modules um ON u.user_id = um.user_id
JOIN module m ON um.mod_id = m.mod_id
WHERE u.user_id = 1;


INSERT INTO user_modules (user_id, mod_id) VALUES (1, 6);

CREATE TABLE room (
    roomID SERIAL PRIMARY KEY,
    capacity INT NOT NULL CHECK (capacity > 0),
    features TEXT,
    type VARCHAR(20) CHECK (type IN ('Lab', 'Classroom', 'Lecture Hall', 'Workshop')) NOT NULL
);


CREATE TABLE event (
    eventID SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(20) CHECK (type IN ('Lecture', 'Seminar', 'Workshop', 'ICT', 'Adhoc')) NOT NULL,
    semester INT CHECK (semester BETWEEN 1 AND 2),
    week INT CHECK (week BETWEEN 1 AND 15),
    day VARCHAR(10) CHECK (day IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday')) NOT NULL,
    start_time TIME NOT NULL, 
    end_time TIME NOT NULL,   
    size INT NOT NULL CHECK (size > 0),
    description TEXT,
    roomID INT REFERENCES room(roomID) ON DELETE SET NULL,
    staff_id INT REFERENCES staff(user_id) ON DELETE SET NULL, 
    mod_id INT REFERENCES module(mod_id) ON DELETE CASCADE, 
    group_id INT REFERENCES group_table(group_id) ON DELETE CASCADE 
);


DROP TABLE IF EXISTS room CASCADE; 

CREATE TABLE room (
    roomID SERIAL PRIMARY KEY,
    room_name VARCHAR(50) UNIQUE NOT NULL,  -- Added room name
    type VARCHAR(50) NOT NULL,  -- Increased size to allow specific lab names
    capacity INT NOT NULL CHECK (capacity > 0),
    features TEXT DEFAULT '' -- Allows storing multiple features in a string
);

INSERT INTO room (room_name, type, capacity, features) VALUES
('LG.101', 'Computer Lab', 20, '1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('LG.102', 'Computer Lab', 20, '1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('LG.103', 'Computer Lab', 20, ''),
('LG.105', 'Computer Lab', 20, '1 x SWPACS; 1 x WHEELCHAIR'),
('LG.106', 'Computer Lab', 20, '1 x SWPACS; 1 x WHEELCHAIR'),
('LG.107', 'Hardware/Electronic Lab', 20, ''),
('G.100', 'Computer Lab', 40, '1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('G.103', 'Computer Lab', 20, '1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('G.105', 'Computer Lab', 40, '1 x BLINDS; 1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('2.112', 'Computer Lab', 40, ''),
('4.115', 'Computer Lab', 20, ''),
('4.118', 'Computer Lab', 20, '1 x BLINDS; 1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('4.119', 'Computer Lab', 20, '1 x BLINDS; 1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('4.12', 'Computer Lab', 20, '1 x BLINDS; 1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('5.107', 'Computer Lab', 40, ''),
('5.111', 'Computer Lab', 4, '1 x BLINDS; 1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('5.116', 'Computer Lab', 28, '1 x BLINDS; 1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('CLG.42', 'Computer Lab', 40, ''),
('CLG.43', 'Computer Lab', 20, ''),
('CLG.45', 'Computer Lab', 20, '1 x WHEELCHAIR'),
('CLG.46', 'Computer Lab', 20, '1 x WHEELCHAIR'),
('CLG.50', 'Computer Lab', 20, '1 x SWPACS; 1 x WHEELCHAIR'),
('CLG.51', 'Computer Lab', 40, '1 x STDLCK; 1 x WHEELCHAIR'),
('CLG.53', 'Computer Lab', 40, ''),
('CG.24/25', 'Computer Lab', 40, ''),
('5.108A', 'SPEC LAPTOP LAB', 36, ''),
('5.108B', 'SPEC LAPTOP LAB', 24, '1 x BLINDS; 1 x SWPACS; 1 x WHEELCHAIR; 1 x WINDOWS'),
('1.100A', 'Classroom', 40, ''),
('1.100B', 'Classroom', 30, ''),
('1.108', 'Classroom', 32, '1 x WHEELCHAIR; 1 x WINDOWS; 1 x BLINDS; 1 x SWPACS'),
('1.109', 'Classroom', 86, '1 x INDLOP'),
('1.11', 'Classroom', 60, '1 x INDLOP'),
('1.111', 'Classroom', 53, '1 x INDLOP'),
('1.112', 'Classroom', 40, ''),
('C1.01', 'Classroom', 30, ''),
('C1.03', 'Classroom', 94, '1 x INDLOP'),
('C1.04', 'Classroom', 90, '1 x INDLOP'),
('C1.09', 'Classroom', 70, ''),
('C1.52', 'Lecture Theatre', 80, ''),
('C2.01', 'Classroom', 60, ''),
('C2.02', 'Classroom', 40, ''),
('C2.04', 'Classroom', 24, ''),
('C2.05', 'Classroom', 30, ''),
('C2.07', 'Classroom', 48, '1 x INDLOP'),
('C2.08', 'Classroom', 28, ''),
('C2.09', 'Classroom', 26, ''),
('C2.10', 'Classroom', 26, ''),
('C2.11', 'Classroom', 24, ''),
('C2.12', 'Lecture Theatre', 220, '1 x INDLOP'),
('C2.14', 'Classroom', 70, '1 x INDLOP'),
('C1.15-16', 'Classroom', 122, '1 x INDLOP'),
('G.03', 'Lecture Theatre', 386, '');


CREATE TABLE group_table ( --group is a reserved word
    group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(20) UNIQUE NOT NULL, 
    mod_id INT NOT NULL REFERENCES module(mod_id) ON DELETE CASCADE, 
    capacity INT NOT NULL CHECK (capacity > 0) 
);


CREATE TABLE student_group (
    student_id INT NOT NULL REFERENCES students(user_id) ON DELETE CASCADE,
    group_id INT NOT NULL REFERENCES group_table(group_id) ON DELETE CASCADE,
    PRIMARY KEY (student_id, group_id) -- Ensures a student can only be in one group per module
);

-- Insert all groups for each module (mod_id 1 to 6)
INSERT INTO group_table (group_name, mod_id, capacity) VALUES
-- Groups for mod_id 1
('4CS01', 1, 20), ('4CS02', 1, 20), ('4CS03', 1, 20), ('4CS04', 1, 20),
('4CS05', 1, 20), ('4CS06', 1, 20), ('4CS07', 1, 20), ('4CS08', 1, 20),
('4CS09', 1, 20), ('4CS10', 1, 20), ('4CS11', 1, 20), ('4CS12', 1, 20),
('4CS13', 1, 20), ('4CS14', 1, 20), ('4CS15', 1, 20), ('4CS16', 1, 20),
('4CS17', 1, 20), ('4CS18', 1, 20), ('4SE01', 1, 20), ('4SE02', 1, 20),
('4SE03', 1, 20), ('4SE04', 1, 20), ('4SE05', 1, 20), ('4SE06', 1, 20),
('4SE07', 1, 20), ('4DSA01', 1, 20), ('4DSA02', 1, 20),

-- Groups for mod_id 2
('4CS01', 2, 20), ('4CS02', 2, 20), ('4CS03', 2, 20), ('4CS04', 2, 20),
('4CS05', 2, 20), ('4CS06', 2, 20), ('4CS07', 2, 20), ('4CS08', 2, 20),
('4CS09', 2, 20), ('4CS10', 2, 20), ('4CS11', 2, 20), ('4CS12', 2, 20),
('4CS13', 2, 20), ('4CS14', 2, 20), ('4CS15', 2, 20), ('4CS16', 2, 20),
('4CS17', 2, 20), ('4CS18', 2, 20), ('4SE01', 2, 20), ('4SE02', 2, 20),
('4SE03', 2, 20), ('4SE04', 2, 20), ('4SE05', 2, 20), ('4SE06', 2, 20),
('4SE07', 2, 20), ('4DSA01', 2, 20), ('4DSA02', 2, 20),

-- Groups for mod_id 3
('4CS01', 3, 20), ('4CS02', 3, 20), ('4CS03', 3, 20), ('4CS04', 3, 20),
('4CS05', 3, 20), ('4CS06', 3, 20), ('4CS07', 3, 20), ('4CS08', 3, 20),
('4CS09', 3, 20), ('4CS10', 3, 20), ('4CS11', 3, 20), ('4CS12', 3, 20),
('4CS13', 3, 20), ('4CS14', 3, 20), ('4CS15', 3, 20), ('4CS16', 3, 20),
('4CS17', 3, 20), ('4CS18', 3, 20), ('4SE01', 3, 20), ('4SE02', 3, 20),
('4SE03', 3, 20), ('4SE04', 3, 20), ('4SE05', 3, 20), ('4SE06', 3, 20),
('4SE07', 3, 20), ('4DSA01', 3, 20), ('4DSA02', 3, 20),

INSERT INTO group_table (group_name, mod_id, capacity) VALUES
-- Groups for mod_id 4
('4CS01', 4, 20), ('4CS02', 4, 20), ('4CS03', 4, 20), ('4CS04', 4, 20),
('4CS05', 4, 20), ('4CS06', 4, 20), ('4CS07', 4, 20), ('4CS08', 4, 20),
('4CS09', 4, 20), ('4CS10', 4, 20), ('4CS11', 4, 20), ('4CS12', 4, 20),
('4CS13', 4, 20), ('4CS14', 4, 20), ('4CS15', 4, 20), ('4CS16', 4, 20),
('4CS17', 4, 20), ('4CS18', 4, 20), ('4SE01', 4, 20), ('4SE02', 4, 20),
('4SE03', 4, 20), ('4SE04', 4, 20), ('4SE05', 4, 20), ('4SE06', 4, 20),
('4SE07', 4, 20), ('4DSA01', 4, 20), ('4DSA02', 4, 20),

-- Groups for mod_id 5
('4CS01', 5, 20), ('4CS02', 5, 20), ('4CS03', 5, 20), ('4CS04', 5, 20),
('4CS05', 5, 20), ('4CS06', 5, 20), ('4CS07', 5, 20), ('4CS08', 5, 20),
('4CS09', 5, 20), ('4CS10', 5, 20), ('4CS11', 5, 20), ('4CS12', 5, 20),
('4CS13', 5, 20), ('4CS14', 5, 20), ('4CS15', 5, 20), ('4CS16', 5, 20),
('4CS17', 5, 20), ('4CS18', 5, 20), ('4SE01', 5, 20), ('4SE02', 5, 20),
('4SE03', 5, 20), ('4SE04', 5, 20), ('4SE05', 5, 20), ('4SE06', 5, 20),
('4SE07', 5, 20), ('4DSA01', 5, 20), ('4DSA02', 5, 20),

-- Groups for mod_id 6
('4CS01', 6, 20), ('4CS02', 6, 20), ('4CS03', 6, 20), ('4CS04', 6, 20),
('4CS05', 6, 20), ('4CS06', 6, 20), ('4CS07', 6, 20), ('4CS08', 6, 20),
('4CS09', 6, 20), ('4CS10', 6, 20), ('4CS11', 6, 20), ('4CS12', 6, 20),
('4CS13', 6, 20), ('4CS14', 6, 20), ('4CS15', 6, 20), ('4CS16', 6, 20),
('4CS17', 6, 20), ('4CS18', 6, 20), ('4SE01', 6, 20), ('4SE02', 6, 20),
('4SE03', 6, 20), ('4SE04', 6, 20), ('4SE05', 6, 20), ('4SE06', 6, 20),
('4SE07', 6, 20), ('4DSA01', 6, 20), ('4DSA02', 6, 20);

SELECT * FROM group_table ORDER BY mod_id, group_name;

ALTER TABLE room ADD COLUMN is_online BOOLEAN DEFAULT FALSE; -- Adds a column to indicate if the room is online
INSERT INTO room (roomID, room_name, capacity, features, type, is_online) 
VALUES (9999, 'Online Room', 9999, 'Online Learning Platform', 'Online', TRUE);

defaultdb=> SELECT roomID, room_name FROM room;
 roomid |  room_name  
--------+-------------
     23 | LG.101
     24 | LG.102
     25 | LG.103
     26 | LG.105
     27 | LG.106
     28 | LG.107
     29 | G.100
     30 | G.103
     31 | G.105
     32 | 2.112
     33 | 4.115
     34 | 4.118
     35 | 4.119
     36 | 4.12
     37 | 5.107
     38 | 5.111
     39 | 5.116
     40 | CLG.42
     41 | CLG.43
     42 | CLG.45
     43 | CLG.46
     44 | CLG.50
     45 | CLG.51
     46 | CLG.53
     47 | CG.24/25
     48 | 5.108A
     49 | 5.108B
     50 | 1.100A
     51 | 1.100B
     52 | 1.108
     53 | 1.109
     54 | 1.11
     55 | 1.111
     56 | 1.112
     57 | C1.01
     58 | C1.03
     59 | C1.04
     60 | C1.09
     61 | C1.52
     62 | C2.01
     63 | C2.02
     64 | C2.04
     65 | C2.05
     66 | C2.07
     67 | C2.08
     68 | C2.09
     69 | C2.10
     70 | C2.11
     71 | C2.12
     72 | C2.14
     73 | C1.15-16
     74 | G.03
    9999 | Online Room
(53 rows)

defaultdb=> SELECT group_id, group_name FROM group_table WHERE mod_id = 1;
 group_id | group_name 
----------+------------
       29 | 4CS01
       30 | 4CS02
       31 | 4CS03
       32 | 4CS04
       33 | 4CS05
       34 | 4CS06
       35 | 4CS07
       36 | 4CS08
       37 | 4CS09
       38 | 4CS10
       39 | 4CS11
       40 | 4CS12
       41 | 4CS13
       42 | 4CS14
       43 | 4CS15
       44 | 4CS16
       45 | 4CS17
       46 | 4CS18
       47 | 4SE01
       48 | 4SE02
       49 | 4SE03
       50 | 4SE04
       51 | 4SE05
       52 | 4SE06
       53 | 4SE07
       54 | 4DSA01
       55 | 4DSA02
(27 rows)
 group_id | group_name | mod_id | module_code 
----------+------------+--------+-------------
       29 | 4CS01      |      1 | 4COSC001W
       30 | 4CS02      |      1 | 4COSC001W
       31 | 4CS03      |      1 | 4COSC001W
       32 | 4CS04      |      1 | 4COSC001W
       33 | 4CS05      |      1 | 4COSC001W
       34 | 4CS06      |      1 | 4COSC001W
       35 | 4CS07      |      1 | 4COSC001W
       36 | 4CS08      |      1 | 4COSC001W
       37 | 4CS09      |      1 | 4COSC001W
       38 | 4CS10      |      1 | 4COSC001W
       39 | 4CS11      |      1 | 4COSC001W
       40 | 4CS12      |      1 | 4COSC001W
       41 | 4CS13      |      1 | 4COSC001W
       42 | 4CS14      |      1 | 4COSC001W
       43 | 4CS15      |      1 | 4COSC001W
       44 | 4CS16      |      1 | 4COSC001W
       45 | 4CS17      |      1 | 4COSC001W
       46 | 4CS18      |      1 | 4COSC001W
       47 | 4SE01      |      1 | 4COSC001W
       48 | 4SE02      |      1 | 4COSC001W
       49 | 4SE03      |      1 | 4COSC001W
       50 | 4SE04      |      1 | 4COSC001W
       51 | 4SE05      |      1 | 4COSC001W
       52 | 4SE06      |      1 | 4COSC001W
       53 | 4SE07      |      1 | 4COSC001W
       54 | 4DSA01     |      1 | 4COSC001W
       55 | 4DSA02     |      1 | 4COSC001W
       56 | 4CS01      |      2 | 4COSC002W
       57 | 4CS02      |      2 | 4COSC002W
       58 | 4CS03      |      2 | 4COSC002W
       59 | 4CS04      |      2 | 4COSC002W
       60 | 4CS05      |      2 | 4COSC002W
       61 | 4CS06      |      2 | 4COSC002W
       62 | 4CS07      |      2 | 4COSC002W
       63 | 4CS08      |      2 | 4COSC002W
       64 | 4CS09      |      2 | 4COSC002W
       65 | 4CS10      |      2 | 4COSC002W
       66 | 4CS11      |      2 | 4COSC002W
       67 | 4CS12      |      2 | 4COSC002W
       68 | 4CS13      |      2 | 4COSC002W
       69 | 4CS14      |      2 | 4COSC002W
       70 | 4CS15      |      2 | 4COSC002W
       71 | 4CS16      |      2 | 4COSC002W
       72 | 4CS17      |      2 | 4COSC002W
       73 | 4CS18      |      2 | 4COSC002W
       74 | 4SE01      |      2 | 4COSC002W
       75 | 4SE02      |      2 | 4COSC002W
       76 | 4SE03      |      2 | 4COSC002W
       77 | 4SE04      |      2 | 4COSC002W
       78 | 4SE05      |      2 | 4COSC002W
       79 | 4SE06      |      2 | 4COSC002W
       80 | 4SE07      |      2 | 4COSC002W
       81 | 4DSA01     |      2 | 4COSC002W
       82 | 4DSA02     |      2 | 4COSC002W
       83 | 4CS01      |      3 | 4COSC003W
       84 | 4CS02      |      3 | 4COSC003W
       85 | 4CS03      |      3 | 4COSC003W
       86 | 4CS04      |      3 | 4COSC003W
       87 | 4CS05      |      3 | 4COSC003W
       88 | 4CS06      |      3 | 4COSC003W
       89 | 4CS07      |      3 | 4COSC003W
       90 | 4CS08      |      3 | 4COSC003W
       91 | 4CS09      |      3 | 4COSC003W
       92 | 4CS10      |      3 | 4COSC003W
       93 | 4CS11      |      3 | 4COSC003W
       94 | 4CS12      |      3 | 4COSC003W
       95 | 4CS13      |      3 | 4COSC003W
       96 | 4CS14      |      3 | 4COSC003W
       97 | 4CS15      |      3 | 4COSC003W
       98 | 4CS16      |      3 | 4COSC003W
       99 | 4CS17      |      3 | 4COSC003W
      100 | 4CS18      |      3 | 4COSC003W
      101 | 4SE01      |      3 | 4COSC003W
      102 | 4SE02      |      3 | 4COSC003W
      103 | 4SE03      |      3 | 4COSC003W
      104 | 4SE04      |      3 | 4COSC003W
      105 | 4SE05      |      3 | 4COSC003W
      106 | 4SE06      |      3 | 4COSC003W
      107 | 4SE07      |      3 | 4COSC003W
      108 | 4DSA01     |      3 | 4COSC003W
      109 | 4DSA02     |      3 | 4COSC003W
      110 | 4CS01      |      4 | 4COSC004W
      111 | 4CS02      |      4 | 4COSC004W
      112 | 4CS03      |      4 | 4COSC004W
      113 | 4CS04      |      4 | 4COSC004W
      114 | 4CS05      |      4 | 4COSC004W
      115 | 4CS06      |      4 | 4COSC004W
      116 | 4CS07      |      4 | 4COSC004W
      117 | 4CS08      |      4 | 4COSC004W
      118 | 4CS09      |      4 | 4COSC004W
      119 | 4CS10      |      4 | 4COSC004W
      120 | 4CS11      |      4 | 4COSC004W
      121 | 4CS12      |      4 | 4COSC004W
      122 | 4CS13      |      4 | 4COSC004W
      123 | 4CS14      |      4 | 4COSC004W
      124 | 4CS15      |      4 | 4COSC004W
      125 | 4CS16      |      4 | 4COSC004W
      126 | 4CS17      |      4 | 4COSC004W
      127 | 4CS18      |      4 | 4COSC004W
      128 | 4SE01      |      4 | 4COSC004W
      129 | 4SE02      |      4 | 4COSC004W
      130 | 4SE03      |      4 | 4COSC004W
      131 | 4SE04      |      4 | 4COSC004W
      132 | 4SE05      |      4 | 4COSC004W
      133 | 4SE06      |      4 | 4COSC004W
      134 | 4SE07      |      4 | 4COSC004W
      135 | 4DSA01     |      4 | 4COSC004W
      136 | 4DSA02     |      4 | 4COSC004W
      137 | 4CS01      |      5 | 4COSC005W
      138 | 4CS02      |      5 | 4COSC005W
      139 | 4CS03      |      5 | 4COSC005W
      140 | 4CS04      |      5 | 4COSC005W
      141 | 4CS05      |      5 | 4COSC005W
      142 | 4CS06      |      5 | 4COSC005W
      143 | 4CS07      |      5 | 4COSC005W
      144 | 4CS08      |      5 | 4COSC005W
      145 | 4CS09      |      5 | 4COSC005W
      146 | 4CS10      |      5 | 4COSC005W
      147 | 4CS11      |      5 | 4COSC005W
      148 | 4CS12      |      5 | 4COSC005W
      149 | 4CS13      |      5 | 4COSC005W
      150 | 4CS14      |      5 | 4COSC005W
      151 | 4CS15      |      5 | 4COSC005W
      152 | 4CS16      |      5 | 4COSC005W
      153 | 4CS17      |      5 | 4COSC005W
      154 | 4CS18      |      5 | 4COSC005W
      155 | 4SE01      |      5 | 4COSC005W
      156 | 4SE02      |      5 | 4COSC005W
      157 | 4SE03      |      5 | 4COSC005W
      158 | 4SE04      |      5 | 4COSC005W
      159 | 4SE05      |      5 | 4COSC005W
      160 | 4SE06      |      5 | 4COSC005W
      161 | 4SE07      |      5 | 4COSC005W
      162 | 4DSA01     |      5 | 4COSC005W
      163 | 4DSA02     |      5 | 4COSC005W
      164 | 4CS01      |      6 | 4COSC011W
      165 | 4CS02      |      6 | 4COSC011W
      166 | 4CS03      |      6 | 4COSC011W
      167 | 4CS04      |      6 | 4COSC011W
      168 | 4CS05      |      6 | 4COSC011W
      169 | 4CS06      |      6 | 4COSC011W
      170 | 4CS07      |      6 | 4COSC011W
      171 | 4CS08      |      6 | 4COSC011W
      172 | 4CS09      |      6 | 4COSC011W
      173 | 4CS10      |      6 | 4COSC011W
      174 | 4CS11      |      6 | 4COSC011W
      175 | 4CS12      |      6 | 4COSC011W
      176 | 4CS13      |      6 | 4COSC011W
      177 | 4CS14      |      6 | 4COSC011W
      178 | 4CS15      |      6 | 4COSC011W
      179 | 4CS16      |      6 | 4COSC011W
      180 | 4CS17      |      6 | 4COSC011W
      181 | 4CS18      |      6 | 4COSC011W
      182 | 4SE01      |      6 | 4COSC011W
      183 | 4SE02      |      6 | 4COSC011W
      184 | 4SE03      |      6 | 4COSC011W
      185 | 4SE04      |      6 | 4COSC011W
      186 | 4SE05      |      6 | 4COSC011W
      187 | 4SE06      |      6 | 4COSC011W
      188 | 4SE07      |      6 | 4COSC011W
      189 | 4DSA01     |      6 | 4COSC011W
      190 | 4DSA02     |      6 | 4COSC011W
      191 | 5SE04      |      8 | 5COSC019W
      192 | 5SE05      |      8 | 5COSC019W
      193 | 5DSA1      |      8 | 5COSC019W
      194 | 5CS01      |      9 | 5COSC020W
      195 | 5CS02      |      9 | 5COSC020W
      196 | 5CS03      |      9 | 5COSC020W
      197 | 5CS04      |      9 | 5COSC020W
      198 | 5CS05      |      9 | 5COSC020W
      199 | 5CS06      |      9 | 5COSC020W
      200 | 5CS07      |      9 | 5COSC020W
      201 | 5CS08      |      9 | 5COSC020W
      202 | 5CS09      |      9 | 5COSC020W
      203 | 5CS10      |      9 | 5COSC020W
      204 | 5CS11      |      9 | 5COSC020W
      205 | 5CS12      |      9 | 5COSC020W
      206 | 5CS13      |      9 | 5COSC020W
      207 | 5CS14      |      9 | 5COSC020W
      208 | 5CS15      |      9 | 5COSC020W
      209 | 5CS16      |      9 | 5COSC020W
      210 | 5CS17      |      9 | 5COSC020W
      211 | 5SE01      |      9 | 5COSC020W
      212 | 5SE02      |      9 | 5COSC020W
      213 | 5SE03      |      9 | 5COSC020W
      214 | 5SE04      |      9 | 5COSC020W
      215 | 5SE05      |      9 | 5COSC020W
      216 | 5DSA1      |      9 | 5COSC020W
      217 | 5CS01      |     10 | 5COSC021W
      218 | 5CS02      |     10 | 5COSC021W
      219 | 5CS03      |     10 | 5COSC021W
      220 | 5CS04      |     10 | 5COSC021W
      221 | 5CS05      |     10 | 5COSC021W
      222 | 5CS06      |     10 | 5COSC021W
      223 | 5CS07      |     10 | 5COSC021W
      224 | 5CS08      |     10 | 5COSC021W
      225 | 5CS09      |     10 | 5COSC021W
      226 | 5CS10      |     10 | 5COSC021W
      227 | 5CS11      |     10 | 5COSC021W
      228 | 5CS12      |     10 | 5COSC021W
      229 | 5CS13      |     10 | 5COSC021W
      230 | 5CS14      |     10 | 5COSC021W
      231 | 5CS15      |     10 | 5COSC021W
      232 | 5CS16      |     10 | 5COSC021W
      233 | 5CS17      |     10 | 5COSC021W
      234 | 5SE01      |     10 | 5COSC021W
      235 | 5SE02      |     10 | 5COSC021W
      236 | 5SE03      |     10 | 5COSC021W
      237 | 5SE04      |     10 | 5COSC021W
      238 | 5SE05      |     10 | 5COSC021W
      239 | 5DSA1      |     10 | 5COSC021W
      240 | 5CS01      |     11 | 5COSC022W
      241 | 5CS02      |     11 | 5COSC022W
      242 | 5CS03      |     11 | 5COSC022W
      243 | 5CS04      |     11 | 5COSC022W
      244 | 5CS05      |     11 | 5COSC022W
      245 | 5CS06      |     11 | 5COSC022W
      246 | 5CS07      |     11 | 5COSC022W
      247 | 5CS08      |     11 | 5COSC022W
      248 | 5CS09      |     11 | 5COSC022W
      249 | 5CS10      |     11 | 5COSC022W
      250 | 5CS11      |     11 | 5COSC022W
      251 | 5CS12      |     11 | 5COSC022W
      252 | 5CS13      |     11 | 5COSC022W
      253 | 5CS14      |     11 | 5COSC022W
      254 | 5CS15      |     11 | 5COSC022W
      255 | 5CS16      |     11 | 5COSC022W
      256 | 5CS17      |     11 | 5COSC022W
      257 | 5SE01      |     11 | 5COSC022W
      258 | 5SE02      |     11 | 5COSC022W
      259 | 5SE03      |     11 | 5COSC022W
      260 | 5SE04      |     11 | 5COSC022W
      261 | 5SE05      |     11 | 5COSC022W
      262 | 5DSA1      |     11 | 5COSC022W
      263 | 5CS01      |     12 | 5COSC023W
      264 | 5CS02      |     12 | 5COSC023W
      265 | 5CS03      |     12 | 5COSC023W
      266 | 5CS04      |     12 | 5COSC023W
      267 | 5CS05      |     12 | 5COSC023W
      268 | 5CS06      |     12 | 5COSC023W
      269 | 5CS07      |     12 | 5COSC023W
      270 | 5CS08      |     12 | 5COSC023W
      271 | 5CS09      |     12 | 5COSC023W
      272 | 5CS10      |     12 | 5COSC023W
      273 | 5CS11      |     12 | 5COSC023W
      274 | 5CS12      |     12 | 5COSC023W
      275 | 5CS13      |     12 | 5COSC023W
      276 | 5CS14      |     12 | 5COSC023W
      277 | 5CS15      |     12 | 5COSC023W
      278 | 5CS16      |     12 | 5COSC023W
      279 | 5CS17      |     12 | 5COSC023W
      280 | 5SE01      |     12 | 5COSC023W
      281 | 5SE02      |     12 | 5COSC023W
      282 | 5SE03      |     12 | 5COSC023W
      283 | 5SE04      |     12 | 5COSC023W
      284 | 5SE05      |     12 | 5COSC023W
      285 | 5DSA1      |     12 | 5COSC023W
      286 | 5CS01      |     13 | 5COSC024W
      287 | 5CS02      |     13 | 5COSC024W
      288 | 5CS03      |     13 | 5COSC024W
      289 | 5CS04      |     13 | 5COSC024W
      290 | 5CS05      |     13 | 5COSC024W
      291 | 5CS06      |     13 | 5COSC024W
      292 | 5CS07      |     13 | 5COSC024W
      293 | 5CS08      |     13 | 5COSC024W
      294 | 5CS09      |     13 | 5COSC024W
      295 | 5CS10      |     13 | 5COSC024W
      296 | 5CS11      |     13 | 5COSC024W
      297 | 5CS12      |     13 | 5COSC024W
      298 | 5CS13      |     13 | 5COSC024W
      299 | 5CS14      |     13 | 5COSC024W
      300 | 5CS15      |     13 | 5COSC024W
      301 | 5CS16      |     13 | 5COSC024W
      302 | 5CS17      |     13 | 5COSC024W
      303 | 5SE01      |     13 | 5COSC024W
      304 | 5SE02      |     13 | 5COSC024W
      305 | 5SE03      |     13 | 5COSC024W
      306 | 5SE04      |     13 | 5COSC024W
      307 | 5SE05      |     13 | 5COSC024W
      308 | 5DSA1      |     13 | 5COSC024W
      309 | 5CS01      |     14 | 5COSC025W
      310 | 5CS02      |     14 | 5COSC025W
      311 | 5CS03      |     14 | 5COSC025W
      312 | 5CS04      |     14 | 5COSC025W
      313 | 5CS05      |     14 | 5COSC025W
      314 | 5CS06      |     14 | 5COSC025W
      315 | 5CS07      |     14 | 5COSC025W
      316 | 5CS08      |     14 | 5COSC025W
      317 | 5CS09      |     14 | 5COSC025W
      318 | 5CS10      |     14 | 5COSC025W
      319 | 5CS11      |     14 | 5COSC025W
      320 | 5CS12      |     14 | 5COSC025W
      321 | 5CS13      |     14 | 5COSC025W
      322 | 5CS14      |     14 | 5COSC025W
      323 | 5CS15      |     14 | 5COSC025W
      324 | 5CS16      |     14 | 5COSC025W
      325 | 5CS17      |     14 | 5COSC025W
      326 | 5SE01      |     14 | 5COSC025W
      327 | 5SE02      |     14 | 5COSC025W
      328 | 5SE03      |     14 | 5COSC025W
      329 | 5SE04      |     14 | 5COSC025W
      330 | 5SE05      |     14 | 5COSC025W
      331 | 5DSA1      |     14 | 5COSC025W
      332 | 5CS01      |     15 | 5COSC026W
      333 | 5CS02      |     15 | 5COSC026W
      334 | 5CS03      |     15 | 5COSC026W
      335 | 5CS04      |     15 | 5COSC026W
      336 | 5CS05      |     15 | 5COSC026W
      337 | 5CS06      |     15 | 5COSC026W
      338 | 5CS07      |     15 | 5COSC026W
      339 | 5CS08      |     15 | 5COSC026W
      340 | 5CS09      |     15 | 5COSC026W
      341 | 5CS10      |     15 | 5COSC026W
      342 | 5CS11      |     15 | 5COSC026W
      343 | 5CS12      |     15 | 5COSC026W
      344 | 5CS13      |     15 | 5COSC026W
      345 | 5CS14      |     15 | 5COSC026W
      346 | 5CS15      |     15 | 5COSC026W
      347 | 5CS16      |     15 | 5COSC026W
      348 | 5CS17      |     15 | 5COSC026W
      349 | 5SE01      |     15 | 5COSC026W
      350 | 5SE02      |     15 | 5COSC026W
      351 | 5SE03      |     15 | 5COSC026W
      352 | 5SE04      |     15 | 5COSC026W
      353 | 5SE05      |     15 | 5COSC026W
      354 | 5DSA1      |     15 | 5COSC026W
      355 | 6CS01      |     16 | 6COSC019W
      356 | 6CS02      |     16 | 6COSC019W
      357 | 6CS03      |     16 | 6COSC019W
      358 | 6CS04      |     16 | 6COSC019W
      359 | 6CS05      |     16 | 6COSC019W
      360 | 6CS06      |     16 | 6COSC019W
      361 | 6CS07      |     16 | 6COSC019W
      362 | 6CS08      |     16 | 6COSC019W
      363 | 6CS09      |     16 | 6COSC019W
      364 | 6CS10      |     16 | 6COSC019W
      365 | 6CS11      |     16 | 6COSC019W
      366 | 6CS12      |     16 | 6COSC019W
      367 | 6CS13      |     16 | 6COSC019W
      368 | 6CS14      |     16 | 6COSC019W
      369 | 6CS15      |     16 | 6COSC019W
      370 | 6CS16      |     16 | 6COSC019W
      371 | 6CS17      |     16 | 6COSC019W
      372 | 6SE01      |     16 | 6COSC019W
      373 | 6SE02      |     16 | 6COSC019W
      374 | 6SE03      |     16 | 6COSC019W
      375 | 6SE04      |     16 | 6COSC019W
      376 | 6SE05      |     16 | 6COSC019W
      377 | 6DSA1      |     16 | 6COSC019W
      378 | 6CS01      |     17 | 6COSC020W
      379 | 6CS02      |     17 | 6COSC020W
      380 | 6CS03      |     17 | 6COSC020W
      381 | 6CS04      |     17 | 6COSC020W
      382 | 6CS05      |     17 | 6COSC020W
      383 | 6CS06      |     17 | 6COSC020W
      384 | 6CS07      |     17 | 6COSC020W
      385 | 6CS08      |     17 | 6COSC020W
      386 | 6CS09      |     17 | 6COSC020W
      387 | 6CS10      |     17 | 6COSC020W
      388 | 6CS11      |     17 | 6COSC020W
      389 | 6CS12      |     17 | 6COSC020W
      390 | 6CS13      |     17 | 6COSC020W
      391 | 6CS14      |     17 | 6COSC020W
      392 | 6CS15      |     17 | 6COSC020W
      393 | 6CS16      |     17 | 6COSC020W
      394 | 6CS17      |     17 | 6COSC020W
      395 | 6SE01      |     17 | 6COSC020W
      396 | 6SE02      |     17 | 6COSC020W
      397 | 6SE03      |     17 | 6COSC020W
      398 | 6SE04      |     17 | 6COSC020W
      399 | 6SE05      |     17 | 6COSC020W
      400 | 6DSA1      |     17 | 6COSC020W
      401 | 6CS01      |     18 | 6COSC021W
      402 | 6CS02      |     18 | 6COSC021W
      403 | 6CS03      |     18 | 6COSC021W
      404 | 6CS04      |     18 | 6COSC021W
      405 | 6CS05      |     18 | 6COSC021W
      406 | 6CS06      |     18 | 6COSC021W
      407 | 6CS07      |     18 | 6COSC021W
      408 | 6CS08      |     18 | 6COSC021W
      409 | 6CS09      |     18 | 6COSC021W
      410 | 6CS10      |     18 | 6COSC021W
      411 | 6CS11      |     18 | 6COSC021W
      412 | 6CS12      |     18 | 6COSC021W
      413 | 6CS13      |     18 | 6COSC021W
      414 | 6CS14      |     18 | 6COSC021W
      415 | 6CS15      |     18 | 6COSC021W
      416 | 6CS16      |     18 | 6COSC021W
      417 | 6CS17      |     18 | 6COSC021W
      418 | 6SE01      |     18 | 6COSC021W
      419 | 6SE02      |     18 | 6COSC021W
      420 | 6SE03      |     18 | 6COSC021W
      421 | 6SE04      |     18 | 6COSC021W
      422 | 6SE05      |     18 | 6COSC021W
      423 | 6DSA1      |     18 | 6COSC021W
      424 | 6CS01      |     19 | 6COSC022W
      425 | 6CS02      |     19 | 6COSC022W
      426 | 6CS03      |     19 | 6COSC022W
      427 | 6CS04      |     19 | 6COSC022W
      428 | 6CS05      |     19 | 6COSC022W
      429 | 6CS06      |     19 | 6COSC022W
      430 | 6CS07      |     19 | 6COSC022W
      431 | 6CS08      |     19 | 6COSC022W
      432 | 6CS09      |     19 | 6COSC022W
      433 | 6CS10      |     19 | 6COSC022W
      434 | 6CS11      |     19 | 6COSC022W
      435 | 6CS12      |     19 | 6COSC022W
      436 | 6CS13      |     19 | 6COSC022W
      437 | 6CS14      |     19 | 6COSC022W
      438 | 6CS15      |     19 | 6COSC022W
      439 | 6CS16      |     19 | 6COSC022W
      440 | 6CS17      |     19 | 6COSC022W
      441 | 6SE01      |     19 | 6COSC022W
      442 | 6SE02      |     19 | 6COSC022W
      443 | 6SE03      |     19 | 6COSC022W
      444 | 6SE04      |     19 | 6COSC022W
      445 | 6SE05      |     19 | 6COSC022W
      446 | 6DSA1      |     19 | 6COSC022W
      447 | 6CS01      |     20 | 6DATA005W
      448 | 6CS02      |     20 | 6DATA005W
      449 | 6CS03      |     20 | 6DATA005W
      450 | 6CS04      |     20 | 6DATA005W
      451 | 6CS05      |     20 | 6DATA005W
      452 | 6CS06      |     20 | 6DATA005W
      453 | 6CS07      |     20 | 6DATA005W
      454 | 6CS08      |     20 | 6DATA005W
      455 | 6CS09      |     20 | 6DATA005W
      456 | 6CS10      |     20 | 6DATA005W
      457 | 6CS11      |     20 | 6DATA005W
      458 | 6CS12      |     20 | 6DATA005W
      459 | 6CS13      |     20 | 6DATA005W
      460 | 6CS14      |     20 | 6DATA005W
      461 | 6CS15      |     20 | 6DATA005W
      462 | 6CS16      |     20 | 6DATA005W
      463 | 6CS17      |     20 | 6DATA005W
      464 | 6SE01      |     20 | 6DATA005W
      465 | 6SE02      |     20 | 6DATA005W
      466 | 6SE03      |     20 | 6DATA005W
      467 | 6SE04      |     20 | 6DATA005W
      468 | 6SE05      |     20 | 6DATA005W
      469 | 6DSA1      |     20 | 6DATA005W
      522 | 4DSA1      |      2 | 4COSC002W
      545 | 4DSA1      |      3 | 4COSC003W
      568 | 4DSA1      |      4 | 4COSC004W
      591 | 4DSA1      |      5 | 4COSC005W
      614 | 4DSA1      |      6 | 4COSC011W
      615 | 5CS01      |      8 | 5COSC019W
      616 | 5CS02      |      8 | 5COSC019W
      617 | 5CS03      |      8 | 5COSC019W
      618 | 5CS04      |      8 | 5COSC019W
      619 | 5CS05      |      8 | 5COSC019W
      620 | 5CS06      |      8 | 5COSC019W
      621 | 5CS07      |      8 | 5COSC019W
      622 | 5CS08      |      8 | 5COSC019W
      623 | 5CS09      |      8 | 5COSC019W
      624 | 5CS10      |      8 | 5COSC019W
      625 | 5CS11      |      8 | 5COSC019W
      626 | 5CS12      |      8 | 5COSC019W
      627 | 5CS13      |      8 | 5COSC019W
      628 | 5CS14      |      8 | 5COSC019W
      629 | 5CS15      |      8 | 5COSC019W
      630 | 5CS16      |      8 | 5COSC019W
      631 | 5CS17      |      8 | 5COSC019W
      632 | 5SE01      |      8 | 5COSC019W
      633 | 5SE02      |      8 | 5COSC019W
      634 | 5SE03      |      8 | 5COSC019W
(466 rows)
INSERT INTO event (name, type, semester, week, day, start_time, end_time, size, roomID, mod_id, group_id, staff_id)
VALUES ('Software Development I - Lecture', 'Lecture', 1, 1, 'Monday', '09:00:00', '11:00:00', 540, 9999, 1, NULL, NULL);

-- 📝 Seminars (Each group has 20 students)
INSERT INTO event (name, type, semester, week, day, start_time, end_time, size, roomID, mod_id, group_id, staff_id)
VALUES
('Software Dev I - Seminar (4SE01)', 'Seminar', 1, 1, 'Tuesday', '09:00:00', '11:00:00', 20, 33, 1, 47, NULL),
('Software Dev I - Seminar (4SE02, 4SE03)', 'Seminar', 1, 1, 'Tuesday', '09:00:00', '11:00:00', 40, 46, 1, 48, NULL),
('Software Dev I - Seminar (4SE04)', 'Seminar', 1, 1, 'Tuesday', '09:00:00', '11:00:00', 20, 34, 1, 50, NULL),
('Software Dev I - Seminar (4SE05)', 'Seminar', 1, 1, 'Tuesday', '09:00:00', '11:00:00', 20, 36, 1, 51, NULL),
('Software Dev I - Seminar (4CS08)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 34, 1, 36, NULL),
('Software Dev I - Seminar (4CS06, 4CS07)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 40, 40, 1, 34, NULL),
('Software Dev I - Seminar (4CS09, 4CS10)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 40, 46, 1, 37, NULL),
('Software Dev I - Seminar (4SE07, 4SE06)', 'Seminar', 1, 1, 'Wednesday', '09:00:00', '11:00:00', 40, 46, 1, 53, NULL),
('Software Dev I - Seminar (4CS02)', 'Seminar', 1, 1, 'Friday', '09:00:00', '11:00:00', 20, 30, 1, 30, NULL),
('Software Dev I - Seminar (4CS03)', 'Seminar', 1, 1, 'Friday', '09:00:00', '11:00:00', 20, 26, 1, 31, NULL),
('Software Dev I - Seminar (4CS04, 4CS05)', 'Seminar', 1, 1, 'Friday', '09:00:00', '11:00:00', 40, 40, 1, 32, NULL),
('Software Dev I - Seminar (4CS01)', 'Seminar', 1, 1, 'Friday', '09:00:00', '11:00:00', 20, 35, 1, 29, NULL),
('Software Dev I - Seminar (4CS16)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 20, 35, 1, 44, NULL),
('Software Dev I - Seminar (4CS17)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 20, 25, 1, 45, NULL),
('Software Dev I - Seminar (4CS18)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 20, 27, 1, 46, NULL),
('Software Dev I - Seminar (4DSA01, 4DSA02)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 40, 47, 1, 54, NULL),
('Software Dev I - Seminar (4CS11)', 'Seminar', 1, 1, 'Friday', '16:00:00', '18:00:00', 20, 34, 1, 39, NULL),
('Software Dev I - Seminar (4CS14, 4CS15)', 'Seminar', 1, 1, 'Friday', '16:00:00', '18:00:00', 40, 31, 1, 42, NULL),
('Software Dev I - Seminar (4CS12, 4CS13)', 'Seminar', 1, 1, 'Friday', '16:00:00', '18:00:00', 40, 69, 1, 40, NULL);

SELECT * FROM event  --view events in day and time order for a specific module
WHERE mod_id = 2 
ORDER BY 
  CASE 
    WHEN day = 'Monday' THEN 1
    WHEN day = 'Tuesday' THEN 2
    WHEN day = 'Wednesday' THEN 3
    WHEN day = 'Thursday' THEN 4
    WHEN day = 'Friday' THEN 5
  END,
  start_time;


CREATE TABLE module_events ( --only used if multiple modules on one event
    module_id INT REFERENCES module(mod_id) ON DELETE CASCADE,
    event_id INT REFERENCES event(eventID) ON DELETE CASCADE,
    PRIMARY KEY (module_id, event_id)
);

SELECT * FROM event WHERE day = 'Tuesday' ORDER BY start_time; --view a specific day

SELECT e.*  -- view a specific group
FROM event e
JOIN group_table g ON e.group_id = g.group_id
WHERE g.group_name = '4CS08'
ORDER BY e.day, e.start_time;

INSERT INTO event (name, type, semester, week, day, start_time, end_time, size, roomID, mod_id, group_id, staff_id)
VALUES
-- Lectures
('Mathematics for Computing - Lecture 2', 'Lecture', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 300, 74, 2, NULL, NULL),
('Mathematics for Computing - Lecture 1', 'Lecture', 1, 1, 'Tuesday', '15:00:00', '17:00:00', 300, 74, 2, NULL, NULL),

-- Seminars
('Mathematics for Computing - Seminar (4CS05)', 'Seminar', 1, 1, 'Tuesday', '14:00:00', '16:00:00', 20, 49, 2, 33, NULL),
('Mathematics for Computing - Seminar (4CS01,4CS02)', 'Seminar', 1, 1, 'Tuesday', '14:00:00', '16:00:00', 40, 47, 2, 29, NULL),
('Mathematics for Computing - Seminar (4CS03,4CS04)', 'Seminar', 1, 1, 'Tuesday', '14:00:00', '16:00:00', 40, 46, 2, 31, NULL),

('Mathematics for Computing - Seminar (4CS17)', 'Seminar', 1, 1, 'Wednesday', '09:00:00', '11:00:00', 20, 34, 2, 45, NULL),
('Mathematics for Computing - Seminar (4CS18)', 'Seminar', 1, 1, 'Wednesday', '09:00:00', '11:00:00', 20, 35, 2, 46, NULL),
('Mathematics for Computing - Seminar (4CS16)', 'Seminar', 1, 1, 'Wednesday', '09:00:00', '11:00:00', 20, 23, 2, 44, NULL),

('Mathematics for Computing - Seminar (4SE06,4SE07)', 'Seminar', 1, 1, 'Wednesday', '11:00:00', '13:00:00', 40, 32, 2, 52, NULL),

('Mathematics for Computing - Seminar (4SE01,4SE02)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 40, 40, 2, 48, NULL),
('Mathematics for Computing - Seminar (4SE05)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 20, 36, 2, 51, NULL),
('Mathematics for Computing - Seminar (4SE03,4SE04)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 40, 47, 2, 49, NULL),

('Mathematics for Computing - Seminar (4CS11)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 20, 34, 2, 39, NULL),
('Mathematics for Computing - Seminar (4CS12)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 20, 35, 2, 40, NULL),
('Mathematics for Computing - Seminar (4CS13)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 20, 24, 2, 41, NULL),
('Mathematics for Computing - Seminar (4CS14)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 20, 25, 2, 42, NULL),
('Mathematics for Computing - Seminar (4CS15)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 20, 27, 2, 43, NULL),

('Mathematics for Computing - Seminar (4CS09)', 'Seminar', 1, 1, 'Friday', '16:00:00', '18:00:00', 20, 25, 2, 37, NULL),
('Mathematics for Computing - Seminar (4CS10)', 'Seminar', 1, 1, 'Friday', '16:00:00', '18:00:00', 20, 36, 2, 38, NULL),
('Mathematics for Computing - Seminar (4CS06)', 'Seminar', 1, 1, 'Friday', '16:00:00', '18:00:00', 20, 26, 2, 34, NULL),
('Mathematics for Computing - Seminar (4CS07)', 'Seminar', 1, 1, 'Friday', '16:00:00', '18:00:00', 20, 27, 2, 35, NULL),
('Mathematics for Computing - Seminar (4CS08)', 'Seminar', 1, 1, 'Friday', '16:00:00', '18:00:00', 20, 30, 2, 36, NULL);



INSERT INTO event (name, type, semester, week, day, start_time, end_time, size, roomID, mod_id, group_id, staff_id)
VALUES
-- Lectures
('Trends in Computer Science - Lecture 1', 'Lecture', 1, 1, 'Tuesday', '09:00:00', '11:00:00', 330, 74, 3, NULL, NULL),
('Trends in Computer Science - Lecture 2', 'Lecture', 1, 1, 'Tuesday', '13:00:00', '15:00:00', 330, 74, 3, NULL, NULL),

-- Seminars
('Trends in Computer Science - Seminar (4CS01,4CS02)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 40, 40, 3, 29, NULL),
('Trends in Computer Science - Seminar (4CS06)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 26, 3, 34, NULL),
('Trends in Computer Science - Seminar (4CS09,4CS10)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 40, 47, 3, 37, NULL),
('Trends in Computer Science - Seminar (4CS07)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 30, 3, 35, NULL),
('Trends in Computer Science - Seminar (4CS08)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 33, 3, 36, NULL),

('Trends in Computer Science - Seminar (4CS03,4CS04)', 'Seminar', 1, 1, 'Tuesday', '16:00:00', '18:00:00', 40, 69, 3, 31, NULL),
('Trends in Computer Science - Seminar (4CS05)', 'Seminar', 1, 1, 'Tuesday', '16:00:00', '18:00:00', 20, 27, 3, 33, NULL),

('Trends in Computer Science - Seminar (4CS16,4CS17)', 'Seminar', 1, 1, 'Wednesday', '09:00:00', '11:00:00', 40, 69, 3, 44, NULL),
('Trends in Computer Science - Seminar (4CS18)', 'Seminar', 1, 1, 'Wednesday', '09:00:00', '11:00:00', 20, 26, 3, 46, NULL),

('Trends in Computer Science - Seminar (4SE06,4SE07)', 'Seminar', 1, 1, 'Wednesday', '11:00:00', '13:00:00', 40, 40, 3, 52, NULL),

('Trends in Computer Science - Seminar (4SE03)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 20, 27, 3, 49, NULL),
('Trends in Computer Science - Seminar (4SE04,4SE05)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 40, 31, 3, 50, NULL),
('Trends in Computer Science - Seminar (4SE01,4SE02)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 40, 69, 3, 48, NULL),

('Trends in Computer Science - Seminar (4CS11,4CS12)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 40, 47, 3, 39, NULL),
('Trends in Computer Science - Seminar (4CS15)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 20, 30, 3, 43, NULL),
('Trends in Computer Science - Seminar (4CS13,4CS14)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 40, 32, 3, 41, NULL);

INSERT INTO event (name, type, semester, week, day, start_time, end_time, size, roomID, mod_id, group_id, staff_id)
VALUES
-- Lecture
('Computer System Fundamentals - Lecture', 'Lecture', 1, 1, 'Monday', '11:00:00', '13:00:00', 560, 9999, 4, NULL, NULL),

-- Seminars
('Computer System Fundamentals - Seminar (4SE06)', 'Seminar', 1, 1, 'Tuesday', '09:00:00', '11:00:00', 20, 25, 4, 52, NULL),
('Computer System Fundamentals - Seminar (4SE07)', 'Seminar', 1, 1, 'Tuesday', '09:00:00', '11:00:00', 20, 27, 4, 53, NULL),

('Computer System Fundamentals - Seminar (4CS13,4CS14)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 40, 37, 4, 41, NULL),
('Computer System Fundamentals - Seminar (4CS11,4CS12)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 40, 32, 4, 39, NULL),
('Computer System Fundamentals - Seminar (4CS15)', 'Seminar', 1, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 49, 4, 43, NULL),

('Computer System Fundamentals - Seminar (4CS16,4CS17)', 'Seminar', 1, 1, 'Wednesday', '11:00:00', '13:00:00', 40, 46, 4, 44, NULL),
('Computer System Fundamentals - Seminar (4CS18)', 'Seminar', 1, 1, 'Wednesday', '11:00:00', '13:00:00', 20, 33, 4, 46, NULL),

('Computer System Fundamentals - Seminar (4SE01,4SE02)', 'Seminar', 1, 1, 'Friday', '09:00:00', '11:00:00', 40, 69, 4, 48, NULL),
('Computer System Fundamentals - Seminar (4SE03)', 'Seminar', 1, 1, 'Friday', '09:00:00', '11:00:00', 20, 23, 4, 49, NULL),
('Computer System Fundamentals - Seminar (4SE04)', 'Seminar', 1, 1, 'Friday', '09:00:00', '11:00:00', 20, 24, 4, 50, NULL),
('Computer System Fundamentals - Seminar (4SE05)', 'Seminar', 1, 1, 'Friday', '09:00:00', '11:00:00', 20, 27, 4, 51, NULL),

('Computer System Fundamentals - Seminar (4CS02,4CS03)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 40, 31, 4, 30, NULL),
('Computer System Fundamentals - Seminar (4CS04,4CS05)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 40, 69, 4, 32, NULL),
('Computer System Fundamentals - Seminar (4CS01)', 'Seminar', 1, 1, 'Friday', '11:00:00', '13:00:00', 20, 24, 4, 29, NULL),

('Computer System Fundamentals - Seminar (4CS10,4CS09)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 40, 32, 4, 38, NULL),
('Computer System Fundamentals - Seminar (4CS08)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 20, 26, 4, 36, NULL),
('Computer System Fundamentals - Seminar (4CS06,4CS07)', 'Seminar', 1, 1, 'Friday', '14:00:00', '16:00:00', 40, 29, 4, 34, NULL);

--change 4cosc003w to sem 2, accidentally did sem1. can use this command template again if needed
UPDATE event
SET semester = 2
WHERE mod_id = 3;

INSERT INTO event (name, type, semester, week, day, start_time, end_time, size, roomID, mod_id, group_id, staff_id)
VALUES
-- Lecture
('Software Development II - Lecture', 'Lecture', 2, 1, 'Monday', '09:00:00', '11:00:00', 620, 9999, 5, NULL, NULL),

-- Seminars
('Software Development II - Seminar (4SE01,4SE02)', 'Seminar', 2, 1, 'Tuesday', '16:00:00', '18:00:00', 40, 32, 5, 47, NULL),
('Software Development II - Seminar (4SE03)', 'Seminar', 2, 1, 'Tuesday', '16:00:00', '18:00:00', 20, 43, 5, 48, NULL),
('Software Development II - Seminar (4SE05)', 'Seminar', 2, 1, 'Tuesday', '16:00:00', '18:00:00', 20, 30, 5, 51, NULL),
('Software Development II - Seminar (4SE04)', 'Seminar', 2, 1, 'Tuesday', '16:00:00', '18:00:00', 20, 24, 5, 50, NULL),

('Software Development II - Seminar (4SE06)', 'Seminar', 2, 1, 'Wednesday', '09:00:00', '11:00:00', 20, 23, 5, 52, NULL),
('Software Development II - Seminar (4SE07)', 'Seminar', 2, 1, 'Wednesday', '09:00:00', '11:00:00', 20, 33, 5, 53, NULL),

('Software Development II - Seminar (4CS02,4CS03)', 'Seminar', 2, 1, 'Friday', '09:00:00', '11:00:00', 40, 32, 5, 30, NULL),
('Software Development II - Seminar (4CS05)', 'Seminar', 2, 1, 'Friday', '09:00:00', '11:00:00', 20, 24, 5, 33, NULL),
('Software Development II - Seminar (4CS01)', 'Seminar', 2, 1, 'Friday', '09:00:00', '11:00:00', 20, 23, 5, 29, NULL),
('Software Development II - Seminar (4CS04)', 'Seminar', 2, 1, 'Friday', '09:00:00', '11:00:00', 20, 26, 5, 32, NULL),

('Software Development II - Seminar (4CS16)', 'Seminar', 2, 1, 'Friday', '11:00:00', '13:00:00', 20, 26, 5, 44, NULL),
('Software Development II - Seminar (4CS17)', 'Seminar', 2, 1, 'Friday', '11:00:00', '13:00:00', 20, 24, 5, 45, NULL),
('Software Development II - Seminar (4CS18)', 'Seminar', 2, 1, 'Friday', '11:00:00', '13:00:00', 20, 23, 5, 46, NULL),

('Software Development II - Seminar (4CS08,4CS09)', 'Seminar', 2, 1, 'Friday', '14:00:00', '16:00:00', 40, 29, 5, 36, NULL),
('Software Development II - Seminar (4CS10)', 'Seminar', 2, 1, 'Friday', '14:00:00', '16:00:00', 20, 23, 5, 38, NULL),
('Software Development II - Seminar (4DSA01,4DSA02)', 'Seminar', 2, 1, 'Friday', '14:00:00', '16:00:00', 40, 46, 5, 54, NULL),
('Software Development II - Seminar (4CS06,4CS07)', 'Seminar', 2, 1, 'Friday', '14:00:00', '16:00:00', 40, 32, 5, 34, NULL),

('Software Development II - Seminar (4CS11,4CS12)', 'Seminar', 2, 1, 'Friday', '16:00:00', '18:00:00', 40, 29, 5, 39, NULL),
('Software Development II - Seminar (4CS13,4CS14)', 'Seminar', 2, 1, 'Friday', '16:00:00', '18:00:00', 40, 32, 5, 41, NULL),
('Software Development II - Seminar (4CS15)', 'Seminar', 2, 1, 'Friday', '16:00:00', '18:00:00', 20, 23, 5, 43, NULL);


INSERT INTO event (name, type, semester, week, day, start_time, end_time, size, roomID, mod_id, group_id, staff_id)
VALUES
-- Lecture
('Web Design and Development - Lecture', 'Lecture', 2, 1, 'Monday', '11:00:00', '13:00:00', 620, 9999, 6, NULL, NULL),

-- Seminars
('Web Design and Development - Seminar (4SE07,4SE06)', 'Seminar', 2, 1, 'Tuesday', '09:00:00', '11:00:00', 40, 47, 6, 53, NULL),
('Web Design and Development - Seminar (4CS11)', 'Seminar', 2, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 35, 6, 39, NULL),
('Web Design and Development - Seminar (4CS12)', 'Seminar', 2, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 34, 6, 40, NULL),
('Web Design and Development - Seminar (4CS15)', 'Seminar', 2, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 27, 6, 43, NULL),
('Web Design and Development - Seminar (4CS13)', 'Seminar', 2, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 36, 6, 41, NULL),
('Web Design and Development - Seminar (4CS14)', 'Seminar', 2, 1, 'Tuesday', '11:00:00', '13:00:00', 20, 24, 6, 42, NULL),

('Web Design and Development - Seminar (4CS16)', 'Seminar', 2, 1, 'Wednesday', '11:00:00', '13:00:00', 20, 35, 6, 44, NULL),
('Web Design and Development - Seminar (4CS17,4CS18)', 'Seminar', 2, 1, 'Wednesday', '11:00:00', '13:00:00', 40, 32, 6, 45, NULL),

('Web Design and Development - Seminar (4SE01)', 'Seminar', 2, 1, 'Friday', '09:00:00', '11:00:00', 20, 36, 6, 47, NULL),
('Web Design and Development - Seminar (4SE02)', 'Seminar', 2, 1, 'Friday', '09:00:00', '11:00:00', 20, 35, 6, 48, NULL),
('Web Design and Development - Seminar (4SE03)', 'Seminar', 2, 1, 'Friday', '09:00:00', '11:00:00', 20, 34, 6, 49, NULL),
('Web Design and Development - Seminar (4SE04)', 'Seminar', 2, 1, 'Friday', '09:00:00', '11:00:00', 20, 33, 6, 50, NULL),
('Web Design and Development - Seminar (4SE05)', 'Seminar', 2, 1, 'Friday', '09:00:00', '11:00:00', 20, 25, 6, 51, NULL),

('Web Design and Development - Seminar (4CS01)', 'Seminar', 2, 1, 'Friday', '11:00:00', '13:00:00', 20, 34, 6, 29, NULL),
('Web Design and Development - Seminar (4CS02)', 'Seminar', 2, 1, 'Friday', '11:00:00', '13:00:00', 20, 35, 6, 30, NULL),
('Web Design and Development - Seminar (4CS03,4CS04)', 'Seminar', 2, 1, 'Friday', '11:00:00', '13:00:00', 40, 29, 6, 31, NULL),
('Web Design and Development - Seminar (4CS05)', 'Seminar', 2, 1, 'Friday', '11:00:00', '13:00:00', 20, 36, 6, 33, NULL),

('Web Design and Development - Seminar (4CS08)', 'Seminar', 2, 1, 'Friday', '16:00:00', '18:00:00', 20, 34, 6, 36, NULL),
('Web Design and Development - Seminar (4CS06,4CS07)', 'Seminar', 2, 1, 'Friday', '16:00:00', '18:00:00', 40, 31, 6, 34, NULL),
('Web Design and Development - Seminar (4CS10)', 'Seminar', 2, 1, 'Friday', '16:00:00', '18:00:00', 20, 36, 6, 38, NULL),
('Web Design and Development - Seminar (4CS09)', 'Seminar', 2, 1, 'Friday', '16:00:00', '18:00:00', 20, 35, 6, 37, NULL);


--need group id column for user_modules table so we can assign a student to a group
ALTER TABLE user_modules ADD COLUMN group_id INT REFERENCES group_table(group_id) ON DELETE SET NULL;

--check to see if student has been assigned a group
SELECT um.user_id, um.mod_id, um.group_id, g.group_name
FROM user_modules um
LEFT JOIN group_table g ON um.group_id = g.group_id
WHERE um.user_id = 6;



--debugging
SELECT um.user_id, um.mod_id, um.group_id, g.group_name, e.eventID, e.name, e.day, e.start_time, e.end_time 
FROM user_modules um
JOIN group_table g ON um.group_id = g.group_id
JOIN event e ON g.group_id = e.group_id
WHERE um.user_id = 6
ORDER BY e.day, e.start_time;


--steps on db to test seminar swaps
--check students current group
SELECT user_id, mod_id, group_id 
FROM user_modules 
WHERE user_id = 6;  -- Replace 6 with the actual student ID

--show available seminar groups
SELECT g.group_id, g.group_name, e.day, e.start_time, e.end_time, r.room_name,
       (SELECT COUNT(*) FROM user_modules WHERE group_id = g.group_id) AS current_students
FROM group_table g
JOIN event e ON g.group_id = e.group_id
JOIN room r ON e.roomID = r.roomID
WHERE e.mod_id = 4;  -- Replace 4 with the actual module ID

--perform swap on acatempo

--verify swap has happened
SELECT user_id, mod_id, group_id 
FROM user_modules 
WHERE user_id = 6;  -- Replace 6 with the actual student ID



ALTER TABLE module
ADD COLUMN status VARCHAR(10);  -- Could be 'core' or 'optional'

-- Semester 1
UPDATE module SET status = 'core' WHERE mod_cod = '4COSC001W';
UPDATE module SET status = 'core' WHERE mod_cod = '4COSC002W';
UPDATE module SET status = 'core' WHERE mod_cod = '4COSC004W';

-- Semester 2
UPDATE module SET status = 'core' WHERE mod_cod = '4COSC005W';
UPDATE module SET status = 'core' WHERE mod_cod = '4COSC003W';
UPDATE module SET status = 'core' WHERE mod_cod = '4COSC011W';

ALTER TABLE module
ADD COLUMN level INTEGER;

UPDATE module
SET level = 4;

ALTER TABLE module
ADD CONSTRAINT level_check CHECK (level IN (3, 4, 5, 6, 7));

ALTER TABLE module
ADD CONSTRAINT status_check CHECK (status IN ('core', 'optional'));

--for weekly swaps
CREATE TABLE student_event_swap (
    swap_id SERIAL PRIMARY KEY,
    student_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    swap_type VARCHAR(10) CHECK (swap_type IN ('week', 'semester')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES students(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES event(eventid) ON DELETE CASCADE
);



SELECT e2.eventid, e2.day, e2.start_time, e2.end_time, m.mod_cod
FROM event e1
JOIN event e2 ON 
  e1.day = e2.day
  AND e1.week = e2.week
  AND e1.start_time < e2.end_time
  AND e2.start_time < e1.end_time
JOIN user_modules um ON um.mod_id = e2.mod_id
JOIN module m ON m.mod_id = e2.mod_id
WHERE 
  e1.group_id = $1 
  AND um.user_id = $2
  AND e2.mod_id != $3


  SELECT * FROM student_event_swap
WHERE student_id = 9
  AND mod_id = 8 
  AND week = 3;

  SELECT *
FROM event
WHERE group_id = 615
  AND mod_id = 8
  AND week = 3;

  INSERT INTO event (
  name,
  type,
  semester,
  week,
  day,
  start_time,
  end_time,
  size,
  roomID,
  mod_id,
  group_id
)
VALUES (
  'Object Oriented Programming - 5CS01 (Week 3)', -- name
  'Seminar',                                      -- type
  1,                                              -- semester
  3,                                              -- week
  'Monday',                                       -- day
  '09:00:00',                                     -- start_time
  '11:00:00',                                     -- end_time
  20,                                             -- size
  70,                                             -- roomID (same as other weeks, update if needed)
  8,                                              -- mod_id for 5COSC019W
  615                                             -- group_id for 5CS01
);



