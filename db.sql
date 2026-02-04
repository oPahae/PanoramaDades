DROP DATABASE IF EXISTS panoramadb;
CREATE DATABASE panoramadb;
USE panoramadb;

-- TABLES --

CREATE TABLE Rooms (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status ENUM('available', 'maintenance') DEFAULT 'available',
    title VARCHAR(255),
    image VARCHAR(255) DEFAULT NULL,
    number INT,
    priceMAD INT,
    priceUSD INT,
    priceCHF INT,
    beds INT,
    guests INT,
    category VARCHAR(100),
    view VARCHAR(100),
    description TEXT,
    space INT,
    wifi BOOLEAN DEFAULT TRUE,
    safe BOOLEAN DEFAULT TRUE,
    rainShower BOOLEAN DEFAULT TRUE,
    airConditioning BOOLEAN DEFAULT TRUE,
    heater BOOLEAN DEFAULT TRUE,
    hairDryer BOOLEAN DEFAULT TRUE
);

CREATE TABLE Images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(255),
    roomID INT,
    CONSTRAINT fk_images_room FOREIGN KEY (roomID) REFERENCES Rooms(id) ON DELETE CASCADE
);

CREATE TABLE Faqs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    question TEXT,
    response TEXT
);

CREATE TABLE Blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image VARCHAR(255),
    title VARCHAR(255),
    quote VARCHAR(255),
    category VARCHAR(255),
    datePosted DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Paragraphes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255),
    content TEXT,
    blogID INT,
    CONSTRAINT fk_parags_blog FOREIGN KEY (blogID) REFERENCES Blogs(id) ON DELETE CASCADE
);

CREATE TABLE Customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(150),
    address TEXT,
    country VARCHAR(50),
    cin VARCHAR(50),
    passport VARCHAR(50),
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customerID INT,
    roomID INT,
    checkIn DATE NOT NULL,
    checkOut DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    discount DECIMAL(5,2) DEFAULT 0,
    tva DECIMAL(5,2) DEFAULT 0,
    status ENUM('confirmed', 'canceled', 'paid', 'finished') DEFAULT 'confirmed',
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerID) REFERENCES Customers(id) ON DELETE SET NULL,
    FOREIGN KEY (roomID) REFERENCES Rooms(id) ON DELETE SET NULL
);

CREATE TABLE Factures (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservationID INT NOT NULL UNIQUE,
    code VARCHAR(50) NOT NULL UNIQUE,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'paid', 'canceled') DEFAULT 'pending',
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (reservationID) REFERENCES reservations(id) ON DELETE CASCADE
);

CREATE TABLE Paiements (
    id INT AUTO_INCREMENT PRIMARY KEY,
    factureID INT NOT NULL,
    mode ENUM('cash', 'card', 'bank') NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    note TEXT,
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (factureID) REFERENCES Factures(id)
);

CREATE TABLE Contacts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(150),
    subject VARCHAR(255),
    message TEXT
);

CREATE TABLE Agents (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(150),
    password VARCHAR(255),
    dateCreation TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
);

CREATE TABLE Root (
    password VARCHAR(255)
);

-- INSERT ROOM 1 --

INSERT INTO Rooms (title, number, priceUSD, priceCHF, beds, guests, category, view, description, space)
VALUES ('Standard Room', 1, 399, 299, 2, 4, 'Classic Collection', 'Valley & Mountain View', 'test', 45);

UPDATE Rooms SET image = CONCAT('/rooms/', LAST_INSERT_ID(), '/main.jpg')
WHERE id = LAST_INSERT_ID();

INSERT INTO Images (url, roomID) VALUES
(CONCAT('/rooms/', LAST_INSERT_ID(), '/1.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/2.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/3.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/4.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/5.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/6.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/7.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/8.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/9.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/10.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/11.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/12.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/13.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/14.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/15.webp'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/16.webp'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/17.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/18.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/19.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/20.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/21.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/22.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/23.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/24.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/25.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/26.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/27.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/28.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/29.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/30.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/31.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/32.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/33.jpeg'), LAST_INSERT_ID());

-- INSERT ROOM 1 --

INSERT INTO Rooms (title, number, priceUSD, priceCHF, beds, guests, category, view, description, space)
VALUES ('Family Special Room', 2, 399, 299, 2, 4, 'Confort Collection', 'Swiming Pool View', 'test', 25);

UPDATE Rooms SET image = CONCAT('/rooms/', LAST_INSERT_ID(), '/main.jpg')
WHERE id = LAST_INSERT_ID();

