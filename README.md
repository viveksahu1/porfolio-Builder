# Portfolio Builder

This project is a portfolio builder that allows you to generate a personalized portfolio website by simply pasting your resume. It offers two portfolio types: Frontend Developer and Backend Developer.

## How It Works

1.  **Paste Your Resume**: Open the `index.html` file and paste your resume into the text area.
2.  **Select Portfolio Type**: Choose between "Frontend Developer" and "Backend Developer" to tailor the portfolio layout and content.
3.  **Generate Portfolio**: Click the "Generate Portfolio" button to create your personalized website.

The application uses a backend service to parse your resume and extract key information like your name, summary, skills, and experience. This information is then used to populate a pre-designed portfolio template.

## Technologies Used

* **Frontend**: HTML, CSS, JavaScript, Tailwind CSS
* **Backend**: Node.js, Express.js
* **API**: Google Generative AI

## Files

* `index.html`: The main page where you input your resume.
* `portfolio.html`: The template for the Frontend Developer portfolio.
* `backend.html`: The template for the Backend Developer portfolio.
* `server.js`: The backend server that processes the resume and generates the portfolio data.
* `package.json`: Contains the project dependencies.