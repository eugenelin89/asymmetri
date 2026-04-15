# Asymmetri Website Deployment Runbook

This document explains:
1. how to set up the Asymmetri website on the existing DigitalOcean droplet
2. how to update the website after code changes

This setup assumes:
- domain registrar / DNS: Namecheap
- web server: Nginx
- app: Next.js
- Linux host: Ubuntu on a DigitalOcean droplet
- existing deploy user: `django-user`
- app path: `/var/www/asymmetri`
- systemd service name: `asymmetri`
- domain: `asymmetri.co`
- www domain: `www.asymmetri.co`

---

## Architecture Overview

Traffic flow:

`Browser -> DNS -> Nginx -> Next.js app on port 3000`

Ownership model:
- application code and build files: `django-user`
- Nginx, Certbot, and systemd: `root` / `sudo`

Actual login flow used on this server:
- standard login is via the DigitalOcean web console as `root`
- switch to `django-user` for application work
- switch back to `root` for system tasks

Recommended shell flow:
- log in as `root`
- run `su - django-user` for code updates, installs, and builds
- run `exit` to return to `root`
- run `systemctl`, Certbot, and Nginx commands as `root`

General rule:
- **Code work** = `django-user`
- **System work** = `root` or `sudo`

---

# Part 1 — First-Time Website Setup

## Step 1: Configure DNS in Namecheap

In Namecheap, under the DNS settings for `asymmetri.co`, set:

- `A Record` for `@` pointing to the droplet IP
- `A Record` for `www` pointing to the droplet IP

Example:

- `A Record` → `@` → `143.244.183.161`
- `A Record` → `www` → `143.244.183.161`

Remove any conflicting records such as:
- Namecheap parking CNAME
- URL redirect records

### Verify DNS from your Mac

```bash
dig +short asymmetri.co
dig +short www.asymmetri.co
```

Both should return the droplet IP.

---

## Step 2: Prepare the app directory on the server

Log into the droplet as `root` and create the app folder.

```bash
mkdir -p /var/www/asymmetri
chown -R django-user:django-user /var/www/asymmetri
```

This gives the application directory to `django-user`, while leaving system configuration under root control.

---

## Step 3: Clone the code from GitHub

Standard shell flow starts as `root`, then switches to `django-user`.

From `root`:

```bash
su - django-user
cd /var/www/asymmetri
```

Clone the repository:

```bash
git clone YOUR_GITHUB_REPO_URL .
```

Then verify the files:

```bash
ls
```

You should see files such as `package.json`, `app`, `public`, and Next.js config files.

## Step 4: Verify Node and npm

As `django-user`:

```bash
node -v
npm -v
```

In the working deployment, the server had:

- `node v22.22.2`
- `npm 10.9.7`

Also verify the paths:

```bash
which node
which npm
```

In the working deployment, both were in `/usr/bin/`.

---

## Step 5: Install dependencies and build the site

As `django-user`:

```bash
cd /var/www/asymmetri
npm install
npm run build
```

If the build fails, fix the build issue before continuing.

---

## Step 6: Start the app temporarily and test locally

As `django-user`:

```bash
npm run start
```

This starts the production server, usually on port `3000`.

Open a second terminal on the server and test:

```bash
curl -I http://127.0.0.1:3000
```

Expected result:
- a valid HTTP response such as `200 OK`
- headers showing `X-Powered-By: Next.js`

Do not move on until this works.

---

## Step 7: Configure Nginx

Switch back to `root`:

```bash
exit
```

Create the Nginx site config:

```bash
nano /etc/nginx/sites-available/asymmetri.co
```

Paste:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name asymmetri.co www.asymmetri.co;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Enable the site:

```bash
ln -s /etc/nginx/sites-available/asymmetri.co /etc/nginx/sites-enabled/
```

If the symlink already exists, that is fine.

Test and reload Nginx:

```bash
nginx -t
systemctl reload nginx
```

---

## Step 8: Test plain HTTP from your Mac

```bash
curl -I http://asymmetri.co
curl -I http://www.asymmetri.co
```

Expected result:
- `200 OK`
- `Server: nginx`
- `X-Powered-By: Next.js`

If you get `502 Bad Gateway`, Nginx is working but the app is not reachable on port `3000`.

If you get a tiny default HTML page, Nginx is still serving the default site instead of the new site block.

---

## Step 9: Create a systemd service so the app stays alive

Do **not** rely on a manually opened terminal running `npm run start`.

As `root`, create:

```bash
nano /etc/systemd/system/asymmetri.service
```

Paste:

