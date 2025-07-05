# desafio_inno_tech-
chat react node

## Docker Setup

To run both the frontend and backend using Docker, follow these steps:

1.  **Build the Docker images:**

    ```bash
    docker-compose build
    ```

2.  **Run the Docker containers:**

    ```bash
    docker-compose up
    ```

    This will start both the backend (on port 3000) and the frontend (on port 8080). You can access the frontend in your browser at `http://localhost:8080`.

3.  **Stop the Docker containers (optional):**

    To stop the running containers, press `Ctrl+C` in the terminal where `docker-compose up` is running. To remove the containers, networks, and volumes created by `up`,

    ```bash
    docker-compose down
    ```

    **Important:** Remember to replace `YOUR_OPENROUTER_URL` and `YOUR_OPENROUTER_API_KEY` in `docker-compose.yml` with your actual OpenRouter API credentials for the backend to function correctly.