INSERT INTO Images (url, roomID) VALUES
(CONCAT('/rooms/', LAST_INSERT_ID(), '/1.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/2.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/3.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/4.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/5.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/6.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/7.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/8.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/9.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/10.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/11.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/12.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/13.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/14.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/15.jpg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/16.webp'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/17.webp'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/18.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/19.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/20.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/21.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/22.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/23.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/24.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/25.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/26.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/27.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/28.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/29.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/30.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/31.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/32.jpeg'), LAST_INSERT_ID()),
(CONCAT('/rooms/', LAST_INSERT_ID(), '/33.jpeg'), LAST_INSERT_ID());

-- INSERT BLOG --

INSERT INTO Blogs (title, category, quote)
VALUES (
    'From Serene Landscapes to Thrilling Excursions: Experiencing the Magic of Dades Valley at Panorama Dades Hotel',
    'Travel Guide', 'In the Dades Valley, every stone tells a story, every breeze carries a whisper of ancient times, and every moment invites you to become part of its eternal narrative.'
);

UPDATE Blogs SET image = CONCAT('/blogs/', LAST_INSERT_ID(), '.jpg')
WHERE id = LAST_INSERT_ID();

INSERT INTO Paragraphes (title, content, blogID)
VALUES (
    'From Serene Landscapes to Thrilling Excursions',
    'Nestled amidst the awe-inspiring beauty of the Dades Valley, Panorama Dades Hotel invites you to the Magic of Dades Valley at Panorama Dades Hotel.',
    LAST_INSERT_ID()
),
(
    'From Serene Landscapes to Thrilling Excursions',
    'Nestled amidst the awe-inspiring beauty of the Dades Valley, Panorama Dades Hotel invites you to the Magic of Dades Valley at Panorama Dades Hotel.',
    LAST_INSERT_ID()
),
(
    'From Serene Landscapes to Thrilling Excursions',
    'Nestled amidst the awe-inspiring beauty of the Dades Valley, Panorama Dades Hotel invites you to the Magic of Dades Valley at Panorama Dades Hotel.',
    LAST_INSERT_ID()
);

-- INSERT FAQS --

INSERT INTO Faqs (question, response) VALUES
('What is the Panorama Dades Hotel?', 'Panorama Dades Hotel is a luxury hotel located in the Dades Valley, offering scenic views and top-notch amenities.'),
('How do I make a reservation?', 'You can make a reservation through our website or by calling our reception directly.'),
('What are the check-in and check-out times?', 'Check-in is from 2 PM and check-out is until 12 PM.'),
('Is breakfast included?', 'Yes, breakfast is included in most of our room packages.'),
('Do you offer free Wi-Fi?', 'Yes, complimentary Wi-Fi is available throughout the hotel.'),
('Are pets allowed?', 'Pets are not allowed in the hotel premises.'),
('Is parking available?', 'Yes, free private parking is available for all guests.'),
('Do you have a swimming pool?', 'Yes, our hotel has an outdoor swimming pool accessible to all guests.'),
('Can I organize events or meetings?', 'Yes, we have event spaces suitable for meetings, weddings, and other gatherings.'),
('What are the nearby attractions?', 'You can explore the Dades Valley, local markets, and hiking trails nearby.'),
('Do you provide airport shuttle service?', 'Yes, airport shuttle services are available upon request with an additional charge.'),
('Are rooms air-conditioned?', 'Yes, all rooms are equipped with air-conditioning for your comfort.'),
('Do you have a restaurant?', 'Yes, our restaurant serves a variety of Moroccan and international dishes.'),
('Can I request an early check-in or late check-out?', 'Early check-in and late check-out are subject to availability and may incur additional charges.'),
('Is there a gym or fitness center?', 'Yes, our hotel features a fully equipped gym for guests.'),
('How do I cancel my reservation?', 'You can cancel your reservation through our website or by contacting the reception, following our cancellation policy.');

-- INSERT CUSTOMERS --

