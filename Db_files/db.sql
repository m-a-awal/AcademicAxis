-- phpMyAdmin SQL Dump
-- version 4.4.15.10
-- https://www.phpmyadmin.net
--
-- Host: mysql.hrz.tu-chemnitz.de
-- Generation Time: Jul 04, 2021 at 02:18 AM
-- Server version: 10.3.29-MariaDB
-- PHP Version: 5.4.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `datenbanken-aally`
--

-- --------------------------------------------------------

--
-- Table structure for table `AssignedSubject`
--

CREATE TABLE IF NOT EXISTS `AssignedSubject` (
  `aid` varchar(20) NOT NULL,
  `uid` varchar(20) NOT NULL,
  `sid` varchar(20) NOT NULL,
  `status` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `AssignedSubject`
--

INSERT INTO `AssignedSubject` (`aid`, `uid`, `sid`, `status`) VALUES
('AI1625303668789A0', 'USRATR1625299706570', 'SUB1625301123026', 'Not Archived'),
('AI1625303668789A1', 'USRATR1625299706570', 'SUB1625303581537', 'Not Archived'),
('AI1625303690544A0', 'USRATR1625302183541', 'SUB1625301123026', 'Not Archived'),
('AI1625303690544A1', 'USRATR1625302183541', 'SUB1625303581537', 'Not Archived'),
('AI1625303720383A0', 'USRATR1625302220304', 'SUB1625301450270', 'Not Archived'),
('AI1625348348845A0', 'USRATR1625299706570', 'SUB1625346400320', 'Not Archived'),
('AI1625348348845A1', 'USRATR1625302183541', 'SUB1625346400320', 'Not Archived'),
('AI1625349633173A0', 'USRATR1625302246008', 'SUB1625301450270', 'Not Archived'),
('AI1625350063813A0', 'USRATR1625302246008', 'SUB1625301123026', 'Not Archived'),
('AI1625350063814A1', 'USRATR1625302246008', 'SUB1625303581537', 'Not Archived'),
('AI1625350063814A2', 'USRATR1625302246008', 'SUB1625346400320', 'Not Archived');

-- --------------------------------------------------------

--
-- Table structure for table `Class`
--

CREATE TABLE IF NOT EXISTS `Class` (
  `cid` varchar(20) NOT NULL,
  `classname` varchar(15) NOT NULL,
  `is_removed` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Class`
--

INSERT INTO `Class` (`cid`, `classname`, `is_removed`) VALUES
('CLS1625299755825', 'Class-A', 'No'),
('CLS1625299774712', 'Class-B', 'No'),
('CLS1625348139566', 'Class-Z', 'Yes'),
('CLS1625348139840', 'Class-C', 'Yes');

-- --------------------------------------------------------

--
-- Table structure for table `ClassStudent`
--

CREATE TABLE IF NOT EXISTS `ClassStudent` (
  `csid` varchar(20) NOT NULL,
  `uid` varchar(20) NOT NULL,
  `cid` varchar(20) NOT NULL,
  `isAssigned` varchar(3) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `ClassStudent`
--

INSERT INTO `ClassStudent` (`csid`, `uid`, `cid`, `isAssigned`) VALUES
('ASGN1625303668727', 'USRATR1625299706570', 'CLS1625299755825', 'N'),
('ASGN1625303668799', 'USRATR1625302246008', 'CLS1625299774712', 'Y'),
('ASGN1625303690515', 'USRATR1625302183541', 'CLS1625299755825', 'Y'),
('ASGN1625303720357', 'USRATR1625302220304', 'CLS1625299774712', 'Y');

-- --------------------------------------------------------

--
-- Table structure for table `result`
--

CREATE TABLE IF NOT EXISTS `result` (
  `resid` varchar(20) NOT NULL,
  `marks` float NOT NULL,
  `tid` varchar(20) NOT NULL,
  `aid` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `result`
--

INSERT INTO `result` (`resid`, `marks`, `tid`, `aid`) VALUES
('RES1625303888297', 9.3, 'TST1625303868267', 'AI1625303668789A0'),
('RES1625303897604', 7, 'TST1625303868267', 'AI1625303690544A0'),
('RES1625303984784', 8, 'TST1625303922739', 'AI1625303668789A0'),
('RES1625303999737', 3, 'TST1625303922739', 'AI1625303690544A0'),
('RES1625354366468', 15, 'TST1625354328673', 'AI1625348348845A1');

-- --------------------------------------------------------

--
-- Table structure for table `Subject`
--

CREATE TABLE IF NOT EXISTS `Subject` (
  `sid` varchar(20) NOT NULL,
  `subjectname` varchar(15) NOT NULL,
  `status` text NOT NULL,
  `uid` varchar(20) NOT NULL,
  `cid` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Subject`
--

INSERT INTO `Subject` (`sid`, `subjectname`, `status`, `uid`, `cid`) VALUES
('SUB1625301123026', 'Mathematics', 'Not Archived', 'USRATR1625299641310', 'CLS1625299755825'),
('SUB1625301450270', 'Mathematics', 'Not Archived', 'USRATR1625301170913', 'CLS1625299774712'),
('SUB1625303581537', 'English', 'Not Archived', 'USRATR1625301170913', 'CLS1625299755825'),
('SUB1625346400320', 'Science', 'Not Archived', 'USRATR1625299641310', 'CLS1625299755825');

-- --------------------------------------------------------

--
-- Table structure for table `Test`
--

CREATE TABLE IF NOT EXISTS `Test` (
  `tid` varchar(20) NOT NULL,
  `testname` varchar(15) NOT NULL,
  `testdate` date NOT NULL,
  `sid` varchar(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `Test`
--

INSERT INTO `Test` (`tid`, `testname`, `testdate`, `sid`) VALUES
('TST1625303868267', 'Class Test 1', '2021-06-28', 'SUB1625301123026'),
('TST1625303922739', 'Class Test 2', '2021-07-01', 'SUB1625301123026'),
('TST1625354328673', 'Class Test 1', '2021-07-02', 'SUB1625346400320');

-- --------------------------------------------------------

--
-- Table structure for table `User`
--

CREATE TABLE IF NOT EXISTS `User` (
  `uid` varchar(20) NOT NULL,
  `username` varchar(15) NOT NULL,
  `password` text NOT NULL,
  `firstname` varchar(15) NOT NULL,
  `lastname` varchar(15) NOT NULL,
  `role` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `User`
--

INSERT INTO `User` (`uid`, `username`, `password`, `firstname`, `lastname`, `role`) VALUES
('USRATR1625072204338', 'admin', '$2a$10$DBgDaTgzHr.3pgy3qS43He2krKQf3WPEtWfGIac4aE47lJgnmxskO', 'Michael', 'Corleone', 'Admin'),
('USRATR1625299641310', 'tea1', '$2a$10$karbv.AXhLR69pExGB5PXe1QPhnbzy9RPO4bQVaWAYnD6LPcFiC.a', 'Nathan', 'Drake', 'Teacher'),
('USRATR1625299706570', 'pupil1', '$2a$10$zjn9uP9LApmx4/Rc91n9ieRO.cRoeinxIVeRo5cLf3iUVCAJAAp8O', 'Adriane', 'Owen', 'Pupil'),
('USRATR1625299733500', 'admin2', '$2a$10$dL5ZM6NrqyVErRdluicU6..JbuYeEveGxAWhxKwKntPsZ782FYKtu', 'Bob', 'Marley', 'Admin'),
('USRATR1625301170913', 'tea2', '$2a$10$JqzH/YOkjnQXVnNd08Fw/ODCd/i0dF0A.F/zU88kwD9LIXswlj1rC', 'Alicia', 'Werner', 'Teacher'),
('USRATR1625302183541', 'pupil2', '$2a$10$KeYuc3rAUOAbk1EsYIGL9OhYIQtj6sMSXs2S.6fT5sCfwZPGU0.ZW', 'Samuel', 'Jackson', 'Pupil'),
('USRATR1625302220304', 'pupil3', '$2a$10$GmIV.VTGoRu4Pr4F9KFbVuPWHvnhLo725htsP8L2OSchUQw73HS1S', 'Isaac', 'Newton', 'Pupil'),
('USRATR1625302246008', 'pupil4', '$2a$10$EZs0jg8s0aNnAorbpKnmGu4JyDD/tGDp87hIy7036avAjENs9mv8W', 'Frank', 'Joseph', 'Pupil');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `AssignedSubject`
--
ALTER TABLE `AssignedSubject`
  ADD PRIMARY KEY (`aid`),
  ADD KEY `fk_uid_assignsub` (`uid`),
  ADD KEY `fk_sid_assignsub` (`sid`);

--
-- Indexes for table `Class`
--
ALTER TABLE `Class`
  ADD PRIMARY KEY (`cid`);

--
-- Indexes for table `ClassStudent`
--
ALTER TABLE `ClassStudent`
  ADD PRIMARY KEY (`csid`),
  ADD KEY `fk_uid_cs` (`uid`),
  ADD KEY `fk_cid_cs` (`cid`);

--
-- Indexes for table `result`
--
ALTER TABLE `result`
  ADD PRIMARY KEY (`resid`),
  ADD UNIQUE KEY `resid` (`resid`),
  ADD KEY `fk_tid_res` (`tid`),
  ADD KEY `fk_aid` (`aid`);

--
-- Indexes for table `Subject`
--
ALTER TABLE `Subject`
  ADD PRIMARY KEY (`sid`),
  ADD KEY `fk_cid` (`cid`),
  ADD KEY `fk_uid` (`uid`);

--
-- Indexes for table `Test`
--
ALTER TABLE `Test`
  ADD PRIMARY KEY (`tid`),
  ADD KEY `fk_sid_test` (`sid`);

--
-- Indexes for table `User`
--
ALTER TABLE `User`
  ADD PRIMARY KEY (`uid`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `AssignedSubject`
--
ALTER TABLE `AssignedSubject`
  ADD CONSTRAINT `fk_sid_assignsub` FOREIGN KEY (`sid`) REFERENCES `Subject` (`sid`),
  ADD CONSTRAINT `fk_uid_assignsub` FOREIGN KEY (`uid`) REFERENCES `User` (`uid`);

--
-- Constraints for table `ClassStudent`
--
ALTER TABLE `ClassStudent`
  ADD CONSTRAINT `fk_cid_cs` FOREIGN KEY (`cid`) REFERENCES `Class` (`cid`),
  ADD CONSTRAINT `fk_uid_cs` FOREIGN KEY (`uid`) REFERENCES `User` (`uid`);

--
-- Constraints for table `result`
--
ALTER TABLE `result`
  ADD CONSTRAINT `fk_aid` FOREIGN KEY (`aid`) REFERENCES `AssignedSubject` (`aid`),
  ADD CONSTRAINT `fk_tid_res` FOREIGN KEY (`tid`) REFERENCES `Test` (`tid`);

--
-- Constraints for table `Subject`
--
ALTER TABLE `Subject`
  ADD CONSTRAINT `fk_cid` FOREIGN KEY (`cid`) REFERENCES `Class` (`cid`),
  ADD CONSTRAINT `fk_uid` FOREIGN KEY (`uid`) REFERENCES `User` (`uid`);

--
-- Constraints for table `Test`
--
ALTER TABLE `Test`
  ADD CONSTRAINT `fk_sid_test` FOREIGN KEY (`sid`) REFERENCES `Subject` (`sid`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
