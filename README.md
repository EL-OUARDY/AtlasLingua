# English ⇔ Darija Translator Project

### “Advanced and Accurate English-Moroccan Darija Translation”

`ReactJS`
`Python`
`TypeScript`
`Flask`
`TailwindCSS`
`Shadcn/ui`

![English ⇔ Darija Translator Project](/screenshot.png)

## Table of Contents

- [Overview](#overview)
- [The Problem](#the-problem)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [About me](#about)
- [Contact](#contact-me)

# Overview

This project is my final portfolio submission for the **ALX** Software Engineering program (**Holberton School**). It represents the culmination of my learning journey and showcases the skills I've developed throughout the course.

The English ⇔ Darija Translator is more than just a technical demonstration – it's a tool designed to bridge communication gaps and support cultural exchange. As a Moroccan software engineer, I've poured my heart and expertise into creating a resource that will be truly useful for both visitors to Morocco and those interested in learning our unique dialect.

This project combines my passion for technology with a desire to contribute meaningfully to the community. It represents not just what I've learned, but also my vision for how software can solve real-world problems and bring people together.

## The Problem

The project aims to address the lack of online services that provide translation assistance for English speakers learning Moroccan Darija. This problem is particularly relevant in Morocco, where there are many foreigners, including tourists, who may struggle with communication due to language barriers.

## Tech Stack

- **Frontend**:

  - `React.js` with **TypeScript** for dynamic user interface
  - `Tailwind CSS`
  - `Shadcn/ui` library for enhanced UI features

- **Backend**:

  - `Flask` Python framework for creating **APIs** and for efficient server-side processing

- **Database**:
  - `MySQL` for structured data
  - `Firebase` for real-time data storage and synchronization

## Installation

### 1. Prerequisites

Ensure you have the following tools installed on your machine:

- `Python 3.12` and `pip` (Python package manager)
- `Node.js` (preferably v20 or later) and `npm` (Node package manager)
- `MySQL` for structured data storage
- `Git` for version control

If you don’t have these installed, please install them first.

### 2. Setting Up the Frontend (React with TypeScript)

#### 1. Clone the repository:

```bash
git clone https://github.com/EL-OUARDY/AtlasLingua.git
cd AtlasLingua
```

#### 2. Install frontend dependencies:

```bash
npm install
```

#### 3. Environment Variables:

Copy `.env.example` to `.env` and replace placeholder values with actual values.

### 3. Setting Up the Backend API (Flask)

#### 1. Navigate to the backend folder

```bash
cd api
```

#### 2. Set up a virtual environment:

```bash
python -m venv venv
source venv/bin/activate
```

#### 3. Install backend dependencies:

```bash
pip install -r requirements.txt
```

#### 4. Environment Variables:

Copy `.env.example` to `.env` and replace placeholder values with actual values.

#### 5. Setup database:

Create a MySQL database, configure the connection in the `.env` file, and then run the migration.

```bash
flask db init
flask db migrate
flask db upgrade
```

### 4. Running the Application

#### 1. Start the backend API (Flask):

```bash
python run.py
```

This will start the Flask server at http://localhost:5000.

#### 2. Start the frontend (React):

```bash
cd ..
npm run dev
```

This will start the frontend development server at http://localhost:3000.

#### 3. Access the Application:

Visit http://localhost:3000 in your browser to see the frontend.

## About

My name is Ouadia EL-Ouardy, and I’m a dedicated programmer. I wrote my first line of code in 2016 during a training program in my city. After that, I continued learning as a self-taught student, eventually gaining solid knowledge in web development. This enabled me to land freelance projects and successfully deliver many of them. Despite this progress, I always felt there was something missing in my education, which led me to join ALX in 2023. The journey at ALX has been incredibly enjoyable and far exceeded my expectations, providing me with more knowledge and skills than I could have imagined. This project is part of my ALX portfolio, and I built it with all my heart, putting everything I know into action. I also decided to take this project further and make it available for people to use.

## Contact

**Ouadia EL-Ouardy** \
**Email:** ouadia@elouardy.com \
**Twitter:** https://twitter.com/_ELOUARDY
