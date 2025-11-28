# AI-Powered Mock Interview Platform

## Description

This is an advanced and interactive AI-powered mock interview platform designed to help job seekers practice and improve their interview skills. Built with Next.js, Tailwind CSS, and Gemini Api,PostgreSQL, Drizzle ORM, it provides users with a good interview experience to enhance their chances of landing their dream job.

## Features

- AI-driven Interview: interview questions and feedback powered by AI.
- Personalized Interview Experiences: Tailor interview sessions based on job roles and industries.
- User Experience Level Questions: Questions are adjusted based on the user's experience level, ensuring relevance and appropriate difficulty.
- Detailed Feedback and Insights: Receive detailed feedback on your performance, including strengths, areas for improvement, and actionable tips.
- Question Bank: Access a wide range of interview questions across different domains and difficulty levels.
- Overall Grade: Receive an overall grade for each interview session, providing a quick assessment of your performance.
- Recent Interviews: Easily access and review your recent interview sessions directly from the home page.

## Getting Started

To get started with the AI-Powered Mock Interview Platform, follow these steps:

1. Clone this repository:

   ```bash
   git clone https://github.com/modamaan/Ai-mock-Interview.git

   ```

2. Navigate to the project directory:

   ```bash
   cd ai-mock-interview

   ```

3. Install dependencies by running: `npm install` or `yarn install`

4. Start the Server `npm run dev` or `yarn dev`

5. Access the Application: Open your browser and go to http://localhost:3000 to access the application.

## Technologies Used

- Next.js: A React framework for building server-side rendered and static web applications.
- Gemini API: Provides an interface for accessing the AI interview functionalities.
- PostgreSQL: A powerful, open-source object-relational database system.
- Neon Serverless: A serverless deployment for PostgreSQL, offering scalability and ease of use.
- Drizzle ORM: An ORM that makes database interactions simpler and more intuitive.

## Architecture Overview

```mermaid
flowchart TD
   subgraph Client
      A[User Browser] --> B[Next.js UI (App Router Pages)]
   end

   B -->|"Start Interview" submit form| G[/api/generate (POST)/]
   G --> GM[Gemini Model (Question Generation)]
   GM --> G
   G --> MI[(Postgres/Neon\nMockInterview table)]

   B -->|"Record Answer"| R[RecordAnswerSection]
   R -->|Stop Recording| T[/api/transcribe (POST)/]
   T --> GM2[Gemini Model (Audio Transcription)]
   GM2 --> T
   T --> R

   R -->|Build Feedback Prompt| F[Feedback Generation (Server Chat Session)]
   F --> GM3[Gemini Chat (Feedback & Rating)]
   GM3 --> F
   F --> UA[(Postgres/Neon\nUserAnswer table)]

   MI --> D[Dashboard / Recent Interviews]
   UA --> D

   subgraph External Services
      GM -->|API Key| KV[(Environment Vars)]
      GM2 -->|API Key| KV
      GM3 -->|API Key| KV
      MI -. Drizzle ORM .-> DB[(Neon/Postgres)]
      UA -. Drizzle ORM .-> DB
   end
```

### Data Flow Summary

- User creates interview → `/api/generate` asks Gemini for 5 Q&A pairs → stored in `MockInterview`.
- User records answer → audio sent to `/api/transcribe` → Gemini returns transcript → appended to `userAnswer`.
- After recording stops and transcript length threshold met → feedback prompt sent via Gemini chat → rating + feedback stored in `UserAnswer`.
- Dashboard aggregates `MockInterview` and `UserAnswer` to display progress & feedback.

## API Endpoints

| Endpoint          | Method | Request Body                                    | Description                                                                     | Success Response                                                   |
| ----------------- | ------ | ----------------------------------------------- | ------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `/api/generate`   | POST   | `{ "prompt": string }`                          | Generates 5 structured interview questions (Q&A) based on role/desc/experience. | `{ "questions": [ {"Question": string, "Answer": string}, ... ] }` |
| `/api/transcribe` | POST   | `{ "base64Audio": string, "mimeType": string }` | Transcribes recorded audio blob to plain text.                                  | `{ "text": string }`                                               |

### Feedback Generation (Implicit)

Currently performed server-side (not a separate endpoint) via `getChatSession()` inside `RecordAnswerSection.jsx`:
Returns JSON with fields `{ rating, feedback }` which is persisted to `UserAnswer`.

## Environment Variables

| Variable                            | Purpose                                                         |
| ----------------------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk frontend key for authentication.                          |
| `CLERK_SECRET_KEY`                  | Clerk server-side operations.                                   |
| `NEXT_PUBLIC_GEMINI_API_KEY`        | Gemini API key used server-side for generation & transcription. |
| `NEXT_PUBLIC_DRIZZLE_DB_URL`        | Postgres (Neon) connection string for Drizzle ORM.              |
| `NEXT_PUBLIC_INFORMATION`           | UI informational banner content.                                |
| `NEXT_PUBLIC_QUESTION_NOTE`         | UI tip displayed near interview questions.                      |

## Database Schema (High-Level)

- `MockInterview`: Stores generated Q&A set per interview (`mockId`, JSON blob, role, desc, experience, creator, createdAt).
- `UserAnswer`: Stores each user answer with transcript, AI rating & feedback.

## Error Handling Overview

- `/api/generate`: Validates JSON shape; returns 502 if Gemini output malformed.
- `/api/transcribe`: Returns 400 for invalid audio, 502 for empty Gemini response, 500 for internal errors.
- Feedback JSON parsing: Cleans fences/commas; on failure shows toast instead of crashing.

## Future Improvements

- Dedicated `/api/feedback` endpoint for clearer separation & retries.
- Streaming transcription for long answers.
- Caching model responses (e.g., similar job role requests) to reduce latency.
- Role-based difficulty scaling (junior/mid/senior) using adaptive prompt templates.

## Usage

To use the AI-Powered Mock Interview Platform, follow these guidelines:

- Create an Account: Sign up to start your mock interview sessions.
- Choose Interview Type: Select the type of interview (e.g., technical, behavioral) and job role
- Start Interview: Begin your mock interview and respond to the AI-generated questions.
- Receive Feedback: After completing the interview, get detailed feedback and insights to improve.
- Review Recent Interviews: Access your most recent interviews directly from the home page for quick review and continued improvement.

## Feedback

If you have any feedback, please reach me at [mohamedamaan319@gmail.com](mailto:mohamedamaan319@gmail.com) or connect with me on [LinkedIn](https://www.linkedin.com/in/mohamedamaan319/).

## Contributing

Contributions are welcome! If you'd like to contribute to this project, please follow these steps:

1. Fork this repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them to your branch.
4. Push your changes to your forked repository.
5. Submit a pull request to the main repository.

## Support

Show your support by 🌟 the project!!
