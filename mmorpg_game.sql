-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Počítač: localhost:8889
-- Vytvořeno: Sob 05. říj 2024, 08:10
-- Verze serveru: 5.7.39
-- Verze PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Databáze: `mmorpg_game`
--

-- --------------------------------------------------------

--
-- Struktura tabulky `buildings`
--

CREATE TABLE `buildings` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `type` varchar(50) NOT NULL,
  `x` int(11) NOT NULL,
  `y` int(11) NOT NULL,
  `start_time` bigint(20) NOT NULL,
  `level` int(11) DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `buildings`
--

INSERT INTO `buildings` (`id`, `username`, `type`, `x`, `y`, `start_time`, `level`) VALUES
(139, 'xaranex', 'goldMachine', 540, 495, 1727275510693, 1),
(144, 'xaranex', 'miningOre', 855, 293, 1727741422829, 1),
(149, 'xaranex', 'house2', 945, 563, 1727988943947, 1),
(150, 'xaranex', 'house2', 135, 518, 1728039379021, 1);

-- --------------------------------------------------------

--
-- Struktura tabulky `clans`
--

CREATE TABLE `clans` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `leader` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `clans`
--

INSERT INTO `clans` (`id`, `name`, `leader`, `created_at`) VALUES
(1, 'Klan123', 'xaranex', '2024-10-04 11:51:17');

-- --------------------------------------------------------

--
-- Struktura tabulky `clan_members`
--

