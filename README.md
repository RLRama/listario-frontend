# listario-frontend

This UI is a frontend SvelteKit app, built as a companion to an API-driven service ([listario-backend](https://github.com/RLRama/listario-backend)).

# Tech stack

- TypeScript
- SvelteKit/Svelte
- SvelteStrap

# Features

- Response UI (mobile + desktop)

# Getting started

## Native setup

1. Clone, move into directory and create your .env

```bash
git clone https://github.com/RLRama/listario-frontend.git
cd listario-frontend
cp .env.example .env
nano .env # then fill with valid API route
```

2. You can either:
   
   * Start development server
     
     * ```bash
       npm install
       npm run dev # you can use bun instead
       ```

   * Build a production version
     
     * ```bash
       npm run build
       npm run preview # preview the production build
       ```

4. Access the UI at http://localhost:5173/

> To deploy your app, you may need to install an [adapter](https://svelte.dev/docs/kit/adapters) for your target environment.
   
# Environment variables

- See [.env.example](./.env.example)

# Key takeaways

- Built reactive UI with SvelteKit, Typescript and SvelteStrap
- Learned how to manage the API contract from the frontend perspective

# Roadmap

- [x] Correct consumption of backend companion API
- [x] Live deployment (on [Vercel](https://listario.vercel.app/]))
- [ ] Night mode
- [ ] i18n

# License

Project licensed under [MIT](./LICENSE) license.

# Contact

> Ramiro Ignacio Rios Lopez
> 
> [LinkedIn](https://www.linkedin.com/in/rlrama/) - [Email](mailto:rl.ramiro11@gmail.com) - [GitHub](https://github.com/RLRama) - [Personal website](https://rlrama.onrender.com/)
