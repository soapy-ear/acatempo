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
WHERE mod_id = 1 
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