CREATE TABLE `clan_members` (
  `clan_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `joined_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `clan_members`
--

INSERT INTO `clan_members` (`clan_id`, `username`, `joined_at`) VALUES
(1, 'xaranex', '2024-10-04 11:51:17');

-- --------------------------------------------------------

--
-- Struktura tabulky `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `sender` varchar(255) NOT NULL,
  `recipient` varchar(255) NOT NULL,
  `subject` varchar(255) NOT NULL,
  `content` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_read` tinyint(1) DEFAULT '0',
  `type` varchar(50) DEFAULT 'normal'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Struktura tabulky `quests`
--

CREATE TABLE `quests` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text NOT NULL,
  `reward` varchar(255) NOT NULL,
  `position_x` int(11) NOT NULL,
  `position_y` int(11) NOT NULL,
  `completed` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `quests`
--

INSERT INTO `quests` (`id`, `title`, `description`, `reward`, `position_x`, `position_y`, `completed`) VALUES
(1, 'The Bartender\'s Request', 'The bartender needs 10 rare herbs from the Whispering Woods. Bring them to him for a reward.', '50 gold and a magic potion', 300, 300, 0),
(2, 'Mysterious Stranger\'s Riddle', 'Solve the riddle of the mysterious stranger in the corner. The answer may lead to great treasure.', '100 gold and a map fragment', 1000, 250, 0),
(3, 'Bard\'s Lost Instrument', 'The bard has lost his magical lute. Find it in the city and return it to him.', '75 gold and increased Charisma', 900, 400, 0),
(4, 'Armwrestling Challenge', 'Defeat the burly warrior in an armwrestling match to prove your strength.', '60 gold and increased Strength', 600, 500, 0),
(5, 'Elven Emissary\'s Message', 'Deliver a secret message from the elven emissary to the captain of the guard.', '90 gold and a piece of elven armor', 700, 350, 0);

-- --------------------------------------------------------

--
-- Struktura tabulky `resources`
--

CREATE TABLE `resources` (
  `username` varchar(50) NOT NULL,
  `wood` int(11) DEFAULT '100',
  `stone` int(11) DEFAULT '50',
  `iron` int(11) DEFAULT '25',
  `gold` int(11) DEFAULT '10'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `resources`
--

INSERT INTO `resources` (`username`, `wood`, `stone`, `iron`, `gold`) VALUES
('xaranex', 994199, 996559, 999949, 999999);

-- --------------------------------------------------------

--
-- Struktura tabulky `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `experience` int(11) DEFAULT '0',
  `level` int(11) DEFAULT '1',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `desire_for_adventure` int(11) DEFAULT '0',
  `class` int(11) NOT NULL DEFAULT '1',
  `strength` int(11) DEFAULT '10',
  `defense` int(11) DEFAULT '10',
  `intelligence` int(11) DEFAULT '10',
  `dexterity` int(11) DEFAULT '10',
  `gold` int(11) DEFAULT '0',
  `avatar` VARCHAR(50) NOT NULL DEFAULT 'warrior_m_1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `experience`, `level`, `created_at`, `desire_for_adventure`, `class`, `strength`, `defense`, `intelligence`, `dexterity`, `gold`) VALUES
(1, 'xaranex', '$2y$10$MGucf1XYgM8glaZS39sXaeM./OfBcN9pYXChUZqSLb2IWvKVnRnCK', 7640, 18, '2024-09-23 19:22:21', 100, 2, 11, 11, 10, 10, 0);

--
-- Indexy pro exportované tabulky
--

--
-- Indexy pro tabulku `buildings`
--
ALTER TABLE `buildings`
  ADD PRIMARY KEY (`id`),
  ADD KEY `username` (`username`);

--
-- Indexy pro tabulku `clans`
--
ALTER TABLE `clans`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `clan_members`
--
ALTER TABLE `clan_members`
  ADD PRIMARY KEY (`clan_id`,`username`),
  ADD KEY `username` (`username`);

--
-- Indexy pro tabulku `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `quests`
--
ALTER TABLE `quests`
  ADD PRIMARY KEY (`id`);

--
-- Indexy pro tabulku `resources`
--
ALTER TABLE `resources`
  ADD PRIMARY KEY (`username`);

--
-- Indexy pro tabulku `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT pro tabulky
--

--
-- AUTO_INCREMENT pro tabulku `buildings`
--
ALTER TABLE `buildings`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=151;

--
-- AUTO_INCREMENT pro tabulku `clans`
--
ALTER TABLE `clans`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pro tabulku `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT pro tabulku `quests`
--
ALTER TABLE `quests`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT pro tabulku `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Omezení pro exportované tabulky
--

--
-- Omezení pro tabulku `buildings`
--
ALTER TABLE `buildings`
  ADD CONSTRAINT `buildings_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`);

--
-- Omezení pro tabulku `clan_members`
--
ALTER TABLE `clan_members`
  ADD CONSTRAINT `clan_members_ibfk_1` FOREIGN KEY (`clan_id`) REFERENCES `clans` (`id`),
  ADD CONSTRAINT `clan_members_ibfk_2` FOREIGN KEY (`username`) REFERENCES `users` (`username`);

--
-- Omezení pro tabulku `resources`
--
ALTER TABLE `resources`
  ADD CONSTRAINT `resources_ibfk_1` FOREIGN KEY (`username`) REFERENCES `users` (`username`);

-- --------------------------------------------------------

--
-- Struktura tabulky `fights`
--

CREATE TABLE `fights` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `player_id` int(11) NOT NULL,
  `mob_id` int(11) NOT NULL,
  `player_health` int(11) NOT NULL,
  `mob_health` int(11) NOT NULL,
  `is_player_turn` tinyint(1) NOT NULL DEFAULT '1',
  `is_completed` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `player_id` (`player_id`),
  KEY `mob_id` (`mob_id`),
  CONSTRAINT `fights_ibfk_1` FOREIGN KEY (`player_id`) REFERENCES `users` (`id`),
  CONSTRAINT `fights_ibfk_2` FOREIGN KEY (`mob_id`) REFERENCES `mobs` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

-- --------------------------------------------------------

--
-- Struktura tabulky `mobs`
--

CREATE TABLE IF NOT EXISTS `mobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `max_health` int(11) NOT NULL,
  `strength` int(11) NOT NULL,
  `defense` int(11) NOT NULL,
  `dexterity` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Vypisuji data pro tabulku `mobs`
--

INSERT INTO `mobs` (`name`, `max_health`, `strength`, `defense`, `dexterity`) VALUES
('Goblin', 50, 5, 3, 7),
('Orc', 80, 8, 5, 4),
('Troll', 120, 12, 8, 2),
('Skeleton', 40, 4, 2, 8),
('Wolf', 60, 6, 3, 9);
