-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: db:3306
-- Generation Time: Jul 10, 2023 at 04:29 PM
-- Server version: 8.0.32
-- PHP Version: 8.1.15

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `proj_db`
--
CREATE DATABASE IF NOT EXISTS `proj_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `proj_db`;

-- --------------------------------------------------------

--
-- Table structure for table `Belongs_to`
--

CREATE TABLE `Belongs_to` (
  `uid` int NOT NULL,
  `gid` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Community`
--

CREATE TABLE `Community` (
  `name` varchar(20) NOT NULL,
  `description` tinytext NOT NULL,
  `owner` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Community`
--

INSERT INTO `Community` (`name`, `description`, `owner`) VALUES
('Bookworms', 'Calling all book lovers! Join this community to discuss your favorite books, recommend new reads, and engage in literary discussions.\r\n\r\n', 1),
('Creativity', 'Join this community to showcase your artistic skills and engage with fellow creatives. Share your artwork, photography, writing, and design projects. Receive feedback, collaborate on creative ventures, and explore different artistic styles.\r\n\r\n', 2),
('Finances', 'This community provides a platform to discuss financial strategies, share investment tips, and seek guidance on money management.\r\n\r\n', 1),
('Foodies', 'If you have a passion for food, this community is a must-join. Share your favorite recipes, culinary adventures, restaurant recommendations, and cooking hacks.\r\n\r\n', 1),
('Sustainability', 'Join this community to learn and exchange ideas about sustainable living practices. Explore eco-friendly initiatives, discuss renewable energy, share tips on reducing waste, and engage in conversations about preserving the planet.\r\n\r\n', 1),
('Tech', 'A community for technology enthusiasts to discuss the latest gadgets, software, coding, and emerging tech trends. Share your knowledge, ask questions, and engage in insightful conversations about all things tech-related.', 1),
('Travel', 'If you\'re passionate about traveling and discovering new destinations, this community is for you. Share your travel experiences, recommend hidden gems, discuss budget travel tips, and seek advice from fellow globetrotters.\r\n\r\n', 1),
('Wellness', 'This community is dedicated to promoting a healthy lifestyle and discussing various aspects of well-being. Share fitness tips, nutrition advice, mental health strategies, and personal experiences related to wellness.', 2);

-- --------------------------------------------------------

--
-- Table structure for table `Follows`
--

CREATE TABLE `Follows` (
  `follower` int NOT NULL,
  `followed_user` int DEFAULT NULL,
  `followed_community` varchar(20) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `u_c_flag` enum('USER','COMMUNITY') NOT NULL
) ;

--
-- Dumping data for table `Follows`
--

INSERT INTO `Follows` (`follower`, `followed_user`, `followed_community`, `u_c_flag`) VALUES
(2, 1, NULL, 'USER'),
(2, 3, NULL, 'USER'),
(1, 3, NULL, 'USER'),
(3, 1, NULL, 'USER'),
(3, NULL, 'Wellness', 'COMMUNITY'),
(3, NULL, 'Foodies', 'COMMUNITY'),
(3, NULL, 'Tech', 'COMMUNITY');

-- --------------------------------------------------------

--
-- Table structure for table `Group`
--

CREATE TABLE `Group` (
  `gid` int NOT NULL,
  `group_name` varchar(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Message`
--

CREATE TABLE `Message` (
  `msgid` int NOT NULL,
  `text_content` text NOT NULL,
  `send_date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Post`
--

CREATE TABLE `Post` (
  `pid` int NOT NULL,
  `title` varchar(75) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `publisher` int NOT NULL,
  `post_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image_content` blob,
  `text_content` text NOT NULL,
  `belongs_in` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Post`
--

INSERT INTO `Post` (`pid`, `title`, `publisher`, `post_date`, `image_content`, `text_content`, `belongs_in`) VALUES
(1, 'Deliciously Decadent Chocolate Cake Recipe', 1, '2023-07-10 00:29:40', NULL, 'Hey Foodie community! 🍽️\r\n\r\nI wanted to share with you an amazing chocolate cake recipe that will satisfy even the most discerning sweet tooth. This cake is a true indulgence, and it\'s perfect for special occasions or simply treating yourself to a slice of heaven.\r\n\r\nIngredients:\r\n\r\n2 cups all-purpose flour\r\n2 cups granulated sugar\r\n3/4 cup unsweetened cocoa powder\r\n1 1/2 teaspoons baking powder\r\n1 1/2 teaspoons baking soda\r\n1 teaspoon salt\r\n2 large eggs\r\n1 cup milk\r\n1/2 cup vegetable oil\r\n2 teaspoons vanilla extract\r\n1 cup boiling water\r\nInstructions:\r\n\r\nPreheat your oven to 350°F (175°C) and prepare two 9-inch round cake pans by greasing them and lining the bottoms with parchment paper.\r\n\r\nIn a large mixing bowl, combine the flour, sugar, cocoa powder, baking powder, baking soda, and salt. Mix them together until well combined.\r\n\r\nAdd the eggs, milk, vegetable oil, and vanilla extract to the dry ingredients. Beat the mixture on medium speed for about two minutes, until the batter is smooth and well blended.\r\n\r\nGradually add the boiling water to the batter, mixing on low speed. The batter will be thin, but that\'s perfectly normal.\r\n\r\nPour the batter evenly into the prepared cake pans. Place them in the preheated oven and bake for approximately 30 to 35 minutes, or until a toothpick inserted into the center of the cakes comes out clean.\r\n\r\nOnce the cakes are done, remove them from the oven and let them cool in the pans for about 10 minutes. Then, transfer them to a wire rack to cool completely.\r\n\r\nNow comes the fun part—decorating the cake! You can frost it with your favorite chocolate ganache, buttercream, or cream cheese frosting. Add some chocolate shavings or fresh berries for an extra touch of elegance.\r\n\r\nSlice yourself a generous piece and savor every bite of this moist and decadent chocolate cake. Don\'t forget to snap a picture to share with us!\r\n\r\nI hope you enjoy making and devouring this delicious chocolate cake as much as I do. Share your experiences, variations, or any other mouthwatering dessert recipes in the comments below. Happy baking, fellow foodies!\r\n\r\nBon appétit! 🍰🍫', 'Foodies'),
(2, 'Exploring the Exciting Features of the Latest Smartphone', 1, '2023-07-10 00:31:59', NULL, 'Hey there, Tech Hub community! 📱\r\n\r\nI recently got my hands on the latest smartphone, and I can\'t contain my excitement about its incredible features. Today, I want to share my experience and give you a glimpse into what this device has to offer.\r\n\r\nDesign:\r\nThe smartphone boasts a sleek and premium design with a bezel-less display and a stunning glass back. Its slim profile and ergonomic feel make it comfortable to hold, while the vibrant colors add a touch of style.\r\n\r\nDisplay and Performance:\r\nThe device sports a large, high-resolution display that delivers vivid colors and sharp visuals. Whether you\'re streaming videos, playing games, or browsing the web, the screen offers an immersive experience. The smooth performance is powered by a cutting-edge processor and ample RAM, ensuring seamless multitasking and speedy app launches.\r\n\r\nCamera Capabilities:\r\nPhotography enthusiasts will be delighted by the smartphone\'s advanced camera system. With a high-resolution primary lens, ultra-wide-angle lens, and telephoto lens, it captures stunning photos with remarkable clarity and detail. The low-light performance is exceptional, thanks to advanced image processing algorithms and night mode capabilities.\r\n\r\nBattery Life and Charging:\r\nWorried about battery life? This smartphone has you covered. Its robust battery ensures all-day usage, even with heavy tasks. Additionally, it supports fast charging, allowing you to quickly top up the battery when you\'re running low on power.\r\n\r\nSoftware and Features:\r\nThe device runs on the latest operating system, providing a seamless and intuitive user experience. The interface is clean, and navigating through apps and settings is a breeze. It also offers a range of smart features, such as facial recognition, fingerprint scanning, and voice assistants, enhancing convenience and security.\r\n\r\nConnectivity and Future-Proofing:\r\nWith support for the latest connectivity standards, including 5G, this smartphone offers blazing-fast internet speeds and improved network coverage. It\'s future-proofed to handle emerging technologies and ensures a smooth transition into the next generation of mobile connectivity.\r\n\r\nOverall, I\'m thoroughly impressed with this smartphone\'s performance, camera capabilities, and sleek design. It\'s a true powerhouse that caters to both productivity and entertainment needs. If you\'re in the market for a new smartphone, I highly recommend considering this one.\r\n\r\nHave you had any experiences with the latest smartphones? Share your thoughts, recommendations, or any other exciting tech updates in the comments below. Let\'s dive into the fascinating world of mobile technology together!\r\n\r\nStay connected! 🌐', 'Tech'),
(3, 'Must-Read Fantasy Novels That Will Transport You to Enchanting Realms', 3, '2023-07-10 00:33:24', NULL, 'Greetings, fellow bookworms! 📚✨\r\n\r\nIf you\'re seeking captivating adventures and fantastical worlds, I have a treat for you today. I wanted to share a list of must-read fantasy novels that will transport you to enchanting realms filled with magic, mythical creatures, and epic quests. Prepare to lose yourself in these extraordinary literary treasures:\r\n\r\n\"The Name of the Wind\" by Patrick Rothfuss:\r\nImmerse yourself in the lyrical prose of this epic tale that follows the life of a gifted musician and mage, as he recounts his journey from humble beginnings to becoming a legend. Rothfuss weaves a spellbinding narrative that will leave you yearning for more.\r\n\r\n\"A Game of Thrones\" by George R.R. Martin:\r\nEnter the intricate and treacherous world of Westeros, where noble families vie for power and honor, and dark forces gather beyond the Wall. Martin\'s richly detailed storytelling, complex characters, and political intrigue make this a must-read for any fantasy enthusiast.\r\n\r\n\"Mistborn: The Final Empire\" by Brandon Sanderson:\r\nPrepare to be swept away by Sanderson\'s masterful world-building and innovative magic system. Follow a band of thieves as they challenge a tyrannical ruler and attempt to overthrow the oppressive regime in a world where ash falls from the sky and mist holds secrets.\r\n\r\n\"The Hobbit\" by J.R.R. Tolkien:\r\nEmbark on a grand adventure with Bilbo Baggins, a hobbit who finds himself thrust into a quest to reclaim a treasure guarded by a fearsome dragon. Tolkien\'s charming storytelling and vivid descriptions will transport you to Middle-earth and leave you yearning for more tales from this enchanting world.\r\n\r\n\"Uprooted\" by Naomi Novik:\r\nLose yourself in a dark and magical tale inspired by Eastern European folklore. Novik spins a captivating story of a young woman chosen to serve a powerful sorcerer, her journey to discover her own hidden powers, and the battle against an ancient and malevolent force.\r\n\r\n\"The Lies of Locke Lamora\" by Scott Lynch:\r\nSet in the elaborate city of Camorr, this novel introduces you to the charismatic thief Locke Lamora and his band of clever misfits. Prepare for a thrilling ride filled with heists, political intrigue, and danger lurking in every corner. Lynch\'s witty dialogue and intricate plot will keep you turning the pages.\r\n\r\n\"Harry Potter and the Sorcerer\'s Stone\" by J.K. Rowling:\r\nStep into the magical world of Hogwarts School of Witchcraft and Wizardry, where Harry Potter begins his extraordinary journey. Rowling\'s enchanting storytelling and memorable characters make this a timeless series that will ignite your imagination.\r\n\r\nThese are just a few gems in the vast realm of fantasy literature. Share your favorite fantasy novels, discuss your thoughts on these recommendations, or recommend other captivating titles in the comments below. Let\'s unite our love for the fantastical and embark on literary adventures together!\r\n\r\nHappy reading and may your imagination soar! ✨', 'Bookworms'),
(4, 'Practical Tips for Cultivating a Healthy Mind and Body', 2, '2023-07-10 00:34:28', NULL, 'Hello, Health and Wellness community! 🌿💪\r\n\r\nToday, I want to share some practical tips for achieving a healthy mind and body. In our fast-paced lives, it\'s crucial to prioritize self-care and make choices that promote overall well-being. Let\'s dive into some actionable steps you can take:\r\n\r\nPrioritize Quality Sleep:\r\nAdequate sleep is essential for your mental and physical health. Establish a consistent sleep schedule, create a relaxing bedtime routine, and ensure your sleep environment is conducive to restful sleep. Aim for 7-8 hours of quality sleep each night to recharge and rejuvenate.\r\n\r\nNourish Your Body with Balanced Nutrition:\r\nFuel your body with wholesome, nutrient-dense foods. Emphasize a balanced diet rich in fruits, vegetables, whole grains, lean proteins, and healthy fats. Avoid excessive processed foods, sugary snacks, and drinks. Stay hydrated by drinking plenty of water throughout the day.\r\n\r\nEngage in Regular Physical Activity:\r\nFind physical activities you enjoy and make them a part of your routine. It could be brisk walks, yoga, cycling, dancing, or any other form of exercise. Aim for at least 150 minutes of moderate-intensity aerobic activity or 75 minutes of vigorous activity each week, along with strength training exercises.\r\n\r\nPractice Mindfulness and Stress Management:\r\nIncorporate mindfulness techniques into your daily life to reduce stress and improve mental well-being. Take a few moments each day for deep breathing exercises, meditation, or mindfulness practices. Find healthy outlets for stress, such as engaging in hobbies, spending time in nature, or journaling.\r\n\r\nCultivate Positive Relationships and Social Connections:\r\nNurture meaningful connections with family, friends, and community. Surround yourself with supportive individuals who uplift and inspire you. Engage in social activities, join groups with shared interests, and give back to your community. Human connections play a vital role in our overall happiness and well-being.\r\n\r\nFind Joy in Everyday Activities:\r\nIncorporate activities that bring you joy and fulfillment into your daily routine. It could be reading, listening to music, painting, cooking, or any hobby that sparks your passion. Take time for yourself and engage in activities that recharge your spirit and bring a sense of purpose.\r\n\r\nPractice Self-Compassion and Positive Self-Talk:\r\nBe kind to yourself and practice self-compassion. Replace negative self-talk with positive affirmations and embrace self-acceptance. Treat yourself with love, respect, and forgiveness as you navigate life\'s ups and downs.\r\n\r\nRemember, small changes can lead to significant improvements in your overall health and well-being. Incorporate these tips into your daily life gradually and find what works best for you. Share your experiences, tips, and questions in the comments below, and let\'s support each other on our health and wellness journeys.\r\n\r\nHere\'s to a thriving mind and body! 🌻💚\r\n\r\n\r\n\r\n\r\n', 'Wellness'),
(5, 'Build Strength and Sculpt Your Body: Beginner\'s Weightlifting Routine', 1, '2023-07-10 00:36:20', NULL, 'Hello, Health and Wellness community! 💪🏋️‍♀️\r\n\r\nAre you ready to embark on a weightlifting journey that will help you build strength, increase muscle tone, and boost your overall fitness? Today, I\'m excited to share a beginner\'s weightlifting routine that will set you on the path to achieving your fitness goals. Let\'s get started:\r\n\r\nBefore diving into the routine, remember to warm up properly by performing dynamic stretches and light cardio exercises. This will help prepare your muscles and reduce the risk of injury.\r\n\r\nSquats:\r\n\r\nStand with your feet shoulder-width apart, toes slightly turned out.\r\nBend your knees and lower your body into a squat, keeping your back straight and chest lifted.\r\nPush through your heels to return to the starting position.\r\nAim for 3 sets of 10-12 reps.\r\nDeadlifts:\r\n\r\nStand with your feet hip-width apart, knees slightly bent.\r\nBend at your hips, keeping your back straight, and lower your torso towards the ground.\r\nGrasp the barbell with an overhand grip, hands slightly wider than shoulder-width apart.\r\nPush through your heels, engage your core, and lift the barbell by extending your hips and standing upright.\r\nLower the barbell back down with controlled movement.\r\nAim for 3 sets of 8-10 reps.\r\nChest Press (Dumbbell or Barbell):\r\n\r\nLie flat on a bench, feet flat on the ground.\r\nHold dumbbells or a barbell at chest level, with your palms facing away from you.\r\nPush the weight straight up until your arms are fully extended.\r\nLower the weight back down towards your chest with control.\r\nAim for 3 sets of 8-10 reps.\r\nBent-Over Rows:\r\n\r\nStand with your feet hip-width apart, knees slightly bent, and hold a barbell or dumbbells with an overhand grip.\r\nHinge forward at the hips, keeping your back straight and core engaged.\r\nPull the weight towards your lower chest, squeezing your shoulder blades together.\r\nLower the weight back down with control.\r\nAim for 3 sets of 8-10 reps.\r\nOverhead Shoulder Press:\r\n\r\nStand with your feet shoulder-width apart, holding dumbbells at shoulder level with palms facing forward.\r\nPress the weights overhead until your arms are fully extended.\r\nLower the weights back down to shoulder level with control.\r\nAim for 3 sets of 8-10 reps.\r\nRemember to start with weights that challenge you but allow you to maintain proper form. As you progress, gradually increase the weight and intensity. Rest for about 1-2 minutes between sets to allow for muscle recovery.\r\n\r\nFinish your weightlifting routine with a cool-down, which can include static stretching and light cardio to help your muscles recover and prevent stiffness.\r\n\r\nPlease consult with a fitness professional or trainer if you are new to weightlifting or have any specific concerns or limitations.\r\n\r\nShare your progress, questions, or additional weightlifting tips in the comments below. Let\'s support each other on our fitness journeys!\r\n\r\nHere\'s to getting stronger and sculpting a healthier you! 💪🔥\r\n\r\n\r\n\r\n\r\n', 'Wellness');

-- --------------------------------------------------------

--
-- Table structure for table `Responds`
--

CREATE TABLE `Responds` (
  `sender` int NOT NULL,
  `original_msgid` int NOT NULL,
  `response_msgid` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `Reviews`
--

CREATE TABLE `Reviews` (
  `reviewer` int NOT NULL,
  `pid` int NOT NULL,
  `review` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `Reviews`
--

INSERT INTO `Reviews` (`reviewer`, `pid`, `review`) VALUES
(2, 4, 1),
(3, 4, 1);

-- --------------------------------------------------------

--
-- Table structure for table `Sends`
--

CREATE TABLE `Sends` (
  `sender` int NOT NULL,
  `msgid` int NOT NULL,
  `recipient_user` int DEFAULT NULL,
  `recipient_post` int DEFAULT NULL,
  `u_p_flag` enum('User','Post') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE `User` (
  `uid` int NOT NULL,
  `email` varchar(89) NOT NULL,
  `username` varchar(20) NOT NULL,
  `password` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`uid`, `email`, `username`, `password`) VALUES
(1, 'test@email.com', 'user01', '28a4565a4953cb4e7e23317ba0504f4c'),
(2, 'fake@gmail.com', 'user02', '89cdd3dd30e3a9445922222b60a0c1f6'),
(3, 'faker@protonmail.ch', 'user03', '4775a717f7d414378e42638b53906f9b'),
(4, 'testing@example.com', 'user04', 'f716f0e34a23a69592a491012ba73a19');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `Belongs_to`
--
ALTER TABLE `Belongs_to`
  ADD KEY `User` (`uid`),
  ADD KEY `Group` (`gid`);

--
-- Indexes for table `Community`
--
ALTER TABLE `Community`
  ADD PRIMARY KEY (`name`),
  ADD KEY `owner` (`owner`);

--
-- Indexes for table `Follows`
--
ALTER TABLE `Follows`
  ADD KEY `Follows_c_constraint` (`followed_community`),
  ADD KEY `Follows_u_constraint` (`followed_user`),
  ADD KEY `Follows_follower_constraint` (`follower`);

--
-- Indexes for table `Group`
--
ALTER TABLE `Group`
  ADD PRIMARY KEY (`gid`);

--
-- Indexes for table `Message`
--
ALTER TABLE `Message`
  ADD PRIMARY KEY (`msgid`);

--
-- Indexes for table `Post`
--
ALTER TABLE `Post`
  ADD PRIMARY KEY (`pid`),
  ADD KEY `publisher` (`publisher`),
  ADD KEY `belongs_in` (`belongs_in`);

--
-- Indexes for table `Responds`
--
ALTER TABLE `Responds`
  ADD KEY `sender` (`sender`),
  ADD KEY `original_msgid` (`original_msgid`),
  ADD KEY `response_msgid` (`response_msgid`);

--
-- Indexes for table `Reviews`
--
ALTER TABLE `Reviews`
  ADD KEY `reviewer` (`reviewer`),
  ADD KEY `pid` (`pid`);

--
-- Indexes for table `Sends`
--
ALTER TABLE `Sends`
  ADD KEY `sender` (`sender`),
  ADD KEY `msgid` (`msgid`),
  ADD KEY `recipient_user` (`recipient_user`),
  ADD KEY `recipient_post` (`recipient_post`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`uid`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `Group`
--
ALTER TABLE `Group`
  MODIFY `gid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Message`
--
ALTER TABLE `Message`
  MODIFY `msgid` int NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `Post`
--
ALTER TABLE `Post`
  MODIFY `pid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `User`
--
ALTER TABLE `User`
  MODIFY `uid` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `Belongs_to`
--
ALTER TABLE `Belongs_to`
  ADD CONSTRAINT `Group` FOREIGN KEY (`gid`) REFERENCES `Group` (`gid`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `User` FOREIGN KEY (`uid`) REFERENCES `User` (`uid`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `Community`
--
ALTER TABLE `Community`
  ADD CONSTRAINT `Community_ibfk_1` FOREIGN KEY (`owner`) REFERENCES `User` (`uid`);

--
-- Constraints for table `Follows`
--
ALTER TABLE `Follows`
  ADD CONSTRAINT `Follows_c_constraint` FOREIGN KEY (`followed_community`) REFERENCES `Community` (`name`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `Follows_follower_constraint` FOREIGN KEY (`follower`) REFERENCES `User` (`uid`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `Follows_u_constraint` FOREIGN KEY (`followed_user`) REFERENCES `User` (`uid`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Constraints for table `Post`
--
ALTER TABLE `Post`
  ADD CONSTRAINT `Post_ibfk_1` FOREIGN KEY (`publisher`) REFERENCES `User` (`uid`),
  ADD CONSTRAINT `Post_ibfk_2` FOREIGN KEY (`belongs_in`) REFERENCES `Community` (`name`);

--
-- Constraints for table `Responds`
--
ALTER TABLE `Responds`
  ADD CONSTRAINT `Responds_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `User` (`uid`),
  ADD CONSTRAINT `Responds_ibfk_2` FOREIGN KEY (`original_msgid`) REFERENCES `Message` (`msgid`),
  ADD CONSTRAINT `Responds_ibfk_3` FOREIGN KEY (`response_msgid`) REFERENCES `Message` (`msgid`);

--
-- Constraints for table `Reviews`
--
ALTER TABLE `Reviews`
  ADD CONSTRAINT `Reviews_ibfk_1` FOREIGN KEY (`reviewer`) REFERENCES `User` (`uid`),
  ADD CONSTRAINT `Reviews_ibfk_2` FOREIGN KEY (`pid`) REFERENCES `Post` (`pid`);

--
-- Constraints for table `Sends`
--
ALTER TABLE `Sends`
  ADD CONSTRAINT `Sends_ibfk_1` FOREIGN KEY (`sender`) REFERENCES `User` (`uid`),
  ADD CONSTRAINT `Sends_ibfk_2` FOREIGN KEY (`msgid`) REFERENCES `Message` (`msgid`),
  ADD CONSTRAINT `Sends_ibfk_3` FOREIGN KEY (`recipient_user`) REFERENCES `User` (`uid`),
  ADD CONSTRAINT `Sends_ibfk_4` FOREIGN KEY (`recipient_post`) REFERENCES `Post` (`pid`);


--
-- Database: `session_store`
--
CREATE DATABASE IF NOT EXISTS `session_store` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

GRANT USAGE ON *.* TO `proj_user`@`%`;
GRANT SELECT, INSERT, UPDATE, DELETE ON `proj\_db`.* TO `proj_user`@`%`;
GRANT ALL PRIVILEGES ON `session\_store`.* TO `proj_user`@`%`;