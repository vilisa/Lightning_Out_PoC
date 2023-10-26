# Proof of Concept: LWC + Lightning Out + Node.js

# What is this?
This is one of two repos that will help you get started with **Lightning Out** in Node.js application to render **Lightning Components** both **Aura** and **LWC**.

> This repo contains the Node.js server built using Typescript, express and ejs.

# How to use it?
Configure the ENV and execute the Node.js server.

# How to configure the Node.js application?
- First, rebuild the **node_modules** folder by executing `npm install`
- Open VS Code and find the `.env` file
- Update the content using the information at the end of the script that creates the scrach org and the security token.
- Start the web server, by hitting `F5`
- Once it has compiled, open a web browser and navigate to either `http://localhost:5000` or `https://localhost:5001`

**Note:** The Node.js web server is using a self-signed certificate which is required for HTTPS, but obviously is not secured. When you open the "secured" site, the browser is going to report a warning but you can bypass it and get to the content. When you deploy this to a real server, and use a good certificate, this problem will not happen any more.

### Note
- Modified fork of: `https://github.com/eltoroit/ET_LWC_Out_NodeJS` 
- Described in article: `https://eltoroit.medium.com/lightning-web-components-support-lightning-out-5a79c513302f`

- NEVER store the private keys in a repository! They are private! I only stored the private key (domain.key) here because it’s a self-signed certificate and I do not need to protect it.