```ini
[Unit]
Description=Asymmetri Next.js
After=network.target

[Service]
Type=simple
User=django-user
WorkingDirectory=/var/www/asymmetri
Environment=NODE_ENV=production
Environment=PORT=3000
ExecStart=/usr/bin/npm run start
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Reload and start the service:

```bash
systemctl daemon-reload
systemctl enable asymmetri
systemctl start asymmetri
systemctl status asymmetri
```

Expected result:
- service shows `active (running)`
- logs show Next.js starting on port `3000`

Useful checks:

```bash
curl -I http://127.0.0.1:3000
ss -tulpn | grep 3000
journalctl -u asymmetri -n 100 --no-pager
```

Once the service is confirmed working, stop any manually started `npm run start` process.

---

## Step 10: Add HTTPS with Let’s Encrypt

As `root`:

```bash
certbot --nginx -d asymmetri.co -d www.asymmetri.co
```

Choose the option to redirect HTTP traffic to HTTPS.

Verify renewal:

```bash
certbot renew --dry-run
```

---

## Step 11: Final verification

From your Mac:

```bash
curl -I https://asymmetri.co
curl -I https://www.asymmetri.co
```

You should get successful HTTPS responses.

Also check the running service on the server:

```bash
systemctl status asymmetri
```

---

# Part 2 — How to Update the Website

When the site code changes, the update flow is:

`git pull -> npm install -> npm run build -> restart service`

## Important rule

Run these as **django-user**:
- `git pull`
- `npm install`
- `npm run build`

Run this as **root** or with **sudo**:
- `systemctl restart asymmetri`

Do **not** run app build commands as root.

---

## Standard update steps

### 1. Log in as root

In normal operation on this server, the login starts as `root`.

```bash
ssh root@143.244.183.161
```

Or use the DigitalOcean web console.

### 2. Switch to django-user for app work

```bash
su - django-user
cd /var/www/asymmetri
```

### 3. Pull latest code

```bash
git pull origin main
```

Replace `main` if you deploy from a different branch.

### 4. Install dependencies

```bash
npm install
```

This is especially important if `package.json` or lockfiles changed.

### 5. Build the site

```bash
npm run build
```

### 6. Return to root

```bash
exit
```

### 7. Restart the service as root

```bash
systemctl restart asymmetri
```

If instead you are logged in directly as `django-user` via SSH, use:

```bash
sudo systemctl restart asymmetri
```

### 8. Verify the service

```bash
systemctl status asymmetri
```

### 9. Verify the live site

From your Mac:

```bash
curl -I https://asymmetri.co
```

## One-line update workflow

### If following the normal root-first console flow

```bash
su - django-user
cd /var/www/asymmetri
git pull origin main
npm install
npm run build
exit
systemctl restart asymmetri
systemctl status asymmetri
```

### If logged in directly as django-user via SSH

```bash
cd /var/www/asymmetri
git pull origin main
npm install
npm run build
sudo systemctl restart asymmetri
sudo systemctl status asymmetri
```

# Troubleshooting

## If HTTP returns 502 Bad Gateway

Nginx is working, but it cannot reach the Next.js app.

Check:

```bash
systemctl status asymmetri
curl -I http://127.0.0.1:3000
journalctl -u asymmetri -n 100 --no-pager
```

---

## If HTTP returns the default Nginx page

Nginx is not matching the correct site config.

Check:

```bash
ls -l /etc/nginx/sites-enabled
grep -R "asymmetri.co" /etc/nginx/sites-available /etc/nginx/sites-enabled
nginx -t
```

---

## If the service fails to start

Check logs:

```bash
journalctl -u asymmetri -n 100 --no-pager
```

Common causes:
- build was not run
- wrong working directory
- wrong `ExecStart` path
- app code has runtime error

---

## If changes do not appear live

Usually one of these was missed:
- forgot `git pull`
- forgot `npm run build`
- forgot to restart `asymmetri`

---

# Command Summary

## First-time setup

```bash
# as root
mkdir -p /var/www/asymmetri
chown -R django-user:django-user /var/www/asymmetri

# as django-user
cd /var/www/asymmetri
git clone YOUR_GITHUB_REPO_URL .
node -v
npm -v
npm install
npm run build
npm run start

# in another shell
curl -I http://127.0.0.1:3000

# as root
nano /etc/nginx/sites-available/asymmetri.co
ln -s /etc/nginx/sites-available/asymmetri.co /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
nano /etc/systemd/system/asymmetri.service
systemctl daemon-reload
systemctl enable asymmetri
systemctl start asymmetri
systemctl status asymmetri
certbot --nginx -d asymmetri.co -d www.asymmetri.co
certbot renew --dry-run
```

## Regular update

```bash
# as django-user
cd /var/www/asymmetri
git pull origin main
npm install
npm run build
sudo systemctl restart asymmetri
sudo systemctl status asymmetri
```

---

# Final Notes

- The normal operational flow on this server is:
  - log in as `root`
  - switch to `django-user` for app work
  - return to `root` for service and system commands
- Do app work as `django-user`
- Do system work as `root` or `sudo`
- `systemctl restart asymmetri` must be run with root privileges
- If already logged in as `root`, run:
  - `systemctl restart asymmetri`
- If logged in as `django-user`, run:
  - `sudo systemctl restart asymmetri`
- Do not use `sudo npm install`
- Do not use `sudo npm run build`
- Do not rely on a manually open terminal to keep the site alive

The proper long-term setup is:
- Nginx handles the domain and TLS
- systemd keeps the app alive
- `django-user` owns and updates the app code
- updates are done with pull, build, restart