INSERT INTO Customers (type, name, phone, email, address, country, cin, passport) VALUES
('person','Ahmed El Amrani','0612345678','ahmed.amrani@gmail.com','Rue Hassan II, Rabat','Morocco','AA123456','PMA12345'),
('person','Sara Benali','0623456789','sara.benali@gmail.com','Gueliz, Marrakech','Morocco','BB234567','PMB23456'),
('agence','Atlas Travel','0522123456','contact@atlastravel.ma','Bd Zerktouni, Casablanca','Morocco',NULL,NULL),
('person','Youssef Chraibi','0634567890','y.chraibi@gmail.com','Hay Riad, Rabat','Morocco','CC345678','PMC34567'),
('agence','Sahara Tours','0536789012','info@saharatours.ma','Centre Ville, Ouarzazate','Morocco',NULL,NULL),
('person','Khadija Lahlou','0645678901','khadija.l@gmail.com','Agdal, Rabat','Morocco','DD456789','PMD45678'),
('person','Omar Berrada','0656789012','omar.berrada@gmail.com','Maarif, Casablanca','Morocco','EE567890','PME56789'),
('agence','Desert Explorer','0523987654','booking@desertexplorer.com','Tinghir','Morocco',NULL,NULL),
('person','Imane Ziani','0667890123','imane.z@gmail.com','Sidi Ghanem, Marrakech','Morocco','FF678901','PMF67890'),
('person','Hamza Raji','0678901234','hamza.raji@gmail.com','Centre, Fes','Morocco','GG789012','PMG78901'),

('agence','Morocco Trips','0535123456','hello@moroccotrips.ma','Medina, Fes','Morocco',NULL,NULL),
('person','Nadia Kabbaj','0611122233','nadia.k@gmail.com','Palmier, Casablanca','Morocco','HH890123','PMH89012'),
('person','Anas El Idrissi','0622233344','anas.ei@gmail.com','Safi','Morocco','II901234','PMI90123'),
('agence','Royal Travel','0522445566','sales@royaltravel.ma','Rabat','Morocco',NULL,NULL),
('person','Salma Oukili','0633344455','salma.o@gmail.com','Temara','Morocco','JJ012345','PMJ01234'),
('person','Ayoub Skalli','0644455566','ayoub.s@gmail.com','Tanger','Morocco','KK123457','PMK12346'),
('agence','Blue City Tours','0539332211','contact@bluecitytours.ma','Chefchaouen','Morocco',NULL,NULL),
('person','Hajar Naciri','0655566677','hajar.n@gmail.com','Meknes','Morocco','LL234568','PML23457'),
('person','Rachid Louzi','0666677788','rachid.l@gmail.com','Kenitra','Morocco','MM345679','PMM34568'),
('agence','Dades Panorama Agency','0528998877','agency@panoramadades.com','Boumalne Dades','Morocco',NULL,NULL),

('person','Soufiane Tazi','0677788899','soufiane.t@gmail.com','Oujda','Morocco','NN456780','PMN45679'),
('person','Meryem Alaoui','0619988776','meryem.a@gmail.com','Essaouira','Morocco','OO567891','PMO56780'),
('agence','Nomad Adventures','0534556677','info@nomadadventures.ma','Zagora','Morocco',NULL,NULL),
('person','Bilal Fassi','0628877665','bilal.f@gmail.com','Fes','Morocco','PP678902','PMP67891'),
('person','Asmaa El Ghazali','0637766554','asmaa.eg@gmail.com','Ifrane','Morocco','QQ789013','PMQ78902'),
('agence','Golden Dunes Travel','0526677889','contact@goldendunes.ma','Merzouga','Morocco',NULL,NULL),
('person','Mehdi Rahmani','0646655443','mehdi.r@gmail.com','Laayoune','Morocco','RR890124','PMR89013'),
('person','Chaimae Saidi','0655544332','chaimae.s@gmail.com','Tetouan','Morocco','SS901235','PMS90124'),
('agence','Urban Travel','0521122334','urban@travel.ma','Casablanca','Morocco',NULL,NULL),
('person','Ismail Boussaid','0664433221','ismail.b@gmail.com','Azrou','Morocco','TT012346','PMT01235'),

('person','Zineb Amine','0673322110','zineb.a@gmail.com','El Jadida','Morocco','UU123458','PMU12347'),
('agence','Atlas Gateway','0538776655','atlas@gateway.ma','Midelt','Morocco',NULL,NULL),
('person','Adil Hamdi','0612233445','adil.h@gmail.com','Khemisset','Morocco','VV234569','PMV23458'),
('person','Lina Mouline','0623344556','lina.m@gmail.com','Mohammedia','Morocco','WW345670','PMW34569'),
('agence','Infinity Travels','0523344556','contact@infinitytravels.ma','Casablanca','Morocco',NULL,NULL),
('person','Reda Ouazzani','0634455667','reda.o@gmail.com','Settat','Morocco','XX456781','PMX45670'),
('person','Nour El Fadili','0645566778','nour.f@gmail.com','Nador','Morocco','YY567892','PMY56781'),
('agence','Prestige Voyages','0532667788','prestige@voyages.ma','Rabat','Morocco',NULL,NULL);

-- INSER ROOT --

INSERT INTO Root VALUES ('uFgW9loKIuJde35Z');