# EventPress

EventPress is a Next.js-based web application designed to help event organizers create and manage event pages easily, similar to how WordPress helps users build websites. It serves as a middleman between event organizers and attendees, providing a structured way to display event details.

## Core Features

### Hierarchical Event Structure
- Main Event Page → Booth Details → Activity Details

### Easy Page Builder
- Organizers can customize their event pages using prebuilt components.

### User Roles
- **Organizers**: Manage event details and page customization.
- **Attendees**: Browse event pages and explore booths/activities.
- **Admin/Developers**: Maintain and update the system.

### Next.js-Based for Performance & Scalability

## Project Purpose

EventPress is built as a university student project to provide an open-house information distribution solution, making it easy for event organizers to share structured details with attendees.

## Getting Started

First, clone the project and install the dependencies:

```bash
git clone <repository-url>
cd EventPress
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:8000](http://localhost:8000) with your browser to see the result.

### Why Port 8000?

The port 8000 is chosen because:
- The `80` at the front signifies the HTTP context, which typically uses port 80.
- The following `0` indicates that this is the first project running on the local device. The number will add up according to the number of projects running.
- The final `0` indicates that the project is still in the development/test state. If the project passes this state, the number will add up accordingly.

If port 8000 is already in use or you encounter an error with it, try using another port by typing:

```bash
npx next dev -p <port_number>
# for example
npx next dev -p 8080
```

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Configuration Files

This project mainly uses `config.json` to store project configuration, including database connection and other settings. This is similar to using `.env` files in other projects. However, there are also uses of `.env` and `.env.local` files for some library or framework credentials.

You might need to ask for these files from the repository owner, Ote. You can contact Ote through Discord if you already have the contact, but it is also fine to reach out via email at ratnaritjumnong@gmail.com.

## Collaborators

- [OteEnded](https://github.com/OteEnded)
- [xMickeys](https://github.com/xMickeyS)

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!