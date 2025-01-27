# English ⇔ Darija Translator Project

### “Advanced and Accurate English-Moroccan Darija Translation”

`ReactJS`
`Python`
`TypeScript`
`Flask`
`Firebase`
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

This project is more than just a technical demonstration – it's a tool designed to bridge communication gaps and support cultural exchange. As a Moroccan software engineer, I've poured my heart and expertise into creating a resource that will be truly useful for both visitors to Morocco and those interested in learning our unique dialect.

This project combines my passion for technology with a desire to contribute meaningfully to the community. It represents not just what I've learned, but also my vision for how software can solve real-world problems and bring people together.

I started this as my final portfolio submission for the **ALX** Software Engineering program (**Holberton School**). But then, I decided to take it a step further and make it live for everyone to use. This project represents the culmination of my learning journey and showcases the skills I've developed throughout the course.

## The Problem

The project aims to address the lack of online services that provide translation assistance for English speakers learning Moroccan Darija. This problem is particularly relevant in Morocco, where many foreigners are eager to learn the local language but struggle to find reliable resources to guide them.

## Tech Stack

- **Frontend**:

  - `ReactJS` with **TypeScript**.
  - `Tailwind CSS`
  - `Shadcn/ui`

- **Backend**:

  - `Flask` (Python framework) for creating **APIs**.

- **Database**:

  - `MySQL` for managing structured data.
  - `Firebase` to power the community forum.

- **Third-Party Services**:
  - `Algolia` for advanced search capabilities.
  - `SendGrid` for handling email communications.

## Installation

### 1. Prerequisites

Ensure you have the following tools installed on your machine:

- `Python 3.12` and `pip` (Python package manager)
- `Node.js` (preferably v20 or later) and `npm` (Node package manager)
- `MySQL` for structured data storage
- `Git` for version control

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

## Contact

**Ouadia EL-Ouardy** \
**Email:** ouadia@elouardy.com \
**Twitter:** https://twitter.com/_ELOUARDY
