# Use an existing image as a base
#FROM node:20
FROM node:14
# Set the working directory
#WORKDIR /sgoinfre
WORKDIR /sgoinfre

# Copy the app.js file
COPY index.html .
COPY server.js .
COPY style.css .
COPY buttons.js .
COPY titles.js .

COPY tournoi_index.html .
COPY tournoi_script.js .
COPY tournoi_style.css .

COPY jeu_index.html .
COPY jeu_script.js .
COPY jeu_style.css .

COPY computer_index.html .
COPY computer_script.js .
COPY computer_style.css .

COPY xss_form.js .

# Expose the port that the app listens on
EXPOSE 3000

# Define the command to run the app
CMD ["node", "server.js"]